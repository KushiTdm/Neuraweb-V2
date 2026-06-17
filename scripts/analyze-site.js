#!/usr/bin/env node
/**
 * Analyse SEO complète — GSC + GA4 + PageSpeed
 *
 * Usage :
 *   node scripts/analyze-site.js                    # audit global 28 jours
 *   node scripts/analyze-site.js --phase=keywords   # analyse mots-clés
 *   node scripts/analyze-site.js --phase=content    # contenu qui fonctionne / à optimiser
 *   node scripts/analyze-site.js --phase=mobile     # mobile vs desktop
 *   node scripts/analyze-site.js --phase=indexation # erreurs d'indexation
 *   node scripts/analyze-site.js --days=90          # période personnalisée
 *   node scripts/analyze-site.js --ga4=123456789    # forcer le Property ID GA4
 */

const fs   = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

// ─── Configuration ──────────────────────────────────────────────────────────

const SITE_URL     = 'sc-domain:neuraweb.tech';
const BASE_URL     = 'https://neuraweb.tech';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const GSC_SCOPE    = 'https://www.googleapis.com/auth/webmasters.readonly';
const GA4_SCOPE    = 'https://www.googleapis.com/auth/analytics.readonly';

const KEY_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH
  || path.join(__dirname, 'service-account.json');

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, v = 'true'] = a.replace(/^--/, '').split('=');
    return [k, v];
  })
);

const PHASE    = args.phase || 'global';
const DAYS     = parseInt(args.days || '28', 10);
const GA4_ID   = args.ga4 || process.env.GA4_PROPERTY_ID || '';

const today    = new Date();
const endDate  = today.toISOString().split('T')[0];
const startD   = new Date(today);
startD.setDate(startD.getDate() - DAYS);
const startDate = startD.toISOString().split('T')[0];

// ─── Couleurs terminal ───────────────────────────────────────────────────────

const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  red:    '\x1b[31m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  blue:   '\x1b[34m',
  magenta:'\x1b[35m',
};

const ok  = s => `${C.green}✓${C.reset} ${s}`;
const err = s => `${C.red}✗${C.reset} ${s}`;
const warn = s => `${C.yellow}⚠${C.reset} ${s}`;
const info = s => `${C.cyan}ℹ${C.reset} ${s}`;

// ─── HTTP helpers ────────────────────────────────────────────────────────────

function httpsRequest(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function postJSON(url, payload, token) {
  const body = JSON.stringify(payload);
  return httpsRequest(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  }, body);
}

function getJSON(url, token) {
  return httpsRequest(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ─── JWT / OAuth2 ────────────────────────────────────────────────────────────

function base64url(input) {
  return Buffer.from(input).toString('base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function buildJWT(sa, scope) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim  = { iss: sa.client_email, scope, aud: TOKEN_ENDPOINT, exp: now + 3600, iat: now };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const sig = crypto.createSign('RSA-SHA256').update(unsigned).sign(sa.private_key);
  return `${unsigned}.${base64url(sig)}`;
}

async function getToken(sa, scope) {
  const jwt  = buildJWT(sa, scope);
  const body = new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }).toString();
  const { status, body: rb } = await httpsRequest(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) },
  }, body);
  const parsed = JSON.parse(rb);
  if (status !== 200 || !parsed.access_token) throw new Error(`Auth failed (${status}): ${rb}`);
  return parsed.access_token;
}

// ─── GSC API ─────────────────────────────────────────────────────────────────

