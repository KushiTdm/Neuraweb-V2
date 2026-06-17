#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT = process.cwd();
const BASE_URL = 'https://neuraweb.tech';
const LANGUAGES = ['fr', 'en', 'es'];
const SITEMAP_PATH = path.join(ROOT, 'app', 'sitemap.ts');
const CONTENT_DIR = path.join(ROOT, 'content', 'blog');

const expectedStaticPages = [
  'developpement-web',
  'mobile-app-development',
  'equipe',
  'contact',
  'blog',
  'booking',
  'mentions-legales',
  'confidentialite',
  'conditions-utilisation',
];

const excludedRoutes = [
  '/[lang]/admin/hotel-tokens',
  '/[lang]/hotel-form',
  '/[lang]/blog/[slug]',
  '/[lang]/services', // redirect-only page → /:lang/developpement-web
  '/',
];

const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function routeFromPageFile(filePath) {
  const relative = path.relative(path.join(ROOT, 'app'), filePath);
  const route = relative
    .replace(/\/page\.tsx$/, '')
    .replace(/^page\.tsx$/, '/')
    .replace(/\\/g, '/');

  return route === '/' ? '/' : `/${route}`;
}

function listPageRoutes() {
  const routes = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name === 'page.tsx') {
        routes.push(routeFromPageFile(fullPath));
      }
    }
  }

  walk(path.join(ROOT, 'app'));
  return routes.sort();
}

function extractStaticPagesFromSitemap() {
  const source = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const match = source.match(/const STATIC_PAGES:[\s\S]*?= \{([\s\S]*?)\n\};/);
  if (!match) {
    fail('Could not find STATIC_PAGES in app/sitemap.ts.');
    return [];
  }

  const pages = [];
  for (const line of match[1].split('\n')) {
    const item = line.trim().match(/^['"]?([^'":\s]+)['"]?\s*:/);
    if (item) pages.push(item[1]);
  }
  return pages.sort();
}

function getBlogFiles(language) {
  const dir = language === 'fr' ? CONTENT_DIR : path.join(CONTENT_DIR, language);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => /\.mdx?$/.test(file))
    .sort()
    .map((file) => ({
      language,
      slug: file.replace(/\.mdx?$/, ''),
      filePath: path.join(dir, file),
    }));
}

function validateStaticRoutes(pageRoutes, sitemapStaticPages) {
  const FR_ONLY_ROUTES = ['sante', 'restaurants', 'automatisation', 'integration-ia', 'agence-web-lille', 'agence-web-paris'];

  const publicLanguageRoutes = pageRoutes
    .filter((route) => route.startsWith('/[lang]/'))
    .filter((route) => !excludedRoutes.includes(route))
    .map((route) => route.replace('/[lang]/', ''))
    .filter((route) => !FR_ONLY_ROUTES.includes(route))
    .sort();

  const missingInSitemap = publicLanguageRoutes.filter((route) => !sitemapStaticPages.includes(route));
  const extraInSitemap = sitemapStaticPages.filter((route) => !publicLanguageRoutes.includes(route));

  for (const route of missingInSitemap) {
    fail(`Public route /[lang]/${route} is missing from STATIC_PAGES in app/sitemap.ts.`);
  }

  for (const route of extraInSitemap) {
    fail(`STATIC_PAGES contains /[lang]/${route}, but no matching app route exists.`);
  }

  if (!pageRoutes.includes('/[lang]/sante')) {
    fail('Expected FR-only /[lang]/sante route was not found.');
  }
  if (!pageRoutes.includes('/[lang]/restaurants')) {
    fail('Expected FR-only /[lang]/restaurants route was not found.');
  }
  if (!pageRoutes.includes('/[lang]/automatisation')) {
    fail('Expected FR-only /[lang]/automatisation route was not found.');
  }
  if (!pageRoutes.includes('/[lang]/integration-ia')) {
    fail('Expected FR-only /[lang]/integration-ia route was not found.');
  }
  if (!pageRoutes.includes('/[lang]/agence-web-lille')) {
    fail('Expected FR-only /[lang]/agence-web-lille route was not found.');
  }
  if (!pageRoutes.includes('/[lang]/agence-web-paris')) {
    fail('Expected FR-only /[lang]/agence-web-paris route was not found.');
  }
}

function validateBlogPosts() {
  const posts = LANGUAGES.flatMap(getBlogFiles);
  const grouped = new Map();

  for (const post of posts) {
    const frontmatter = matter(fs.readFileSync(post.filePath, 'utf8')).data;
    const relativePath = path.relative(ROOT, post.filePath);

    if (!frontmatter.title) fail(`${relativePath}: missing title.`);
    if (!frontmatter.excerpt) fail(`${relativePath}: missing excerpt.`);
    if (!frontmatter.category) fail(`${relativePath}: missing category.`);
    if (!frontmatter.date) {
      fail(`${relativePath}: missing date.`);
    } else if (Number.isNaN(Date.parse(frontmatter.date))) {
      fail(`${relativePath}: invalid date "${frontmatter.date}". Use YYYY-MM-DD.`);
    }

    if (!grouped.has(post.slug)) grouped.set(post.slug, []);
    grouped.get(post.slug).push(post.language);
  }

  for (const [slug, languages] of [...grouped.entries()].sort()) {
    if (!languages.includes('fr')) {
      warn(`${slug}: no French source exists, so x-default would need a non-FR canonical.`);
    }
  }

  return posts.length;
}

function buildExpectedUrlCount(blogPostCount) {
  const homeUrls = LANGUAGES.length;
  const staticUrls = expectedStaticPages.length * LANGUAGES.length;
  const frenchOnlyUrls = 6; // sante, restaurants, automatisation, integration-ia, agence-web-lille, agence-web-paris
  return homeUrls + staticUrls + frenchOnlyUrls + blogPostCount;
}

const pageRoutes = listPageRoutes();
const sitemapStaticPages = extractStaticPagesFromSitemap();

validateStaticRoutes(pageRoutes, sitemapStaticPages);
const blogPostCount = validateBlogPosts();

const expectedUrlCount = buildExpectedUrlCount(blogPostCount);

if (JSON.stringify(sitemapStaticPages) !== JSON.stringify(expectedStaticPages.slice().sort())) {
  fail(
    `STATIC_PAGES differs from the deployment checklist. Expected: ${expectedStaticPages
      .slice()
      .sort()
      .join(', ')}. Found: ${sitemapStaticPages.join(', ')}.`
  );
}

if (errors.length > 0) {
  console.error('Sitemap validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

for (const message of warnings) console.warn(`Warning: ${message}`);

console.log(`Sitemap validation passed for ${BASE_URL}.`);
console.log(`Expected dynamic sitemap URLs: ${expectedUrlCount}`);
console.log(`Blog URLs covered: ${blogPostCount}`);
