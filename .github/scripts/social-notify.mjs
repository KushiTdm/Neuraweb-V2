// Notifie le webhook n8n pour chaque article MDX ajouté/modifié.
// Sans dépendance : Node 20+ (fetch global, fs). Le frontmatter n'est PAS parsé ici
// volontairement — on envoie le fichier brut (`raw`) et n8n le parse, pour garder
// l'Action « bête » et concentrer la logique métier dans le workflow.
//
// Env attendu :
//   N8N_WEBHOOK_URL, N8N_WEBHOOK_SECRET, CHANGED_FILES (séparés par espaces), COMMIT_SHA

import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

const { N8N_WEBHOOK_URL, N8N_WEBHOOK_SECRET, CHANGED_FILES = '', COMMIT_SHA = '' } = process.env;

if (!N8N_WEBHOOK_URL) {
  console.error('❌ N8N_WEBHOOK_URL manquant.');
  process.exit(1);
}

const files = CHANGED_FILES.split(/\s+/).filter(Boolean);
if (files.length === 0) {
  console.log('Aucun fichier à traiter.');
  process.exit(0);
}

// Langue = sous-dossier : project/content/blog/en/foo.mdx -> en ; sinon fr.
function langFromPath(path) {
  const m = path.match(/content\/blog\/(en|es)\//);
  return m ? m[1] : 'fr';
}

let failures = 0;

for (const path of files) {
  const slug = basename(path).replace(/\.mdx$/, '');
  const lang = langFromPath(path);

  let raw;
  try {
    raw = readFileSync(path, 'utf8');
  } catch (err) {
    console.error(`⚠️  Lecture impossible (${path}) : ${err.message} — ignoré.`);
    continue;
  }

  const payload = { slug, lang, path, commit: COMMIT_SHA, raw };

  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(N8N_WEBHOOK_SECRET ? { 'x-webhook-secret': N8N_WEBHOOK_SECRET } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      failures++;
      const body = await res.text().catch(() => '');
      console.error(`❌ ${slug} (${lang}) → HTTP ${res.status} ${body.slice(0, 300)}`);
    } else {
      console.log(`✅ ${slug} (${lang}) → notifié`);
    }
  } catch (err) {
    failures++;
    console.error(`❌ ${slug} (${lang}) → ${err.message}`);
  }
}

if (failures > 0) {
  console.error(`Terminé avec ${failures} échec(s).`);
  process.exit(1);
}
console.log('Tous les articles ont été notifiés.');
