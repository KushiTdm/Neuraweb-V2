import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Langues supportées
export const SUPPORTED_LANGUAGES = ['fr', 'en', 'es'] as const;
export const DEFAULT_LANGUAGE = 'fr';

// Pages statiques qui nécessitent une langue
const STATIC_PAGES = ['services', 'blog', 'equipe', 'contact'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorer les fichiers statiques et API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/assets') ||
    pathname.includes('.') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  // Vérifier si l'URL contient déjà un préfixe de langue
  const pathnameParts = pathname.split('/').filter(Boolean);
  const firstSegment = pathnameParts[0];

  // Si l'URL a déjà un préfixe de langue valide, continuer
  if (SUPPORTED_LANGUAGES.includes(firstSegment as any)) {
    return NextResponse.next();
  }

  // Cas spécial: racine du site
  if (pathname === '/') {
    // Détecter la langue préférée depuis l'en-tête Accept-Language
    const acceptLanguage = request.headers.get('accept-language') || '';
    const preferredLanguage = detectLanguage(acceptLanguage);

    // Rediriger vers la langue détectée
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLanguage}`;
    return NextResponse.redirect(url);
  }

  // Pour les autres URLs sans préfixe de langue, rediriger vers la version française
  // (pour maintenir le SEO existant)
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LANGUAGE}${pathname}`;
  return NextResponse.redirect(url, 301);
}

/**
 * Détecte la langue préférée depuis l'en-tête Accept-Language
 */
function detectLanguage(acceptLanguage: string): string {
  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [code, q = 'q=1'] = lang.trim().split(';');
      const quality = parseFloat(q.split('=')[1]) || 0;
      return { code: code.substring(0, 2).toLowerCase(), quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { code } of languages) {
    if (SUPPORTED_LANGUAGES.includes(code as any)) {
      return code;
    }
  }

  return DEFAULT_LANGUAGE;
}

export const config = {
  matcher: [
    // Appliquer à toutes les routes sauf les fichiers statiques
    '/((?!_next|api|assets|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
};