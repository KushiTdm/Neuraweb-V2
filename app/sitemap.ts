import { MetadataRoute } from 'next';
import { getAllPostSlugs, getPostBySlug } from '@/lib/mdx';

const BASE_URL = 'https://neuraweb.tech';

export default function sitemap(): MetadataRoute.Sitemap {
  // Date du jour pour les pages fréquemment mises à jour
  const today = new Date();
  
  // Date de la semaine dernière pour les pages moins critiques
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  // Date du mois dernier pour les pages stables
  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  // Récupérer dynamiquement tous les articles de blog
  const blogSlugs = getAllPostSlugs();
  const blogPosts = blogSlugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is NonNullable<typeof post> => post !== null)
    .map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  return [
    // Page d'accueil
    {
      url: BASE_URL,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 1,
    },
    // Page Services
    {
      url: `${BASE_URL}/services`,
      lastModified: lastWeek,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Page Équipe
    {
      url: `${BASE_URL}/equipe`,
      lastModified: lastMonth,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Page Blog
    {
      url: `${BASE_URL}/blog`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    // Page Contact
    {
      url: `${BASE_URL}/contact`,
      lastModified: lastMonth,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Articles de blog (générés dynamiquement depuis content/blog/)
    ...blogPosts,
  ];
}