async function gscQuery(token, dimensions, extra = {}) {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`;
  const payload = {
    startDate,
    endDate,
    dimensions,
    rowLimit: 1000,
    ...extra,
  };
  const { status, body } = await postJSON(url, payload, token);
  const data = JSON.parse(body);
  if (status !== 200) throw new Error(`GSC error (${status}): ${body.slice(0, 300)}`);
  return data.rows || [];
}

// ─── GA4 API ─────────────────────────────────────────────────────────────────

async function ga4Query(token, propertyId, dimensions, metrics, extra = {}) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
  const payload = {
    dateRanges: [{ startDate, endDate }],
    dimensions: dimensions.map(n => ({ name: n })),
    metrics: metrics.map(n => ({ name: n })),
    limit: 200,
    ...extra,
  };
  const { status, body } = await postJSON(url, payload, token);
  const data = JSON.parse(body);
  if (status !== 200) throw new Error(`GA4 error (${status}): ${body.slice(0, 300)}`);
  return data;
}

// ─── Formatters ──────────────────────────────────────────────────────────────

function pct(v) { return v != null ? (v * 100).toFixed(1) + '%' : 'n/a'; }
function pos(v) { return v != null ? v.toFixed(1) : 'n/a'; }
function num(v) { return v != null ? Number(v).toLocaleString('fr-FR') : 'n/a'; }

function table(rows, cols) {
  const widths = cols.map(c => Math.max(c.label.length, ...rows.map(r => String(r[c.key] ?? '').length)));
  const sep = widths.map(w => '─'.repeat(w + 2)).join('┼');
  const head = cols.map((c, i) => c.label.padEnd(widths[i])).join(' │ ');
  console.log(`\n${C.bold}┌─${sep.replace(/┼/g, '─┬─')}─┐${C.reset}`);
  console.log(`${C.bold}│ ${head} │${C.reset}`);
  console.log(`${C.bold}├─${sep}─┤${C.reset}`);
  for (const row of rows) {
    const line = cols.map((c, i) => String(row[c.key] ?? '').padEnd(widths[i])).join(' │ ');
    console.log(`│ ${line} │`);
  }
  console.log(`└─${sep.replace(/┼/g, '─┴─')}─┘`);
}

function section(title) {
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`${C.bold}${C.cyan}  ${title}${C.reset}`);
  console.log(`${'═'.repeat(70)}`);
}

function bullet(items) {
  items.forEach((item, i) => console.log(`  ${C.bold}${i + 1}.${C.reset} ${item}`));
}

// ─── Phase : Audit Global ────────────────────────────────────────────────────

async function phaseGlobal(gscToken, ga4Token) {
  section(`AUDIT GLOBAL — ${startDate} → ${endDate} (${DAYS} jours)`);

  // GSC : top pages
  console.log('\n' + info('Récupération des données Search Console…'));
  const pagesData = await gscQuery(gscToken, ['page']);

  const pages = pagesData
    .map(r => ({
      page: r.keys[0].replace(BASE_URL, '') || '/',
      impressions: r.impressions,
      clicks: r.clicks,
      ctr: r.ctr,
      position: r.position,
    }))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 20);

  // GSC : requêtes globales
  const queriesData = await gscQuery(gscToken, ['query']);
  const totalClicks = queriesData.reduce((s, r) => s + r.clicks, 0);
  const totalImpressions = queriesData.reduce((s, r) => s + r.impressions, 0);
  const avgCTR = totalClicks / totalImpressions;
  const avgPos = queriesData.reduce((s, r) => s + r.position * r.impressions, 0) / totalImpressions;

  console.log(`\n${C.bold}Métriques globales GSC :${C.reset}`);
  console.log(`  Clicks totaux    : ${C.bold}${num(totalClicks)}${C.reset}`);
  console.log(`  Impressions      : ${C.bold}${num(totalImpressions)}${C.reset}`);
  console.log(`  CTR moyen        : ${C.bold}${pct(avgCTR)}${C.reset}`);
  console.log(`  Position moyenne : ${C.bold}${pos(avgPos)}${C.reset}`);

  table(
    pages.slice(0, 15).map(p => ({
      page:        p.page.length > 45 ? p.page.slice(0, 42) + '…' : p.page,
      impressions: num(p.impressions),
      clicks:      num(p.clicks),
      ctr:         pct(p.ctr),
      position:    pos(p.position),
      statut:      p.ctr < 0.03 ? '🔴 CTR faible' : p.position <= 3 ? '🟢 Top 3' : p.position <= 10 ? '🟡 Page 1' : '⚪ Page 2+',
    })),
    [
      { key: 'page', label: 'Page' },
      { key: 'impressions', label: 'Impressions' },
      { key: 'clicks', label: 'Clicks' },
      { key: 'ctr', label: 'CTR' },
      { key: 'position', label: 'Position' },
      { key: 'statut', label: 'Statut' },
    ]
  );

  // Insights
  const lowCTR = pages.filter(p => p.ctr < 0.03 && p.impressions > 200);
  const quickWins = pages.filter(p => p.position >= 2 && p.position <= 8);
  const top3 = pages.filter(p => p.position <= 3);

  section('5 INSIGHTS CLÉS');
  bullet([
    `${C.yellow}Quick wins :${C.reset} ${quickWins.length} pages en position 2-8 → optimisation title/meta pour gagner du terrain`,
    `${C.red}CTR faible :${C.reset} ${lowCTR.length} pages avec >200 impressions mais CTR < 3% → titles trop génériques`,
    `${C.green}Top 3 :${C.reset} ${top3.length} pages en position ≤3 → maintenir et renforcer le maillage interne`,
    `Trafic organique : ${num(totalClicks)} clicks sur ${num(totalImpressions)} impressions (CTR moyen ${pct(avgCTR)})`,
    `Position moyenne : ${pos(avgPos)} — ${avgPos < 10 ? C.green + 'bonne' : C.yellow + 'à améliorer'}${C.reset}`,
  ]);

  // GA4
  if (ga4Token && GA4_ID) {
    await phaseGA4Global(ga4Token);
  } else {
    console.log('\n' + warn('GA4 non configuré — ajouter --ga4=PROPERTY_ID pour les données d\'engagement'));
  }

  // Recommandations
  section('RECOMMANDATIONS ACTIONNABLES');
  bullet([
    `Optimiser les ${lowCTR.slice(0, 3).map(p => C.bold + p.page + C.reset).join(', ')} : réécrire les meta titles (< 60 chars, mot-clé en tête, chiffre ou année)`,
    `Pages en position 4-8 : ajouter des FAQ sections, des liens internes pointant vers ces pages, enrichir le contenu`,
    `Surveiller le CTR mobile vs desktop (lancer avec --phase=mobile)`,
    `Analyser les mots-clés manqués (lancer avec --phase=keywords)`,
  ]);

  section('CHECKLIST DE SUIVI');
  console.log(`  ${C.dim}Dans 7 jours :${C.reset}`);
  quickWins.slice(0, 3).forEach(p => console.log(`  ☐ Vérifier la position de ${p.page}`));
  console.log(`  ${C.dim}Dans 30 jours :${C.reset}`);
  lowCTR.slice(0, 3).forEach(p => console.log(`  ☐ Mesurer l'impact CTR de ${p.page}`));
}

