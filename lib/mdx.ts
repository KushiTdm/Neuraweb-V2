// ============================================================
// MDX BLOG SYSTEM
// Gestion des articles via fichiers Markdown/MDX
// Support multilingue (FR, EN, ES)
// ============================================================

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// ── Types ───────────────────────────────────────────────────────────────────
export type Language = 'fr' | 'en' | 'es';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  image: string;
  tags: string[];
  featured?: boolean;
  content: string;
  language: Language;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  image: string;
  tags: string[];
  featured?: boolean;
  language: Language;
}

// ── Configuration ───────────────────────────────────────────────────────────
const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

// Language folder mapping
const LANGUAGE_FOLDERS: Record<Language, string> = {
  fr: CONTENT_DIR,           // French articles at root
  en: path.join(CONTENT_DIR, 'en'),  // English in /en subfolder
  es: path.join(CONTENT_DIR, 'es'),  // Spanish in /es subfolder
};

// ── Get all blog post slugs for a specific language ─────────────────────────
export function getAllPostSlugs(language: Language = 'fr'): string[] {
  try {
    const langDir = LANGUAGE_FOLDERS[language];
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(langDir)) {
      return [];
    }
    
    const files = fs.readdirSync(langDir);
    return files
      .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
      .map((file) => file.replace(/\.mdx?$/, ''));
  } catch (error) {
    console.error('Error reading blog directory:', error);
    return [];
  }
}

// ── Get single blog post by slug and language ───────────────────────────────
export function getPostBySlug(slug: string, language: Language = 'fr'): BlogPost | null {
  try {
    const filePath = findFile(slug, language);
    if (!filePath) return null;

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    // Calculate read time (average 200 words per minute)
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const readTime = `${Math.ceil(words / wordsPerMinute)} min`;

    return {
      slug,
      title: data.title || 'Untitled',
      excerpt: data.excerpt || '',
      date: data.date || new Date().toISOString(),
      readTime: data.readTime || readTime,
      category: data.category || 'General',
      author: data.author || 'NeuraWeb',
      image: data.image || '/og-image.png',
      tags: data.tags || [],
      featured: data.featured || false,
      content,
      language,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

// ── Get all blog posts for a specific language ───────────────────────────────
export function getAllPosts(language: Language = 'fr'): BlogPostMeta[] {
  const slugs = getAllPostSlugs(language);
  const posts = slugs
    .map((slug) => getPostBySlug(slug, language))
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts.map(({ content, ...meta }) => meta);
}

// ── Get featured posts for a specific language ───────────────────────────────
export function getFeaturedPosts(language: Language = 'fr'): BlogPostMeta[] {
  return getAllPosts(language).filter((post) => post.featured);
}

// ── Get posts by category for a specific language ────────────────────────────
export function getPostsByCategory(category: string, language: Language = 'fr'): BlogPostMeta[] {
  return getAllPosts(language).filter((post) => post.category === category);
}

// ── Get related posts for a specific language ────────────────────────────────
export function getRelatedPosts(currentSlug: string, language: Language = 'fr', limit: number = 2): BlogPostMeta[] {
  const currentPost = getPostBySlug(currentSlug, language);
  if (!currentPost) return [];

  return getAllPosts(language)
    .filter((post) => post.slug !== currentSlug && post.category === currentPost.category)
    .slice(0, limit);
}

// ── Helper to find file with .md or .mdx extension for a specific language ──
function findFile(slug: string, language: Language = 'fr'): string | null {
  const langDir = LANGUAGE_FOLDERS[language];
  const mdPath = path.join(langDir, `${slug}.md`);
  const mdxPath = path.join(langDir, `${slug}.mdx`);

  if (fs.existsSync(mdxPath)) return mdxPath;
  if (fs.existsSync(mdPath)) return mdPath;
  return null;
}

// ── Get all categories for a specific language ───────────────────────────────
export function getAllCategories(language: Language = 'fr'): string[] {
  const posts = getAllPosts(language);
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories);
}

// ── Get all tags for a specific language ─────────────────────────────────────
export function getAllTags(language: Language = 'fr'): string[] {
  const posts = getAllPosts(language);
  const tags = new Set(posts.flatMap((post) => post.tags));
  return Array.from(tags);
}

// ── Get post by slug with fallback language ──────────────────────────────────
export function getPostBySlugWithFallback(slug: string, preferredLanguage: Language = 'fr'): BlogPost | null {
  // Try to get post in preferred language first
  const post = getPostBySlug(slug, preferredLanguage);
  if (post) return post;
  
  // Fallback to French if not found in preferred language
  if (preferredLanguage !== 'fr') {
    const fallbackPost = getPostBySlug(slug, 'fr');
    if (fallbackPost) return fallbackPost;
  }
  
  // Try English as last resort
  if (preferredLanguage !== 'en') {
    const enPost = getPostBySlug(slug, 'en');
    if (enPost) return enPost;
  }
  
  return null;
}

// ── Get all posts slugs across all languages ─────────────────────────────────
export function getAllPostSlugsAllLanguages(): { slug: string; language: Language }[] {
  const languages: Language[] = ['fr', 'en', 'es'];
  const allSlugs: { slug: string; language: Language }[] = [];
  
  for (const lang of languages) {
    const slugs = getAllPostSlugs(lang);
    for (const slug of slugs) {
      allSlugs.push({ slug, language: lang });
    }
  }
  
  return allSlugs;
}

// ── Validate post frontmatter ────────────────────────────────────────────────
export function validatePostFrontmatter(data: Record<string, unknown>): string[] {
  const errors: string[] = [];
  
  if (!data.title) errors.push('Title is required');
  if (!data.excerpt) errors.push('Excerpt is required');
  if (!data.date) errors.push('Date is required');
  if (!data.category) errors.push('Category is required');
  
  if (data.date && isNaN(Date.parse(data.date as string))) {
    errors.push('Invalid date format. Use YYYY-MM-DD');
  }
  
  return errors;
}