// Parseur Markdown de l'article de blog (contenu MDX du repo, pas d'entrée utilisateur).
// Produit du HTML aux couleurs de la charte (Chypre / Crème) + la liste des titres pour le sommaire.

export interface BlogHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface ParsedBlogContent {
  html: string;
  headings: BlogHeading[];
}

const LINK_CLS =
  'font-semibold text-chypre underline decoration-chypre/40 underline-offset-4 transition-colors hover:decoration-chypre';
const CODE_CLS = 'rounded bg-chypre/10 px-1.5 py-0.5 font-mono text-[0.88em] text-chypre';

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function plainText(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*`_]/g, '')
    .trim();
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderInline(text: string): string {
  const codes: string[] = [];
  const withoutCode = text.replace(/`([^`]+)`/g, (_, c: string) => {
    codes.push(`<code class="${CODE_CLS}">${escapeHtml(c)}</code>`);
    return `\u0000${codes.length - 1}\u0000`;
  });
  return withoutCode
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" class="${LINK_CLS}">$1</a>`)
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-chypre">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/\u0000(\d+)\u0000/g, (_, i: string) => codes[Number(i)]);
}

const isSeparatorRow = (l: string) => /^\|[\s\-:|]+\|$/.test(l.trim());
const isTableRow = (l: string) => /^\s*\|/.test(l) && /\|\s*$/.test(l);

function renderTable(lines: string[]): string {
  const dataLines = lines.filter((l) => l.trim() && !isSeparatorRow(l));
  if (dataLines.length < 2) return '';
  const splitRow = (l: string) => l.trim().split('|').slice(1, -1);
  const head = splitRow(dataLines[0])
    .map((c) => `<th class="whitespace-nowrap border-b-2 border-chypre/30 bg-chypre/10 px-4 py-3 text-left font-semibold text-chypre sm:whitespace-normal">${renderInline(c.trim())}</th>`)
    .join('');
  const body = dataLines
    .slice(1)
    .map((row) => `<tr class="odd:bg-transparent even:bg-chypre/[0.04]">${splitRow(row).map((c) => `<td class="border-b border-chypre/10 px-4 py-3 align-top text-chypre/90">${renderInline(c.trim())}</td>`).join('')}</tr>`)
    .join('');
  // Défilement horizontal dans le conteneur : la page ne déborde jamais (mobile).
  return `<div class="my-8 overflow-x-auto rounded-2xl border border-chypre/15"><table class="w-full min-w-[32rem] border-collapse text-sm"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function renderQuote(qLines: string[]): string {
  const parts: string[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length) {
      parts.push(`<ul class="my-2 list-disc space-y-1.5 pl-5 marker:text-chypre/60">${list.map((li) => `<li>${renderInline(li)}</li>`).join('')}</ul>`);
      list = [];
    }
  };
  for (const raw of qLines.map((l) => l.replace(/^>\s?/, ''))) {
    const t = raw.trim();
    if (!t) { flush(); continue; }
    const m = t.match(/^[-*] (.*)$/);
    if (m) { list.push(m[1]); continue; }
    flush();
    parts.push(`<p class="mb-1.5">${renderInline(t)}</p>`);
  }
  flush();
  return `<blockquote class="my-8 rounded-2xl border border-chypre/15 border-l-4 border-l-chypre bg-chypre/[0.07] p-5 text-chypre/90 sm:p-6 [&>p:first-child]:mb-2 [&>p:first-child]:font-display [&>p:first-child]:text-lg [&>p:first-child]:font-bold [&>p:first-child]:text-chypre">${parts.join('')}</blockquote>`;
}

export function parseBlogMarkdown(content: string): ParsedBlogContent {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  const headings: BlogHeading[] = [];
  const seen = new Map<string, number>();

  const uniqueId = (text: string) => {
    const base = slugify(text) || 'section';
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n === 0 ? base : `${base}-${n + 1}`;
  };

  let i = 0;
  let para: string[] = [];
  const flushPara = () => {
    if (para.length) {
      out.push(`<p class="mb-5">${para.map(renderInline).join('<br />')}</p>`);
      para = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Bloc de code
    if (/^```/.test(trimmed)) {
      flushPara();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i].trim())) buf.push(lines[i++]);
      i++;
      out.push(`<pre class="my-8 overflow-x-auto rounded-2xl bg-chypre p-5 text-creme"><code class="whitespace-pre font-mono text-sm leading-relaxed">${escapeHtml(buf.join('\n'))}</code></pre>`);
      continue;
    }

    // Tableau
    if (isTableRow(line)) {
      flushPara();
      const buf: string[] = [];
      while (i < lines.length && isTableRow(lines[i])) buf.push(lines[i++]);
      out.push(renderTable(buf));
      continue;
    }

    // Citation / encadré « À retenir »
    if (/^>/.test(trimmed)) {
      flushPara();
      const buf: string[] = [];
      while (i < lines.length && /^>/.test(lines[i].trim())) buf.push(lines[i++].trim());
      out.push(renderQuote(buf));
      continue;
    }

    // Séparateur
    if (/^---+$/.test(trimmed)) {
      flushPara();
      // Un titre H2 suit presque toujours le séparateur et porte déjà son filet : pas de double trait
      let j = i + 1;
      while (j < lines.length && !lines[j].trim()) j++;
      if (!/^#{1,2} /.test(lines[j]?.trim() ?? '')) {
        out.push('<hr class="my-10 border-0 border-t border-chypre/20" />');
      }
      i++;
      continue;
    }

    // Titres
    const h = trimmed.match(/^(#{1,4}) (.+)$/);
    if (h) {
      flushPara();
      const depth = h[1].length;
      const raw = h[2].trim();
      if (depth <= 2) {
        const text = plainText(raw);
        const id = uniqueId(text);
        headings.push({ id, text, level: 2 });
        out.push(`<h2 id="${id}" class="mb-4 mt-14 scroll-mt-28 border-b border-chypre/15 pb-3 font-display text-2xl font-bold leading-tight text-chypre sm:text-[1.75rem]">${renderInline(raw)}</h2>`);
      } else if (depth === 3) {
        const text = plainText(raw);
        const id = uniqueId(text);
        headings.push({ id, text, level: 3 });
        out.push(`<h3 id="${id}" class="mb-3 mt-9 scroll-mt-28 font-display text-xl font-semibold leading-snug text-chypre">${renderInline(raw)}</h3>`);
      } else {
        out.push(`<h4 class="mb-2 mt-7 font-display text-lg font-semibold text-chypre">${renderInline(raw)}</h4>`);
      }
      i++;
      continue;
    }

    // Listes (à puces ou numérotées), items consécutifs regroupés
    const li = line.match(/^(\s*)([-*]|\d+\.) (.*)$/);
    if (li) {
      flushPara();
      const ordered = /\d/.test(li[2]);
      const items: string[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^(\s*)([-*]|\d+\.) (.*)$/);
        if (!m || /\d/.test(m[2]) !== ordered) break;
        const nested = m[1].length >= 2;
        // Lignes de continuation indentées (suite de l'item)
        let text = m[3];
        i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*([-*]|\d+\.) /.test(lines[i])) {
          text += ' ' + lines[i].trim();
          i++;
        }
        items.push(`<li${nested ? ' class="ml-5 list-[circle]"' : ''}>${renderInline(text)}</li>`);
      }
      const tag = ordered ? 'ol' : 'ul';
      const kind = ordered ? 'list-decimal marker:font-semibold marker:text-chypre' : 'list-disc marker:text-chypre/60';
      out.push(`<${tag} class="mb-6 ${kind} space-y-2 pl-6">${items.join('')}</${tag}>`);
      continue;
    }

    if (!trimmed) {
      flushPara();
      i++;
      continue;
    }

    para.push(trimmed);
    i++;
  }
  flushPara();

  return { html: out.join(''), headings };
}
