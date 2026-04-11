import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const SUPPORTED_LANGUAGES = ['fr', 'en', 'es'] as const;
export const DEFAULT_LANGUAGE = 'fr';

const STATIC_PAGES = ['services', 'blog', 'equipe', 'contact'];

export function proxy(request: NextRequest) {
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

  const pathnameParts = pathname.split('/').filter(Boolean);
  const firstSegment = pathnameParts[0];

  if (SUPPORTED_LANGUAGES.includes(firstSegment as any)) {
    return NextResponse.next();
  }

  if (pathname === '/') {
    const acceptLanguage = request.headers.get('accept-language') || '';
    const preferredLanguage = detectLanguage(acceptLanguage);
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLanguage}`;
    // ✅ CORRIGÉ : 308 permanent (était temporaire) → transfert du PageRank vers /fr
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LANGUAGE}${pathname}`;
  // 308 permanent pour toutes les redirections sans préfixe de langue
  return NextResponse.redirect(url, 308);
}

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
    '/((?!_next|api|assets|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
};