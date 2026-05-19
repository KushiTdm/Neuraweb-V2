#!/usr/bin/env node
/**
 * PageSpeed Insights API — audit complet mobile + desktop
 * Usage :
 *   node scripts/pagespeed.js                          → https://neuraweb.tech/
 *   node scripts/pagespeed.js /fr/services             → sous-page
 *   PAGESPEED_API_KEY=xxx node scripts/pagespeed.js    → clé Google (recommandé)
 *
 * Sans clé : 4 req/min, résultats identiques au site public.
 * Clé gratuite : https://developers.google.com/speed/docs/insights/v5/get-started
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

// ─── Config ────────────────────────────────────────────────────────────────

// Lecture automatique de .env.local / .env pour PAGESPEED_API_KEY
function loadEnvKey() {
  const candidates = ['.env.local', '.env'];
  for (const file of candidates) {
    const envPath = path.join(__dirname, '..', file);
    if (!fs.existsSync(envPath)) continue;
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/^PAGESPEED_API_KEY\s*=\s*(.+)$/m);
    if (match) return match[1].trim().replace(/^["']|["']$/g, '');
  }
  return '';
}

const BASE_URL   = 'https://neuraweb.tech';
const PATH_ARG   = process.argv[2] || '/';
const TARGET_URL = BASE_URL + (PATH_ARG.startsWith('/') ? PATH_ARG : '/' + PATH_ARG);
const API_KEY    = process.env.PAGESPEED_API_KEY || loadEnvKey();
const STRATEGIES = ['mobile', 'desktop'];

// Audits à afficher même s'ils passent (métriques vitales)
const CORE_METRICS = [
  'first-contentful-paint',
  'largest-contentful-paint',
  'total-blocking-time',
  'cumulative-layout-shift',
  'speed-index',
  'interactive',
];

// ─── Helpers ───────────────────────────────────────────────────────────────
const RESET  = '\x1b[0m';
const BOLD   = '\x1b[1m';
const RED    = '\x1b[31m';
const YELLOW = '\x1b[33m';
const GREEN  = '\x1b[32m';
const CYAN   = '\x1b[36m';
const DIM    = '\x1b[2m';

function scoreColor(score) {
  if (score === null || score === undefined) return DIM;
  if (score >= 0.9) return GREEN;
  if (score >= 0.5) return YELLOW;
  return RED;
}

function scoreEmoji(score) {
  if (score === null || score === undefined) return '⚪';
  if (score >= 0.9) return '🟢';
  if (score >= 0.5) return '🟡';
  return '🔴';
}

function pct(score) {
  if (score === null || score === undefined) return 'n/a';
  return Math.round(score * 100).toString();
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error('JSON parse error: ' + body.slice(0, 200))); }
      });
    }).on('error', reject);
  });
}

function buildApiUrl(strategy) {
  const params = new URLSearchParams({
    url: TARGET_URL,
    strategy,
    locale: 'fr',
    category: ['performance', 'accessibility', 'best-practices', 'seo'].join('&category='),
  });
  if (API_KEY) params.set('key', API_KEY);
  // URLSearchParams joins multi-value with & automatically only for single values,
  // so build categories manually
  const cats = 'category=performance&category=accessibility&category=best-practices&category=seo';
  const base = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(TARGET_URL)}&strategy=${strategy}&locale=fr&${cats}`;
  return API_KEY ? base + `&key=${API_KEY}` : base;
}

// ─── Display ────────────────────────────────────────────────────────────────
function printSeparator(char = '─', width = 70) {
  console.log(DIM + char.repeat(width) + RESET);
}

function printHeader(text) {
  console.log('\n' + BOLD + CYAN + text + RESET);
  printSeparator();
}

function printScores(categories) {
  const order = ['performance', 'accessibility', 'best-practices', 'seo'];
  const labels = {
    'performance': 'Performance   ',
    'accessibility': 'Accessibilité ',
    'best-practices': 'Bonnes prat.  ',
    'seo': 'SEO           ',
  };
  for (const key of order) {
    const cat = categories[key];
    if (!cat) continue;
    const s = cat.score;
    const bar = buildBar(s);
    console.log(
      `  ${scoreEmoji(s)}  ${BOLD}${labels[key]}${RESET}  ` +
      `${scoreColor(s)}${pct(s).padStart(3)}${RESET}  ${DIM}${bar}${RESET}`
    );
  }
}

function buildBar(score, width = 20) {
  if (score === null || score === undefined) return '░'.repeat(width);
  const filled = Math.round(score * width);
  const color = score >= 0.9 ? '█' : score >= 0.5 ? '▓' : '░';
  return color.repeat(filled) + '░'.repeat(width - filled);
}

function printMetrics(audits) {
  printHeader('  📊 Core Web Vitals');
  for (const id of CORE_METRICS) {
    const a = audits[id];
    if (!a) continue;
    const val = a.displayValue || '—';
    const s = a.score;
    console.log(
      `  ${scoreEmoji(s)}  ${a.title.padEnd(35)} ${scoreColor(s)}${BOLD}${val}${RESET}`
    );
  }
}

function printFailingAudits(audits, categories) {
  // Gather all audit IDs referenced by each category
  const perfRefs = (categories['performance']?.auditRefs || []).map(r => r.id);
  const a11yRefs = (categories['accessibility']?.auditRefs || []).map(r => r.id);
  const bpRefs   = (categories['best-practices']?.auditRefs || []).map(r => r.id);

  const sections = [
    { label: '🔴 Performance — échecs', ids: perfRefs },
    { label: '🔵 Accessibilité — échecs', ids: a11yRefs },
    { label: '🟤 Bonnes pratiques — échecs', ids: bpRefs },
  ];

  for (const { label, ids } of sections) {
    const failing = ids
      .map(id => audits[id])
      .filter(a => a && a.score !== null && a.score < 1 && a.scoreDisplayMode !== 'notApplicable' && a.scoreDisplayMode !== 'manual')
      .sort((a, b) => (a.score ?? 1) - (b.score ?? 1));

    if (failing.length === 0) continue;

    printHeader('  ' + label);
    for (const a of failing) {
      const s = a.score;
      const savings = a.details?.overallSavingsMs
        ? ` ${DIM}(−${Math.round(a.details.overallSavingsMs)}ms)${RESET}`
        : a.displayValue ? ` ${DIM}→ ${a.displayValue}${RESET}` : '';
      console.log(`  ${scoreEmoji(s)}  ${BOLD}${a.title}${RESET}${savings}`);

      // Description courte
      if (a.description) {
        const desc = a.description.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/`/g, '');
        const short = desc.length > 120 ? desc.slice(0, 117) + '...' : desc;
        console.log(`      ${DIM}${short}${RESET}`);
      }

      // Détails table / list — gestion node, url, bytes, ms
      if (a.details?.items?.length > 0) {
        const headings = a.details.headings || [];
        const nodeKeys = new Set(headings.filter(h => h.itemType === 'node').map(h => h.key));

        for (const item of a.details.items.slice(0, 4)) {
          let printed = false;

          // Colonnes de type "node" (accessibilité)
          for (const key of nodeKeys) {
            const node = item[key];
            if (!node) continue;
            if (node.nodeLabel) {
              const label = node.nodeLabel.length > 60 ? node.nodeLabel.slice(0, 57) + '...' : node.nodeLabel;
              console.log(`      ${DIM}▸ [${label}]${RESET}`);
            }
            if (node.snippet) {
              const snip = node.snippet.length > 90 ? node.snippet.slice(0, 87) + '...' : node.snippet;
              console.log(`        ${DIM}${snip}${RESET}`);
            }
            if (node.explanation) {
              const expl = node.explanation.replace(/\n/g, ' ').slice(0, 110);
              console.log(`        ${DIM}⚠ ${expl}${RESET}`);
            }
            printed = true;
          }

          // Colonnes standards (url, bytes, ms, number)
          if (!printed) {
            const cols = headings.map(h => h.key).filter(Boolean);
            const parts = cols.map(col => {
              const v = item[col];
              if (!v) return null;
              if (typeof v === 'string') return v.length > 60 ? v.slice(0, 57) + '...' : v;
              if (typeof v === 'object' && v.type === 'url') return (v.value || '').slice(0, 55);
              if (typeof v === 'object' && v.type === 'bytes') return `${(v.value/1024).toFixed(1)} KB`;
              if (typeof v === 'object' && v.type === 'ms') return `${Math.round(v.value)}ms`;
              if (typeof v === 'number') return v.toFixed(0);
              return null;
            }).filter(Boolean);
            if (parts.length) console.log(`      ${DIM}▸ ${parts.join('  │  ')}${RESET}`);
          }
        }
        if (a.details.items.length > 4) {
          console.log(`      ${DIM}  … et ${a.details.items.length - 4} autre(s)${RESET}`);
        }
      }
      console.log();
    }
  }
}

function printOpportunities(audits, categories) {
  const perfRefs = (categories['performance']?.auditRefs || []);
  const opportunities = perfRefs
    .filter(r => r.group === 'load-opportunities')
    .map(r => audits[r.id])
    .filter(a => a && a.details?.overallSavingsMs > 100)
    .sort((a, b) => (b.details?.overallSavingsMs || 0) - (a.details?.overallSavingsMs || 0));

  if (opportunities.length === 0) return;
  printHeader('  ⚡ Opportunités (temps à gagner)');
  for (const a of opportunities) {
    const ms = Math.round(a.details.overallSavingsMs);
    const bar = '█'.repeat(Math.min(20, Math.ceil(ms / 100)));
    console.log(
      `  ${YELLOW}${BOLD}−${ms}ms${RESET}  ${a.title.padEnd(45)} ${DIM}${bar}${RESET}`
    );
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function runAudit(strategy) {
  const url = buildApiUrl(strategy);
  process.stdout.write(`\n⏳ Analyse ${strategy.toUpperCase()} en cours…`);
  const start = Date.now();
  const data = await fetchJSON(url);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  process.stdout.write(` ${DIM}(${elapsed}s)${RESET}\n`);

  if (data.error) {
    console.error(`${RED}Erreur API : ${data.error.message}${RESET}`);
    if (data.error.code === 400) {
      console.error(`${DIM}→ Vérifiez l'URL ou ajoutez PAGESPEED_API_KEY=votre_cle${RESET}`);
    }
    return;
  }

  const lhr = data.lighthouseResult;
  if (!lhr) {
    console.error(`${RED}Pas de résultat Lighthouse dans la réponse${RESET}`);
    return;
  }

  const { categories, audits } = lhr;
  const strat = strategy.toUpperCase();

  console.log('\n' + '═'.repeat(70));
  console.log(BOLD + `  📱 ${strat} — ${TARGET_URL}` + RESET);
  console.log('═'.repeat(70));

  printHeader('  📈 Scores');
  printScores(categories);

  printMetrics(audits);
  printOpportunities(audits, categories);
  printFailingAudits(audits, categories);
}

async function main() {
  console.log(BOLD + '\n🔍 PageSpeed Insights Audit' + RESET);
  console.log(DIM + `URL : ${TARGET_URL}` + RESET);
  if (!API_KEY) {
    console.log(DIM + '⚠️  Pas de clé API — limité à 4 req/min (résultats identiques)' + RESET);
    console.log(DIM + '   Pour ajouter une clé : PAGESPEED_API_KEY=xxx node scripts/pagespeed.js' + RESET);
  }

  for (const strategy of STRATEGIES) {
    try {
      await runAudit(strategy);
    } catch (err) {
      console.error(`${RED}Erreur ${strategy}: ${err.message}${RESET}`);
    }
    // Délai entre les requêtes sans clé API
    if (!API_KEY && strategy !== STRATEGIES[STRATEGIES.length - 1]) {
      process.stdout.write(`\n${DIM}Attente 15s entre les requêtes (sans clé API)…${RESET}`);
      await new Promise(r => setTimeout(r, 15000));
      process.stdout.write('\r' + ' '.repeat(55) + '\r');
    }
  }

  console.log('\n' + '═'.repeat(70));
  console.log(BOLD + '✅ Audit terminé' + RESET);
  console.log(DIM + `Pour analyser une page spécifique : node scripts/pagespeed.js /fr/services${RESET}\n`);
}

main().catch(err => {
  console.error(RED + 'Erreur fatale:', err.message + RESET);
  process.exit(1);
});
