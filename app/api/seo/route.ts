import { NextRequest, NextResponse } from 'next/server';
import { generateAISEO } from '@/lib/seo-ai-server';
import { PageSEOContext } from '@/lib/seo-service';

// ============================================================
// API /api/seo — Usage : preview SEO, outils internes
// ⚠️ NE PAS utiliser pour le SEO des pages publiques.
//    Le SEO réel est généré dans generateMetadata() côté serveur.
// ============================================================

const VALID_PAGE_TYPES = ['home', 'services', 'contact', 'portfolio', 'blog', 'custom'];
const VALID_LANGUAGES = ['fr', 'en', 'es'];

// POST — Génère un aperçu SEO (usage : dashboard interne, tests)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageType, language = 'fr', customKeywords = [], customContext, path = '/' } = body;

    if (!VALID_PAGE_TYPES.includes(pageType)) {
      return NextResponse.json({ error: 'Type de page invalide' }, { status: 400 });
    }
    if (!VALID_LANGUAGES.includes(language)) {
      return NextResponse.json({ error: 'Langue invalide' }, { status: 400 });
    }

    const context: PageSEOContext = { pageType, language, customKeywords, customContext, path };
    const seo = await generateAISEO(context);

    return NextResponse.json({ success: true, seo });
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la génération SEO' }, { status: 500 });
  }
}

// GET — Récupère les meta tags d'une page (usage : debug, monitoring)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageType = searchParams.get('pageType') || 'home';
    const language = searchParams.get('language') || 'fr';
    const path = searchParams.get('path') || '/';

    if (!VALID_PAGE_TYPES.includes(pageType) || !VALID_LANGUAGES.includes(language)) {
      return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 });
    }

    const context: PageSEOContext = {
      pageType: pageType as PageSEOContext['pageType'],
      language: language as PageSEOContext['language'],
      path,
    };
    const seo = await generateAISEO(context);

    return NextResponse.json({ success: true, seo });
  } catch {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}