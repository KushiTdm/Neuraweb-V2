#!/usr/bin/env node
/**
 * Crée une campagne newsletter `pending_review` pour un article publié.
 * N'ENVOIE AUCUN EMAIL — la validation (envoi immédiat ou programmation
 * jour/heure) se fait depuis l'onglet Newsletter de l'app mobile.
 *
 * Usage :
 *   npm run newsletter:create-campaign -- --slug=mon-article --lang=fr
 *   node scripts/newsletter-create-campaign.js --slug=mon-article --lang=fr [--base=http://localhost:3000]
 *
 * Prérequis :
 *   NEWSLETTER_NOTIFY_SECRET défini dans l'environnement (même valeur que
 *   sur Vercel / dans le .env du serveur appelé).
 *
 * Ce script est un déclencheur MANUEL — l'automatisation via n8n (après le
 * commit GitHub du nouvel article) appelle la même route directement en
 * HTTP, voir docs/automation/n8n-blog-publish-workflow.json.
 */

const https = require('https');
const http = require('http');

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = 'true'] = a.replace(/^--/, '').split('=');
    return [k, v];
  })
);

const SLUG = args.slug;
const LANG = args.lang || 'fr';
const BASE_URL = args.base || 'https://neuraweb.fr';
const SECRET = process.env.NEWSLETTER_NOTIFY_SECRET;

if (!SLUG) {
  console.error('Usage: node scripts/newsletter-create-campaign.js --slug=<slug> --lang=fr|en|es [--base=URL]');
  process.exit(1);
}
if (!SECRET) {
  console.error('NEWSLETTER_NOTIFY_SECRET manquant dans l\'environnement.');
  process.exit(1);
}

const url = new URL('/api/newsletter/campaigns', BASE_URL);
const payload = JSON.stringify({ slug: SLUG, lang: LANG });
const client = url.protocol === 'https:' ? https : http;

const req = client.request(
  url,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'x-webhook-secret': SECRET,
    },
  },
  (res) => {
    let body = '';
    res.on('data', (chunk) => (body += chunk));
    res.on('end', () => {
      console.log(`HTTP ${res.statusCode}`);
      console.log(body);
      process.exit(res.statusCode >= 200 && res.statusCode < 300 ? 0 : 1);
    });
  }
);
req.on('error', (err) => {
  console.error('Erreur :', err.message);
  process.exit(1);
});
req.write(payload);
req.end();
