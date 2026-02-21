import { MetadataRoute } from 'next';
import { getAllPostSlugsAllLanguages, getPostBySlug } from '@/lib/mdx';
import { SUPPORTED_LANGUAGES } from '@/proxy';

const BASE_URL = 'https://neuraweb.tech';

const STATIC_PAGES: Record<string, {
  priority: number;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}> = {
  services: { priority: 0.9, changeFrequency: 'monthly' },
  equipe:   { priority: 0.7, changeFrequency: 'monthly' },
  contact:  { priority: 0.8, changeFrequency: 'monthly' },  // ← hausse : page de conversion
  blog:     { priority: 0.8, changeFrequency: 'weekly' },
  booking:  { priority: 0.9, changeFrequency: 'monthly' },  // ← hausse : page de conversion
};

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();
  const urls: MetadataRoute.Sitemap = [];

  // Page d'accueil — priorité maximale
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

  // Articles de blog — fréquence weekly pour inciter Google à recrawler
  const allBlogSlugs = getAllPostSlugsAllLanguages();
  const slugLanguageMap = new Map<string, string[]>();

  allBlogSlugs.forEach(({ slug, language }) => {
    if (!slugLanguageMap.has(slug)) slugLanguageMap.set(slug, []);
    slugLanguageMap.get(slug)!.push(language);
  });

  slugLanguageMap.forEach((languages, slug) => {
    const post = getPostBySlug(slug, languages[0] as 'fr' | 'en' | 'es');
    if (!post) return;

    const languageAlternates: Record<string, string> = {
      'x-default': `${BASE_URL}/fr/blog/${slug}`,
    };
    languages.forEach((lang) => {
      languageAlternates[lang] = `${BASE_URL}/${lang}/blog/${slug}`;
    });

    languages.forEach((lang) => {
      urls.push({
        url: `${BASE_URL}/${lang}/blog/${slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'weekly', // ← CORRIGÉ : était 'monthly'
        priority: 0.75,            // ← légère hausse pour le blog
        alternates: { languages: languageAlternates },
      });
    });
  });

  return urls;
}