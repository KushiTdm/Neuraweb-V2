#!/usr/bin/env node
/**
 * Google Indexing API — force l'indexation de toutes les URLs du sitemap.
 *
 * Prérequis :
 *   1. Créer un Service Account sur Google Cloud Console
 *   2. Activer l'API "Indexing API"
 *   3. Ajouter l'email du service account comme propriétaire dans Google Search Console
 *   4. Télécharger la clé JSON → placer à scripts/service-account.json
 *      OU exporter GOOGLE_SERVICE_ACCOUNT_KEY_PATH=/chemin/vers/key.json
 *
 * Usage :
 *   node scripts/indexing.js                    # URL_UPDATED sur toutes les URLs
 *   node scripts/indexing.js --type=URL_DELETED # signaler suppression
 *   node scripts/indexing.js --dry-run          # lister sans appeler l'API
 *   node scripts/indexing.js --limit=50         # limiter le nombre d'URLs
 *
 * Quota par défaut : 200 requêtes/jour. Demander un upgrade via le formulaire Google si besoin.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const SITEMAP_URL = 'https://neuraweb.tech/sitemap.xml';
const INDEXING_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/indexing';

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = 'true'] = a.replace(/^--/, '').split('=');
    return [k, v];
  })
);

const NOTIFY_TYPE = args.type || 'URL_UPDATED';
const DRY_RUN = args['dry-run'] === 'true';
const LIMIT = args.limit ? parseInt(args.limit, 10) : Infinity;
const KEY_PATH =
  process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH ||
  path.join(__dirname, 'service-account.json');

// ───────────────────────── HTTP helpers ─────────────────────────
function httpsRequest(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () =>
        resolve({ status: res.statusCode, headers: res.headers, body: data })
      );
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

// ───────────────────────── JWT (RS256) ─────────────────────────
function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function buildJWT(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: serviceAccount.client_email,
    scope: SCOPE,
    aud: TOKEN_ENDPOINT,
    exp: now + 3600,
    iat: now,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(
    JSON.stringify(claim)
  )}`;
  const signature = crypto
    .createSign('RSA-SHA256')
    .update(unsigned)
    .sign(serviceAccount.private_key);
  return `${unsigned}.${base64url(signature)}`;
}

async function getAccessToken(serviceAccount) {
  const jwt = buildJWT(serviceAccount);
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: jwt,
  }).toString();

  const { status, body: responseBody } = await httpsRequest(
    TOKEN_ENDPOINT,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
      },
    },
    body
  );

  const parsed = JSON.parse(responseBody);
  if (status !== 200 || !parsed.access_token) {
    throw new Error(`Token error (${status}): ${responseBody}`);
  }
  return parsed.access_token;
}

// ───────────────────── Sitemap parsing ─────────────────────
async function fetchUrl(url) {
  const { status, body } = await httpsRequest(url, { method: 'GET' });
  if (status !== 200) throw new Error(`GET ${url} → ${status}`);
  return body;
}

function extractLocs(xml) {
  const locs = [];
  const regex = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) locs.push(match[1].trim());
  return locs;
}

async function collectAllUrls(rootSitemap) {
  const xml = await fetchUrl(rootSitemap);
  const isIndex = /<sitemapindex[\s>]/i.test(xml);
  if (!isIndex) return extractLocs(xml);

  const childSitemaps = extractLocs(xml);
  const all = [];
  for (const child of childSitemaps) {
    const childXml = await fetchUrl(child);
    all.push(...extractLocs(childXml));
  }
  return all;
}

// ───────────────────── Indexing API call ─────────────────────
async function notifyUrl(url, accessToken) {
  const payload = JSON.stringify({ url, type: NOTIFY_TYPE });
  const { status, body } = await httpsRequest(
    INDEXING_ENDPOINT,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    },
    payload
  );
  return { status, body };
}

// ───────────────────────── Main ─────────────────────────
(async () => {
  console.log(`\n[Indexing API] type=${NOTIFY_TYPE} dryRun=${DRY_RUN}`);

  const urls = await collectAllUrls(SITEMAP_URL);
  const unique = [...new Set(urls)].slice(0, LIMIT);
  console.log(`[Indexing API] ${unique.length} URLs collectées depuis ${SITEMAP_URL}`);

  if (DRY_RUN) {
    unique.forEach((u) => console.log(`  - ${u}`));
    return;
  }

  if (!fs.existsSync(KEY_PATH)) {
    console.error(`\nClé service account introuvable : ${KEY_PATH}`);
    console.error('Définissez GOOGLE_SERVICE_ACCOUNT_KEY_PATH ou placez le fichier à ce chemin.');
    process.exit(1);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  const accessToken = await getAccessToken(serviceAccount);
  console.log('[Indexing API] Access token obtenu\n');

  let ok = 0;
  let failed = 0;
  const errors = [];

  for (let i = 0; i < unique.length; i++) {
    const url = unique[i];
    try {
      const { status, body } = await notifyUrl(url, accessToken);
      if (status >= 200 && status < 300) {
        ok++;
        console.log(`  ✓ [${i + 1}/${unique.length}] ${url}`);
      } else {
        failed++;
        errors.push({ url, status, body });
        console.log(`  ✗ [${i + 1}/${unique.length}] ${url} → HTTP ${status}`);
      }
    } catch (err) {
      failed++;
      errors.push({ url, error: err.message });
      console.log(`  ✗ [${i + 1}/${unique.length}] ${url} → ${err.message}`);
    }
    // Throttle léger pour rester sous la limite de concurrence de Google
    await new Promise((r) => setTimeout(r, 150));
  }

  console.log(`\n[Indexing API] Terminé : ${ok} succès / ${failed} échecs`);
  if (errors.length) {
    const logFile = path.join(__dirname, `indexing-errors-${Date.now()}.json`);
    fs.writeFileSync(logFile, JSON.stringify(errors, null, 2));
    console.log(`Détails des erreurs : ${logFile}`);
  }
})().catch((err) => {
  console.error('\n[Indexing API] Erreur fatale :', err);
  process.exit(1);
});