// ─── Phase : GA4 Global ──────────────────────────────────────────────────────

async function phaseGA4Global(token) {
  console.log('\n' + info('Récupération des données Google Analytics 4…'));
  try {
    const data = await ga4Query(token, GA4_ID,
      ['pagePath'],
      ['sessions', 'engagementRate', 'averageSessionDuration', 'bounceRate']
    );

    const rows = (data.rows || []).map(r => ({
      page:        r.dimensionValues[0].value,
      sessions:    parseInt(r.metricValues[0].value, 10),
      engagement:  parseFloat(r.metricValues[1].value),
      duration:    parseFloat(r.metricValues[2].value),
      bounce:      parseFloat(r.metricValues[3].value),
    })).sort((a, b) => b.sessions - a.sessions).slice(0, 15);

    const totalSessions = rows.reduce((s, r) => s + r.sessions, 0);
    console.log(`\n${C.bold}Métriques globales GA4 :${C.reset}`);
    console.log(`  Sessions totales : ${C.bold}${num(totalSessions)}${C.reset}`);

    table(
      rows.map(r => ({
        page:       r.page.length > 40 ? r.page.slice(0, 37) + '…' : r.page,
        sessions:   num(r.sessions),
        engagement: pct(r.engagement),
        duration:   Math.round(r.duration) + 's',
        statut:     r.engagement < 0.4 ? '🔴 Faible' : r.engagement > 0.6 ? '🟢 Fort' : '🟡 Moyen',
      })),
      [
        { key: 'page', label: 'Page' },
        { key: 'sessions', label: 'Sessions' },
        { key: 'engagement', label: 'Engagement' },
        { key: 'duration', label: 'Durée moy.' },
        { key: 'statut', label: 'Statut' },
      ]
    );
  } catch (e) {
    console.log(warn(`GA4 inaccessible : ${e.message}`));
    console.log(C.dim + '  → Vérifier que le service account a accès à la propriété GA4' + C.reset);
  }
}

// ─── Phase : Mots-clés ───────────────────────────────────────────────────────

