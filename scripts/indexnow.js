#!/usr/bin/env node
/**
 * IndexNow — soumet toutes les URLs du sitemap à Bing (et moteurs partenaires).
 *
 * Prérequis :
 *   1. Activer IndexNow dans Bing Webmaster Tools :
 *      https://www.bing.com/webmasters/indexnow → "Get started"
 *      Bing génère une clé et vérifie que le fichier .txt est accessible.
 *      INDEXNOW_KEY ci-dessous doit correspondre à la clé affichée dans Bing WMT.
 *   2. Le fichier de clé doit être accessible publiquement :
 *      https://neuraweb.tech/<INDEXNOW_KEY>.txt
 *
 * Usage :
 *   node scripts/indexnow.js              # soumet toutes les URLs
 *   node scripts/indexnow.js --dry-run    # liste sans appeler l'API
 *   node scripts/indexnow.js --limit=20   # limiter le nombre d'URLs
 *   INDEXNOW_KEY=<autre-clé> node scripts/indexnow.js  # surcharger la clé
 *
 * Quota : pas de limite officielle, mais Bing recommande de ne pas dépasser
 * 10 000 URLs par soumission batch. Le script splittera si nécessaire.
 *
 * ⚠️  Erreur 403 "UserForbiddedToAccessSite" ?
 *   → La clé doit être activée dans Bing Webmaster Tools avant tout appel API.
 *     Voir : https://www.bing.com/webmasters → IndexNow → configurer la clé.
 */

const https = require('https');

// Clé active — générée depuis Bing Webmaster Tools → IndexNow et vérifiée le 2026-06-09.
// Fichier hébergé : https://neuraweb.tech/cb1ea553f2a14f15a90d2189d947e4da.txt
// Peut être surchargée via INDEXNOW_KEY=<valeur> dans l'env.
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'cb1ea553f2a14f15a90d2189d947e4da';
const SITE_HOST = 'neuraweb.tech';
const SITEMAP_URL = `https://${SITE_HOST}/sitemap.xml`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const BATCH_SIZE = 10000;

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = 'true'] = a.replace(/^--/, '').split('=');
    return [k, v];
  })
);

const DRY_RUN = args['dry-run'] === 'true';
const LIMIT = args.limit ? parseInt(args.limit, 10) : Infinity;

// ───────────────────────── HTTP helpers ─────────────────────────
function httpsRequest(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () =>
        resolve({ status: res.statusCode, body: data })
      );
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function fetchText(url) {
  const { status, body } = await httpsRequest(url, { method: 'GET' });
  if (status !== 200) throw new Error(`GET ${url} → ${status}`);
  return body;
}

// ───────────────────── Sitemap parsing ─────────────────────
function extractLocs(xml) {
  const locs = [];
  const regex = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) locs.push(match[1].trim());
  return locs;
}

async function collectAllUrls(rootSitemap) {
  const xml = await fetchText(rootSitemap);
  if (!/<sitemapindex[\s>]/i.test(xml)) return extractLocs(xml);

  const childSitemaps = extractLocs(xml);
  const all = [];
  for (const child of childSitemaps) {
    const childXml = await fetchText(child);
    all.push(...extractLocs(childXml));
  }
  return all;
}

// ───────────────────── IndexNow API ─────────────────────
async function submitBatch(urlList) {
  const payload = JSON.stringify({
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`,
    urlList,
  });

  const { status, body } = await httpsRequest(
    INDEXNOW_ENDPOINT,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload),
      },
    },
    payload
  );

  return { status, body };
}

// ───────────────────────── Main ─────────────────────────
(async () => {
  console.log(`\n[IndexNow] dryRun=${DRY_RUN}`);

  const urls = await collectAllUrls(SITEMAP_URL);
  const unique = [...new Set(urls)].slice(0, LIMIT);
  console.log(`[IndexNow] ${unique.length} URLs collectées depuis ${SITEMAP_URL}`);

  if (DRY_RUN) {
    unique.forEach((u) => console.log(`  - ${u}`));
    return;
  }

  // Découpage en batches de BATCH_SIZE
  let ok = 0;
  let failed = 0;

  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = unique.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(unique.length / BATCH_SIZE);

    process.stdout.write(`[IndexNow] Batch ${batchNum}/${totalBatches} (${batch.length} URLs) ... `);

    try {
      const { status, body } = await submitBatch(batch);
      if (status >= 200 && status < 300) {
        ok += batch.length;
        console.log(`✓ HTTP ${status}`);
      } else {
        failed += batch.length;
        console.log(`✗ HTTP ${status}: ${body}`);
        if (status === 403) {
          console.log('\n  ⚠️  Erreur 403 : la clé IndexNow n\'est pas activée dans Bing Webmaster Tools.');
          console.log('  → Allez sur https://www.bing.com/webmasters → IndexNow → configurez la clé :');
          console.log(`  → Clé utilisée : ${INDEXNOW_KEY}`);
          console.log(`  → Fichier attendu : https://${SITE_HOST}/${INDEXNOW_KEY}.txt\n`);
          process.exit(1);
        }
      }
    } catch (err) {
      failed += batch.length;
      console.log(`✗ ${err.message}`);
    }

    // Délai entre batches pour ne pas surcharger
    if (i + BATCH_SIZE < unique.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  console.log(`\n[IndexNow] Terminé : ${ok} soumises / ${failed} échecs`);
  if (failed > 0) process.exit(1);
})().catch((err) => {
  console.error('\n[IndexNow] Erreur fatale :', err);
  process.exit(1);
});
