import { MetadataRoute } from 'next';
import { getAllPostSlugsAllLanguages, getPostBySlug } from '@/lib/mdx';
import { SUPPORTED_LANGUAGES } from '@/proxy';

const BASE_URL = 'https://neuraweb.tech';

// ✅ Date de migration Vercel — utilisée comme lastModified minimum pour tous les contenus
// Cela signale à Google que tout a été re-déployé depuis cette date
const MIGRATION_DATE = new Date('2026-02-28');

const STATIC_PAGES: Record<string, {
  priority: number;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  lastModified?: Date;
}> = {
  // Pages de service — mises à jour au lancement, stable ensuite
  'developpement-web':        { priority: 0.9, changeFrequency: 'monthly',  lastModified: new Date('2026-05-22') },
  'mobile-app-development':   { priority: 0.9, changeFrequency: 'monthly',  lastModified: new Date('2026-04-01') },
  equipe:                     { priority: 0.7, changeFrequency: 'monthly',  lastModified: new Date('2026-03-15') },
  contact:                    { priority: 0.8, changeFrequency: 'monthly',  lastModified: new Date('2026-03-01') },
  blog:                       { priority: 0.8, changeFrequency: 'weekly' },  // today — mis à jour à chaque article
  booking:                    { priority: 0.9, changeFrequency: 'monthly',  lastModified: new Date('2026-03-01') },
  // Pages légales — très stables, date fixe
  'mentions-legales':         { priority: 0.3, changeFrequency: 'yearly',   lastModified: MIGRATION_DATE },
  'confidentialite':          { priority: 0.3, changeFrequency: 'yearly',   lastModified: MIGRATION_DATE },
  'conditions-utilisation':   { priority: 0.3, changeFrequency: 'yearly',   lastModified: MIGRATION_DATE },
};

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();
  const urls: MetadataRoute.Sitemap = [];

  // Page d'accueil
  SUPPORTED_LANGUAGES.forEach((lang: string) => {
    urls.push({
      url: `${BASE_URL}/${lang}`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          fr: `${BASE_URL}/fr`,
          en: `${BASE_URL}/en`,
          es: `${BASE_URL}/es`,
          'x-default': `${BASE_URL}/fr`,
        },
      },
    });
  });

  // Pages statiques
  Object.entries(STATIC_PAGES).forEach(([page, config]) => {
    SUPPORTED_LANGUAGES.forEach((lang: string) => {
      urls.push({
        url: `${BASE_URL}/${lang}/${page}`,
        lastModified: config.lastModified ?? today,
        changeFrequency: config.changeFrequency,
        priority: config.priority,
        alternates: {
          languages: {
            fr: `${BASE_URL}/fr/${page}`,
            en: `${BASE_URL}/en/${page}`,
            es: `${BASE_URL}/es/${page}`,
            'x-default': `${BASE_URL}/fr/${page}`,
          },
        },
      });
    });
  });

  // Page Santé — FR uniquement (canal de conversion vertical, pas traduit)
  urls.push({
    url: `${BASE_URL}/fr/sante`,
    lastModified: new Date('2026-04-15'),
    changeFrequency: 'monthly',
    priority: 0.95,
    alternates: {
      languages: {
        fr: `${BASE_URL}/fr/sante`,
        'x-default': `${BASE_URL}/fr/sante`,
      },
    },
  });

  // Pages Automatisation et Intégration IA — toutes langues
  (['automatisation', 'integration-ia'] as const).forEach((slug) => {
    const lastModified = new Date('2026-05-27');
    const alternates = {
      languages: {
        fr: `${BASE_URL}/fr/${slug}`,
        en: `${BASE_URL}/en/${slug}`,
        es: `${BASE_URL}/es/${slug}`,
        'x-default': `${BASE_URL}/fr/${slug}`,
      },
    };
    (['fr', 'en', 'es'] as const).forEach((lang) => {
      urls.push({
        url: `${BASE_URL}/${lang}/${slug}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.95,
        alternates,
      });
    });
  });

  // Articles de blog
  const allBlogSlugs = getAllPostSlugsAllLanguages();
  const slugLanguageMap = new Map<string, string[]>();

  allBlogSlugs.forEach(({ slug, language }) => {
    if (!slugLanguageMap.has(slug)) slugLanguageMap.set(slug, []);
    slugLanguageMap.get(slug)!.push(language);
  });

  slugLanguageMap.forEach((languages, slug) => {
    const post = getPostBySlug(slug, languages[0] as 'fr' | 'en' | 'es');
    if (!post) return;

    const postDate = new Date(post.date);
    // ✅ On prend la date la plus récente entre la date originale et la migration
    // Cela signale à Google que ces pages ont au minimum été re-déployées en fév. 2026
    const lastModified = postDate > MIGRATION_DATE ? postDate : MIGRATION_DATE;

    const languageAlternates: Record<string, string> = {
      'x-default': `${BASE_URL}/fr/blog/${slug}`,
    };
    languages.forEach((lang) => {
      languageAlternates[lang] = `${BASE_URL}/${lang}/blog/${slug}`;
    });

    languages.forEach((lang) => {
      urls.push({
        url: `${BASE_URL}/${lang}/blog/${slug}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.75,
        alternates: { languages: languageAlternates },
      });
    });
  });

  return urls;
}