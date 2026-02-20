import { MetadataRoute } from 'next';
import { getAllPostSlugsAllLanguages, getPostBySlug } from '@/lib/mdx';
import { SUPPORTED_LANGUAGES } from '@/middleware';

const BASE_URL = 'https://neuraweb.tech';

// Pages statiques disponibles avec leurs priorités
const STATIC_PAGES: Record<string, { priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }> = {
  services: { priority: 0.9, changeFrequency: 'monthly' },
  equipe: { priority: 0.7, changeFrequency: 'monthly' },
  contact: { priority: 0.7, changeFrequency: 'monthly' },
  blog: { priority: 0.8, changeFrequency: 'daily' },
  booking: { priority: 0.8, changeFrequency: 'monthly' },
};

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const urls: MetadataRoute.Sitemap = [];

  // Page d'accueil pour chaque langue
  SUPPORTED_LANGUAGES.forEach((lang) => {
    urls.push({
      url: `${BASE_URL}/${lang}`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 1,
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

  // Pages statiques pour chaque langue
  Object.entries(STATIC_PAGES).forEach(([page, config]) => {
    SUPPORTED_LANGUAGES.forEach((lang) => {
      urls.push({
        url: `${BASE_URL}/${lang}/${page}`,
        lastModified: page === 'blog' ? today : lastWeek,
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

  // Articles de blog - uniquement pour les langues où ils existent
  const allBlogSlugs = getAllPostSlugsAllLanguages();
  
  // Grouper par slug pour créer les alternates corrects
  const slugLanguageMap = new Map<string, string[]>();
  allBlogSlugs.forEach(({ slug, language }) => {
    if (!slugLanguageMap.has(slug)) {
      slugLanguageMap.set(slug, []);
    }
    slugLanguageMap.get(slug)!.push(language);
  });

  // Générer les URLs avec alternates corrects
  slugLanguageMap.forEach((languages, slug) => {
    const post = getPostBySlug(slug, languages[0] as 'fr' | 'en' | 'es');
    if (post) {
      // Construire les alternates uniquement pour les langues où l'article existe
      const languageAlternates: Record<string, string> = {
        'x-default': `${BASE_URL}/fr/blog/${slug}`,
      };
      languages.forEach((lang) => {
        languageAlternates[lang] = `${BASE_URL}/${lang}/blog/${slug}`;
      });

      // Ajouter une URL pour chaque langue où l'article existe
      languages.forEach((lang) => {
        urls.push({
          url: `${BASE_URL}/${lang}/blog/${slug}`,
          lastModified: new Date(post.date),
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: {
            languages: languageAlternates,
          },
        });
      });
    }
  });

  return urls;
}