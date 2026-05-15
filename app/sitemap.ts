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
}> = {
  services:                   { priority: 0.9, changeFrequency: 'monthly' },
  'mobile-app-development':   { priority: 0.9, changeFrequency: 'monthly' },
  equipe:                     { priority: 0.7, changeFrequency: 'monthly' },
  contact:                    { priority: 0.8, changeFrequency: 'monthly' },
  blog:                       { priority: 0.8, changeFrequency: 'weekly' },
  booking:                    { priority: 0.9, changeFrequency: 'monthly' },
  // Pages légales
  'mentions-legales':         { priority: 0.3, changeFrequency: 'yearly' },
  'confidentialite':          { priority: 0.3, changeFrequency: 'yearly' },
  'conditions-utilisation':   { priority: 0.3, changeFrequency: 'yearly' },
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
        lastModified: today,
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
    lastModified: today,
    changeFrequency: 'monthly',
    priority: 0.95,
    alternates: {
      languages: {
        fr: `${BASE_URL}/fr/sante`,
        'x-default': `${BASE_URL}/fr/sante`,
      },
    },
  });

  // Page Automatisation — FR uniquement
  urls.push({
    url: `${BASE_URL}/fr/automatisation`,
    lastModified: today,
    changeFrequency: 'monthly',
    priority: 0.95,
    alternates: {
      languages: {
        fr: `${BASE_URL}/fr/automatisation`,
        'x-default': `${BASE_URL}/fr/automatisation`,
      },
    },
  });

  // Page Intégration IA — FR uniquement
  urls.push({
    url: `${BASE_URL}/fr/integration-ia`,
    lastModified: today,
    changeFrequency: 'monthly',
    priority: 0.95,
    alternates: {
      languages: {
        fr: `${BASE_URL}/fr/integration-ia`,
        'x-default': `${BASE_URL}/fr/integration-ia`,
      },
    },
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