async function phaseKeywords(gscToken) {
  section(`ANALYSE MOTS-CLÉS — ${startDate} → ${endDate}`);

  console.log(info('Récupération des requêtes…'));
  const rows = await gscQuery(gscToken, ['query']);

  const queries = rows.map(r => ({
    query:       r.keys[0],
    impressions: r.impressions,
    clicks:      r.clicks,
    ctr:         r.ctr,
    position:    r.position,
  }));

  // Catégorisation
  const quickWins    = queries.filter(q => q.position >= 4 && q.position <= 10).sort((a, b) => b.impressions - a.impressions);
  const missed       = queries.filter(q => q.position > 10 && q.impressions > 50).sort((a, b) => b.impressions - a.impressions);
  const winners      = queries.filter(q => q.position <= 3).sort((a, b) => b.clicks - a.clicks);
  const lowCTR       = queries.filter(q => q.ctr < 0.02 && q.impressions > 200).sort((a, b) => b.impressions - a.impressions);

  // Intent detection (FR/EN/ES)
  const informational = /^(comment|quoi|pourquoi|qu[e']est|what|how|why|cómo|qué|por qué)/i;
  const transactional = /(prix|price|tarif|acheter|devis|buy|agence|prestataire|coût)/i;

  section('REQUÊTES QUICK WINS (position 4-10)');
  console.log(C.dim + `→ ${quickWins.length} requêtes à optimiser pour gagner du terrain vers le Top 3\n` + C.reset);
  table(
    quickWins.slice(0, 20).map(q => ({
      query:      q.query.length > 40 ? q.query.slice(0, 37) + '…' : q.query,
      impr:       num(q.impressions),
      clicks:     num(q.clicks),
      ctr:        pct(q.ctr),
      pos:        pos(q.position),
      intent:     informational.test(q.query) ? 'Info' : transactional.test(q.query) ? 'Trans' : 'Nav',
    })),
    [
      { key: 'query', label: 'Requête' },
      { key: 'impr', label: 'Impressions' },
      { key: 'clicks', label: 'Clicks' },
      { key: 'ctr', label: 'CTR' },
      { key: 'pos', label: 'Position' },
      { key: 'intent', label: 'Intention' },
    ]
  );

  section('REQUÊTES MANQUÉES (position > 10, >50 impressions)');
  console.log(C.dim + `→ ${missed.length} opportunités de contenu à créer ou renforcer\n` + C.reset);
  table(
    missed.slice(0, 20).map(q => ({
      query:  q.query.length > 45 ? q.query.slice(0, 42) + '…' : q.query,
      impr:   num(q.impressions),
      pos:    pos(q.position),
      action: informational.test(q.query) ? 'Créer article blog' : transactional.test(q.query) ? 'Optimiser page service' : 'Renforcer contenu',
    })),
    [
      { key: 'query', label: 'Requête manquée' },
      { key: 'impr', label: 'Impressions' },
      { key: 'pos', label: 'Position' },
      { key: 'action', label: 'Action recommandée' },
    ]
  );

  section('REQUÊTES GAGNANTES (Top 3)');
  table(
    winners.slice(0, 10).map(q => ({
      query:  q.query.length > 45 ? q.query.slice(0, 42) + '…' : q.query,
      clicks: num(q.clicks),
      impr:   num(q.impressions),
      ctr:    pct(q.ctr),
      pos:    pos(q.position),
    })),
    [
      { key: 'query', label: 'Requête' },
      { key: 'clicks', label: 'Clicks' },
      { key: 'impr', label: 'Impressions' },
      { key: 'ctr', label: 'CTR' },
      { key: 'pos', label: 'Position' },
    ]
  );

  section('REQUÊTES CTR FAIBLE (<2%, >200 impressions)');
  console.log(C.dim + '→ Ces pages sont vues mais pas cliquées. Réécrire les titles/meta descriptions.\n' + C.reset);
  table(
    lowCTR.slice(0, 15).map(q => ({
      query:  q.query.length > 40 ? q.query.slice(0, 37) + '…' : q.query,
      impr:   num(q.impressions),
      ctr:    pct(q.ctr),
      pos:    pos(q.position),
    })),
    [
      { key: 'query', label: 'Requête' },
      { key: 'impr', label: 'Impressions' },
      { key: 'ctr', label: 'CTR' },
      { key: 'pos', label: 'Position' },
    ]
  );

  section('5 INSIGHTS MOTS-CLÉS');
  bullet([
    `${C.yellow}Quick wins :${C.reset} ${quickWins.length} requêtes en position 4-10 → optimiser les pages existantes (H1, FAQ, maillage interne)`,
    `${C.red}Opportunités manquées :${C.reset} ${missed.length} requêtes avec du volume mais hors page 1 → créer du contenu ciblé`,
    `${C.green}Requêtes gagnantes :${C.reset} ${winners.length} en Top 3 — renforcer le maillage interne vers ces pages`,
    `CTR faible : ${lowCTR.length} requêtes avec forte visibilité mais peu de clicks → réécrire les meta titles/descriptions`,
    `Intention informational domine — le blog est le levier principal pour capturer du trafic`,
  ]);
}

// ─── Phase : Contenu ─────────────────────────────────────────────────────────

async function phaseContent(gscToken, ga4Token) {
  section(`ANALYSE CONTENU — ${startDate} → ${endDate}`);

  console.log(info('Récupération GSC par page…'));
  const gscRows = await gscQuery(gscToken, ['page']);

  const gscMap = {};
  gscRows.forEach(r => {
    const p = r.keys[0].replace(BASE_URL, '') || '/';
    gscMap[p] = { impressions: r.impressions, clicks: r.clicks, ctr: r.ctr, position: r.position };
  });

  let ga4Map = {};
  if (ga4Token && GA4_ID) {
    try {
      console.log(info('Récupération GA4 par page…'));
      const ga4 = await ga4Query(ga4Token, GA4_ID, ['pagePath'], ['sessions', 'engagementRate', 'averageSessionDuration']);
      (ga4.rows || []).forEach(r => {
        ga4Map[r.dimensionValues[0].value] = {
          sessions:   parseInt(r.metricValues[0].value, 10),
          engagement: parseFloat(r.metricValues[1].value),
          duration:   parseFloat(r.metricValues[2].value),
        };
      });
    } catch (e) {
      console.log(warn(`GA4 inaccessible : ${e.message}`));
    }
  }

  // Croisement
  const combined = Object.keys(gscMap).map(page => {
    const g = gscMap[page];
    const a = ga4Map[page] || {};
    return {
      page,
      impressions: g.impressions,
      clicks:      g.clicks,
      ctr:         g.ctr,
      position:    g.position,
      sessions:    a.sessions || 0,
      engagement:  a.engagement || null,
      duration:    a.duration || null,
    };
  }).filter(p => p.impressions > 50);

  const perf    = combined.filter(p => p.clicks > 50 && p.position <= 10 && (p.engagement === null || p.engagement > 0.5));
  const optim   = combined.filter(p => (p.ctr < 0.05 && p.impressions > 300) || (p.engagement !== null && p.engagement < 0.4 && p.sessions > 20));
  const suppr   = combined.filter(p => p.impressions < 100 && p.clicks < 5 && p.position > 20);

  section('CONTENU QUI FONCTIONNE');
  table(
    perf.slice(0, 10).map(p => ({
      page:       p.page.length > 38 ? p.page.slice(0, 35) + '…' : p.page,
      clicks:     num(p.clicks),
      ctr:        pct(p.ctr),
      pos:        pos(p.position),
      engagement: p.engagement !== null ? pct(p.engagement) : 'n/a',
      durée:      p.duration !== null ? Math.round(p.duration) + 's' : 'n/a',
    })),
    [
      { key: 'page', label: 'Page' },
      { key: 'clicks', label: 'Clicks' },
      { key: 'ctr', label: 'CTR' },
      { key: 'pos', label: 'Position' },
      { key: 'engagement', label: 'Engagement' },
      { key: 'durée', label: 'Durée moy.' },
    ]
  );

  section('CONTENU À OPTIMISER');
  table(
    optim.slice(0, 10).map(p => ({
      page:       p.page.length > 35 ? p.page.slice(0, 32) + '…' : p.page,
      impr:       num(p.impressions),
      ctr:        pct(p.ctr),
      pos:        pos(p.position),
      engagement: p.engagement !== null ? pct(p.engagement) : 'n/a',
      problème:   p.ctr < 0.03 ? 'CTR faible' : p.engagement !== null && p.engagement < 0.4 ? 'Engagement faible' : 'Position à améliorer',
    })),
    [
      { key: 'page', label: 'Page' },
      { key: 'impr', label: 'Impressions' },
      { key: 'ctr', label: 'CTR' },
      { key: 'pos', label: 'Position' },
      { key: 'engagement', label: 'Engagement' },
      { key: 'problème', label: 'Problème' },
    ]
  );

  section('CONTENU CANDIDAT À LA SUPPRESSION / REDIRECTION');
  if (suppr.length === 0) {
    console.log(ok('Aucune page avec faible trafic + faible position détectée'));
  } else {
    table(
      suppr.slice(0, 10).map(p => ({
        page: p.page.length > 50 ? p.page.slice(0, 47) + '…' : p.page,
        impr: num(p.impressions),
        clicks: num(p.clicks),
        pos:  pos(p.position),
      })),
      [
        { key: 'page', label: 'Page' },
        { key: 'impr', label: 'Impressions' },
        { key: 'clicks', label: 'Clicks' },
        { key: 'pos', label: 'Position moy.' },
      ]
    );
  }
}

// ─── Phase : Mobile vs Desktop ───────────────────────────────────────────────

async function phaseMobile(gscToken, ga4Token) {
  section(`MOBILE VS DESKTOP — ${startDate} → ${endDate}`);

  console.log(info('Récupération GSC par device…'));
  const mobileRows  = await gscQuery(gscToken, ['page', 'device'], { dimensionFilterGroups: [{ filters: [{ dimension: 'device', operator: 'equals', expression: 'MOBILE' }] }] });
  const desktopRows = await gscQuery(gscToken, ['page', 'device'], { dimensionFilterGroups: [{ filters: [{ dimension: 'device', operator: 'equals', expression: 'DESKTOP' }] }] });

  const mobileMap  = {};
  mobileRows.forEach(r => { mobileMap[r.keys[0].replace(BASE_URL, '') || '/'] = r; });
  const desktopMap = {};
  desktopRows.forEach(r => { desktopMap[r.keys[0].replace(BASE_URL, '') || '/'] = r; });

  // Totaux
  const mTot = { clicks: 0, impressions: 0, ctrSum: 0, posSum: 0, n: 0 };
  mobileRows.forEach(r => { mTot.clicks += r.clicks; mTot.impressions += r.impressions; mTot.ctrSum += r.ctr; mTot.posSum += r.position; mTot.n++; });
  const dTot = { clicks: 0, impressions: 0, ctrSum: 0, posSum: 0, n: 0 };
  desktopRows.forEach(r => { dTot.clicks += r.clicks; dTot.impressions += r.impressions; dTot.ctrSum += r.ctr; dTot.posSum += r.position; dTot.n++; });

  console.log(`\n${C.bold}Comparatif global :${C.reset}`);
  console.log(`  ${'Métrique'.padEnd(20)} ${'Mobile'.padEnd(15)} ${'Desktop'.padEnd(15)}`);
  console.log(`  ${'─'.repeat(52)}`);
  console.log(`  ${'Clicks'.padEnd(20)} ${num(mTot.clicks).padEnd(15)} ${num(dTot.clicks)}`);
  console.log(`  ${'Impressions'.padEnd(20)} ${num(mTot.impressions).padEnd(15)} ${num(dTot.impressions)}`);
  console.log(`  ${'CTR moyen'.padEnd(20)} ${pct(mTot.clicks / mTot.impressions).padEnd(15)} ${pct(dTot.clicks / dTot.impressions)}`);
  console.log(`  ${'Position moyenne'.padEnd(20)} ${pos(mTot.posSum / mTot.n).padEnd(15)} ${pos(dTot.posSum / dTot.n)}`);

  // Pages avec écart CTR mobile/desktop significatif
  const allPages = [...new Set([...Object.keys(mobileMap), ...Object.keys(desktopMap)])];
  const compared = allPages.map(page => {
    const m = mobileMap[page];
    const d = desktopMap[page];
    return {
      page,
      mCTR: m ? m.ctr : null,
      dCTR: d ? d.ctr : null,
      mPos: m ? m.position : null,
      dPos: d ? d.position : null,
      delta: (d && m) ? d.ctr - m.ctr : null,
    };
  }).filter(p => p.delta !== null && Math.abs(p.delta) > 0.01 && (mobileMap[p.page]?.impressions || 0) > 100)
    .sort((a, b) => (b.delta || 0) - (a.delta || 0));

  section('PAGES AVEC ÉCART CTR MOBILE/DESKTOP > 1%');
  table(
    compared.slice(0, 15).map(p => ({
      page:  p.page.length > 35 ? p.page.slice(0, 32) + '…' : p.page,
      mCTR:  p.mCTR !== null ? pct(p.mCTR) : 'n/a',
      dCTR:  p.dCTR !== null ? pct(p.dCTR) : 'n/a',
      delta: p.delta !== null ? (p.delta > 0 ? '+' : '') + pct(p.delta) : 'n/a',
      alerte: p.delta > 0.02 ? '⚠ Title non adapté mobile' : p.delta < -0.02 ? '📱 Mobile plus performant' : '—',
    })),
    [
      { key: 'page', label: 'Page' },
      { key: 'mCTR', label: 'CTR Mobile' },
      { key: 'dCTR', label: 'CTR Desktop' },
      { key: 'delta', label: 'Écart (D-M)' },
      { key: 'alerte', label: 'Alerte' },
    ]
  );

  // GA4 par device
  if (ga4Token && GA4_ID) {
    try {
      console.log('\n' + info('GA4 : engagement par device…'));
      const ga4 = await ga4Query(ga4Token, GA4_ID, ['deviceCategory'], ['sessions', 'engagementRate', 'averageSessionDuration']);
      console.log('');
      (ga4.rows || []).forEach(r => {
        const device = r.dimensionValues[0].value;
        const sessions = r.metricValues[0].value;
        const eng = parseFloat(r.metricValues[1].value);
        const dur = Math.round(parseFloat(r.metricValues[2].value));
        const icon = device === 'mobile' ? '📱' : device === 'desktop' ? '🖥' : '📟';
        console.log(`  ${icon} ${C.bold}${device.toUpperCase()}${C.reset} — Sessions: ${num(sessions)} | Engagement: ${pct(eng)} | Durée moy: ${dur}s ${eng < 0.4 ? C.red + '(faible)' : C.green + '(bon)'}${C.reset}`);
      });
    } catch (e) {
      console.log(warn(`GA4 inaccessible : ${e.message}`));
    }
  }

  section('RECOMMANDATIONS MOBILE');
  bullet([
    'Vérifier les titles : les titles longs (> 55 chars) sont tronqués sur mobile → impact CTR',
    'Google index mobile-first : si position mobile > desktop, vérifier la vitesse mobile (lancer pagespeed.js)',
    `Pages avec CTR mobile < CTR desktop : priorité à l'optimisation des snippets (emoji en début de title, chiffres, question)`,
    'Tester les pages critiques avec DevTools (mode responsive) et corriger les CLS/LCP mobile',
  ]);
}

// ─── Phase : Indexation ──────────────────────────────────────────────────────

async function phaseIndexation(gscToken) {
  section(`ERREURS D'INDEXATION — ${startDate} → ${endDate}`);

  // Sitemap analysis
  console.log(info('Récupération du sitemap…'));
  const { body: sitemapXml } = await httpsRequest(`${BASE_URL}/sitemap.xml`, { method: 'GET' });
  const locs = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = re.exec(sitemapXml)) !== null) locs.push(match[1].trim());

  console.log(`  ${num(locs.length)} URLs dans le sitemap`);

  // Pages indexées selon GSC
  console.log(info('Vérification des pages indexées via GSC…'));
  const gscPages = await gscQuery(gscToken, ['page']);
  const indexedUrls = new Set(gscPages.map(r => r.keys[0]));

  const notIndexed = locs.filter(u => !indexedUrls.has(u) && !indexedUrls.has(u.replace('https://www.neuraweb.tech', BASE_URL)));

  console.log(`\n${C.bold}État d'indexation :${C.reset}`);
  console.log(`  URLs dans sitemap     : ${C.bold}${num(locs.length)}${C.reset}`);
  console.log(`  URLs avec trafic GSC  : ${C.bold}${num(gscPages.length)}${C.reset}`);
  console.log(`  URLs potentiellement non indexées : ${C.bold}${C.red}${num(notIndexed.length)}${C.reset}`);

  if (notIndexed.length > 0) {
    section('URLs DU SITEMAP SANS TRAFIC GSC (candidates à soumettre)');
    notIndexed.slice(0, 20).forEach((url, i) => {
      const path = url.replace(BASE_URL, '');
      console.log(`  ${C.dim}${i + 1}.${C.reset} ${path}`);
    });
    if (notIndexed.length > 20) console.log(C.dim + `  … et ${notIndexed.length - 20} autres` + C.reset);

    section('ACTION REQUISE');
    console.log(warn(`${notIndexed.length} URLs dans le sitemap n'ont pas de trafic GSC`));
    console.log('');
    console.log('  Ces URLs peuvent être :');
    console.log('  1. Nouvelles pages non encore indexées → soumettre via Indexing API');
    console.log('  2. Pages avec contenu faible → enrichir avant soumission');
    console.log('  3. Pages déjà indexées mais sans trafic (position > 50)');
    console.log('');
    console.log(`  Pour soumettre : ${C.cyan}node scripts/indexing.js${C.reset}`);
    console.log(`  Ou pour une URL spécifique : ${C.cyan}node scripts/indexing.js --limit=1${C.reset}`);
  } else {
    console.log(ok('Toutes les URLs du sitemap ont du trafic GSC — bonne indexation !'));
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

(async () => {
  console.log(C.bold + '\n🔍 Analyse SEO NeuraWeb — ' + new Date().toLocaleDateString('fr-FR') + C.reset);
  console.log(C.dim + `Période : ${startDate} → ${endDate} (${DAYS} jours) | Phase : ${PHASE}` + C.reset);

  if (!fs.existsSync(KEY_PATH)) {
    console.error(err(`Service account introuvable : ${KEY_PATH}`));
    process.exit(1);
  }

  const sa = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  console.log(C.dim + `Service account : ${sa.client_email}` + C.reset);

  // Authentification GSC
  let gscToken = null;
  try {
    gscToken = await getToken(sa, GSC_SCOPE);
    console.log(ok('Google Search Console — authentifié'));
  } catch (e) {
    console.log(err(`GSC auth : ${e.message}`));
    process.exit(1);
  }

  // Authentification GA4
  let ga4Token = null;
  if (GA4_ID) {
    try {
      ga4Token = await getToken(sa, GA4_SCOPE);
      console.log(ok(`Google Analytics 4 (Property ${GA4_ID}) — authentifié`));
    } catch (e) {
      console.log(warn(`GA4 auth : ${e.message} — analyse GSC uniquement`));
    }
  } else {
    console.log(C.dim + 'GA4 non configuré (ajouter --ga4=PROPERTY_ID)' + C.reset);
  }

  try {
    if (PHASE === 'global')      await phaseGlobal(gscToken, ga4Token);
    else if (PHASE === 'keywords')   await phaseKeywords(gscToken);
    else if (PHASE === 'content')    await phaseContent(gscToken, ga4Token);
    else if (PHASE === 'mobile')     await phaseMobile(gscToken, ga4Token);
    else if (PHASE === 'indexation') await phaseIndexation(gscToken);
    else {
      console.log(err(`Phase inconnue : ${PHASE}. Utiliser : global, keywords, content, mobile, indexation`));
    }
  } catch (e) {
    console.error('\n' + err(`Erreur : ${e.message}`));
    if (e.message.includes('403') || e.message.includes('401')) {
      console.log('\n' + warn('Problème d\'autorisation détecté. Vérifier que :'));
      console.log('  1. Le service account est ajouté comme propriétaire dans Search Console');
      console.log(`     Email : ${sa.client_email}`);
      console.log('  2. Le service account a accès à la propriété GA4 (si --ga4 fourni)');
    }
    process.exit(1);
  }

  console.log('\n' + C.dim + '═'.repeat(70) + C.reset);
  console.log(C.bold + C.green + '✅ Analyse terminée' + C.reset);
  console.log(C.dim + `Pour d'autres analyses : node scripts/analyze-site.js --phase=keywords|content|mobile|indexation` + C.reset + '\n');
})().catch(e => {
  console.error('\n' + err('Erreur fatale : ' + e.message));
  process.exit(1);
});
