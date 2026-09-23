// ============================================================
// app/api/mobile/social/backfill/route.ts
// Remplace le workflow n8n `Backfill_contenu_social_v2` (et le webhook déclenché
// par la GitHub Action `social-content`) : génère les posts Facebook, LinkedIn
// et le thread X des articles de blog FR qui n'en ont pas encore.
//
// Les articles sont lus directement dans content/blog/ (même dépôt que le
// site) — plus besoin de PAT GitHub. Incrémental et économe en quota IA :
//   - ligne avec x_thread            → ignorée (aucun appel IA)
//   - ligne sans x_thread            → mode 'patch' : ajoute SEULEMENT le thread,
//                                      sans écraser les posts FB/LinkedIn édités
//   - aucune ligne pour l'article    → mode 'insert' : génération complète,
//                                      status = 'pending' (à valider dans l'app)
//
// GET  → { ok, pending: [{ slug, title, mode }] }   (articles à traiter)
// POST { limit? } (défaut 1, max 2 — une génération ≈ 10-30 s)
//      → { ok, processed: [{ slug, mode, ok, error? }], remaining }
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/mobile-auth';
import { ApiError, publicDb, routeErrorResponse } from '@/lib/mobile-api';
import { getAllPostSlugs, getPostBySlug } from '@/lib/mdx';
import { generateArticlePosts } from '@/lib/social-generation';

export const maxDuration = 60;

interface PendingArticle {
  slug: string;
  title: string;
  mode: 'insert' | 'patch';
}

async function listPending(): Promise<PendingArticle[]> {
  const { data, error } = await publicDb()
    .from('generated_social_posts')
    .select('slug, x_thread')
    .eq('lang', 'fr');
  if (error) throw new ApiError(`Lecture des posts existants impossible : ${error.message}`, 502);

  const existing = new Map<string, { hasThread: boolean }>();
  for (const r of data ?? []) {
    existing.set(String(r.slug), { hasThread: Array.isArray(r.x_thread) && r.x_thread.length > 0 });
  }

  const pending: PendingArticle[] = [];
  for (const slug of getAllPostSlugs('fr')) {
    const row = existing.get(slug);
    if (row?.hasThread) continue;
    const post = getPostBySlug(slug, 'fr');
    if (!post) continue;
    pending.push({ slug, title: post.title, mode: row ? 'patch' : 'insert' });
  }
  return pending;
}

export async function GET(req: NextRequest) {
  try {
    await requireUser(req);
    return NextResponse.json({ ok: true, pending: await listPending() });
  } catch (e) {
    return routeErrorResponse(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireUser(req);
    const b = (await req.json().catch(() => ({}))) as { limit?: unknown };
    const limit = Math.min(2, Math.max(1, Number(b.limit) || 1));

    const pending = await listPending();
    const batch = pending.slice(0, limit);
    const db = publicDb();
    const processed: { slug: string; mode: string; ok: boolean; error?: string }[] = [];

    for (const item of batch) {
      try {
        const post = getPostBySlug(item.slug, 'fr');
        if (!post) throw new ApiError('Article introuvable sur le disque.', 404);

        const { posts, articleUrl } = await generateArticlePosts({
          slug: item.slug,
          lang: 'fr',
          title: post.title,
          excerpt: post.excerpt,
          body: post.content,
        });

        if (item.mode === 'patch') {
          const { error } = await db
            .from('generated_social_posts')
            .update({ x_thread: posts.x_thread, article_url: articleUrl })
            .eq('slug', item.slug)
            .eq('lang', 'fr');
          if (error) throw new ApiError(error.message, 502);
        } else {
          const { error } = await db.from('generated_social_posts').upsert(
            {
              slug: item.slug,
              lang: 'fr',
              title: post.title,
              image: post.image,
              ...posts,
              article_url: articleUrl,
              status: 'pending',
              source: 'article',
              source_path: `content/blog/${item.slug}.mdx`,
            },
            { onConflict: 'slug,lang', ignoreDuplicates: true },
          );
          if (error) throw new ApiError(error.message, 502);
        }
        processed.push({ slug: item.slug, mode: item.mode, ok: true });
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Erreur inconnue';
        console.error('[social-backfill]', item.slug, message);
        processed.push({ slug: item.slug, mode: item.mode, ok: false, error: message });
      }
    }

    const done = processed.filter((p) => p.ok).length;
    return NextResponse.json({ ok: true, processed, remaining: pending.length - done });
  } catch (e) {
    return routeErrorResponse(e);
  }
}
