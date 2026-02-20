import { MetadataRoute } from 'next';
import { getAllPostSlugs, getPostBySlug } from '@/lib/mdx';
import { SUPPORTED_LANGUAGES } from '@/middleware';

const BASE_URL = 'https://neuraweb.tech';

// Traductions des pages statiques
const PAGE_TRANSLATIONS: Record<string, Record<string, { title: string; description: string }>> = {
  services: {
    fr: { title: 'Services - Solutions Web Sur Mesure', description: 'Découvrez nos services de développement web' },
    en: { title: 'Services - Custom Web Solutions', description: 'Discover our web development services' },
    es: { title: 'Servicios - Soluciones Web Personalizadas', description: 'Descubra nuestros servicios de desarrollo web' },
  },
  equipe: {
    fr: { title: 'Équipe - Notre équipe', description: "Découvrez l'équipe NeuraWeb" },
    en: { title: 'Team - Our Team', description: 'Meet the NeuraWeb team' },
    es: { title: 'Equipo - Nuestro Equipo', description: 'Conozca al equipo de NeuraWeb' },
  },
  contact: {
    fr: { title: 'Contact - Parlons de votre projet', description: 'Contactez notre équipe' },
    en: { title: 'Contact - Let\'s talk', description: 'Contact our team' },
    es: { title: 'Contacto - Hablemos', description: 'Contacte a nuestro equipo' },
  },
  blog: {
    fr: { title: 'Blog - Actualités & Conseils', description: 'Articles sur le développement web' },
    en: { title: 'Blog - News & Tips', description: 'Articles on web development' },
    es: { title: 'Blog - Noticias y Consejos', description: 'Artículos sobre desarrollo web' },
  },
};

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

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
  Object.keys(PAGE_TRANSLATIONS).forEach((page) => {
    SUPPORTED_LANGUAGES.forEach((lang) => {
      urls.push({
        url: `${BASE_URL}/${lang}/${page}`,
        lastModified: page === 'blog' ? today : lastWeek,
        changeFrequency: page === 'blog' ? 'daily' : 'monthly',
        priority: page === 'services' ? 0.9 : page === 'blog' ? 0.8 : 0.7,
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

  // Articles de blog pour chaque langue
  const blogSlugs = getAllPostSlugs();
  blogSlugs.forEach((slug) => {
    const post = getPostBySlug(slug);
    if (post) {
      SUPPORTED_LANGUAGES.forEach((lang) => {
        urls.push({
          url: `${BASE_URL}/${lang}/blog/${slug}`,
          lastModified: new Date(post.date),
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: {
            languages: {
              fr: `${BASE_URL}/fr/blog/${slug}`,
              en: `${BASE_URL}/en/blog/${slug}`,
              es: `${BASE_URL}/es/blog/${slug}`,
              'x-default': `${BASE_URL}/fr/blog/${slug}`,
            },
          },
        });
      });
    }
  });

  return urls;
}