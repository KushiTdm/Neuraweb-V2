'use client';

import '@/app/[lang]/themes/accueil.css';
import React, { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LocalizedLink } from '@/components/localized-link';
import { useLanguage } from '@/contexts/language-context';

// Page 404 (recherche multi-IA du 18/10/2026) : illustration SVG animée en CSS plutôt qu'image générée
// (léger, net, recolorable), message humain, 3 liens utiles + suggestion déduite de l'URL demandée.
type Lang = 'fr' | 'en' | 'es' | 'vi';

const COPY: Record<Lang, { kicker: string; title: string; text: string; home: string; contact: string; maybe: string; or: string; paris: string; hanoi: string; alt: string }> = {
  fr: { kicker: 'Erreur 404', title: 'Cette page a pris un autre chemin.', text: 'Le lien est peut-être ancien ou mal écrit. Pas de panique : on vous remet sur la bonne route.', home: 'Retour à l’accueil', contact: 'Nous écrire', maybe: 'Vous cherchiez peut-être', or: 'Ou explorer', paris: 'Paris', hanoi: 'Hà Nội', alt: 'Deux points, Paris et Hà Nội, reliés par un fil qui se reconnecte autour d’un 404' },
  en: { kicker: 'Error 404', title: 'This page took another path.', text: 'The link may be old or mistyped. No worries — let’s put you back on track.', home: 'Back to home', contact: 'Write to us', maybe: 'You may have been looking for', or: 'Or explore', paris: 'Paris', hanoi: 'Hà Nội', alt: 'Two points, Paris and Hà Nội, joined by a wire that reconnects around a 404' },
  es: { kicker: 'Error 404', title: 'Esta página tomó otro camino.', text: 'El enlace puede ser antiguo o estar mal escrito. Tranquilo: le devolvemos al buen camino.', home: 'Volver al inicio', contact: 'Escríbanos', maybe: 'Quizá buscaba', or: 'O explore', paris: 'París', hanoi: 'Hà Nội', alt: 'Dos puntos, París y Hà Nội, unidos por un hilo que se reconecta alrededor de un 404' },
  vi: { kicker: 'Lỗi 404', title: 'Trang này đã đi theo một con đường khác.', text: 'Liên kết có thể đã cũ hoặc gõ sai. Đừng lo — chúng tôi đưa bạn trở lại đúng hướng.', home: 'Về trang chủ', contact: 'Liên hệ', maybe: 'Có thể bạn đang tìm', or: 'Hoặc khám phá', paris: 'Paris', hanoi: 'Hà Nội', alt: 'Hai điểm, Paris và Hà Nội, nối bằng sợi dây kết nối lại quanh số 404' },
};

// [chemin, mots-clés de l'URL, libellé par langue]
const PAGES: [string, string[], Record<Lang, string>][] = [
  ['/developpement-web', ['developpement', 'web', 'site', 'sites', 'vitrine', 'website', 'creation'], { fr: 'Développement web', en: 'Web development', es: 'Desarrollo web', vi: 'Phát triển web' }],
  ['/mobile-app-development', ['mobile', 'app', 'application', 'ios', 'android'], { fr: 'Applications mobiles', en: 'Mobile apps', es: 'Apps móviles', vi: 'Ứng dụng di động' }],
  ['/automatisation', ['automatisation', 'automation', 'n8n', 'workflow', 'make', 'zapier'], { fr: 'Automatisation', en: 'Automation', es: 'Automatización', vi: 'Tự động hóa' }],
  ['/integration-ia', ['ia', 'ai', 'chatbot', 'integration', 'agent', 'llm'], { fr: 'Intégration IA', en: 'AI integration', es: 'Integración de IA', vi: 'Tích hợp AI' }],
  ['/secteurs/sante', ['sante', 'health', 'medecin', 'osteopathe', 'kine', 'cabinet', 'paramedical'], { fr: 'Santé & paramédical', en: 'Healthcare', es: 'Salud', vi: 'Y tế' }],
  ['/secteurs/restaurants-hotels', ['restaurant', 'restaurants', 'hotel', 'hotels', 'cafe', 'resto'], { fr: 'Restaurants & hôtels', en: 'Restaurants & hotels', es: 'Restaurantes y hoteles', vi: 'Nhà hàng & khách sạn' }],
  ['/secteurs/collectivites', ['collectivite', 'collectivites', 'mairie', 'commune', 'public'], { fr: 'Collectivités & mairies', en: 'Local authorities', es: 'Administraciones locales', vi: 'Cơ quan địa phương' }],
  ['/secteurs', ['secteur', 'secteurs', 'sector', 'sectors', 'industry'], { fr: 'Secteurs', en: 'Industries', es: 'Sectores', vi: 'Lĩnh vực' }],
  ['/blog', ['blog', 'article', 'articles', 'guide', 'actualites'], { fr: 'Blog', en: 'Blog', es: 'Blog', vi: 'Blog' }],
  ['/equipe', ['equipe', 'team', 'about', 'propos', 'equipo'], { fr: 'L’équipe', en: 'The team', es: 'El equipo', vi: 'Đội ngũ' }],
  ['/booking', ['booking', 'reserver', 'rdv', 'rendez', 'devis', 'quote', 'tarif', 'tarifs', 'prix', 'pricing'], { fr: 'Réserver un appel', en: 'Book a call', es: 'Reservar una llamada', vi: 'Đặt lịch gọi' }],
];

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function suggest(pathname: string) {
  const tokens = norm(pathname).split(/[^a-z0-9]+/).filter((t) => t.length > 1 && !['fr', 'en', 'es', 'vi'].includes(t));
  if (!tokens.length) return [];
  return PAGES.map(([href, keys, label]) => {
    let score = 0;
    for (const t of tokens) for (const k of keys) if (t === k) score += 3; else if (t.length > 3 && (k.includes(t) || t.includes(k))) score += 1;
    return { href, label, score };
  }).filter((p) => p.score > 0).sort((a, b) => b.score - a.score).slice(0, 2);
}

function NodeNet({ alt, paris, hanoi }: { alt: string; paris: string; hanoi: string }) {
  return (
    <svg viewBox="0 0 640 260" role="img" aria-label={alt} className="nf-svg mx-auto w-full max-w-2xl text-chypre" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <style>{`
        .nf-wire{stroke-dasharray:6 12}
        .nf-spark{transform-box:fill-box;transform-origin:center}
        @media (prefers-reduced-motion:no-preference){
          .nf-wire{animation:nfDash 2.4s linear infinite}
          .nf-ring{transform-box:fill-box;transform-origin:center;animation:nfPulse 2.8s ease-in-out infinite}
          .nf-spark.l{animation:nfL 3.2s cubic-bezier(.16,1,.3,1) infinite}
          .nf-spark.r{animation:nfR 3.2s cubic-bezier(.16,1,.3,1) infinite}
          .nf-clock{transform-box:fill-box;transform-origin:50% 100%;animation:nfTick 6s steps(12) infinite}
        }
        @keyframes nfDash{to{stroke-dashoffset:-36}}
        @keyframes nfPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.08);opacity:.75}}
        @keyframes nfL{0%{transform:translateX(0);opacity:1}55%,100%{transform:translateX(96px);opacity:0}}
        @keyframes nfR{0%{transform:translateX(0);opacity:1}55%,100%{transform:translateX(-96px);opacity:0}}
        @keyframes nfTick{to{transform:rotate(360deg)}}
      `}</style>
      {/* fils de gauche et de droite : ils n'arrivent jamais à se rejoindre au centre (le « trou » = 404) */}
      <path className="nf-wire" d="M62 130 H238" />
      <path className="nf-wire" d="M402 130 H578" />
      <circle className="nf-spark l" cx="150" cy="130" r="5" fill="currentColor" stroke="none" />
      <circle className="nf-spark r" cx="490" cy="130" r="5" fill="currentColor" stroke="none" />
      {/* nœuds Paris / Hà Nội avec leur horloge */}
      {[{ x: 40, label: paris }, { x: 600, label: hanoi }].map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy="130" r="22" fill="currentColor" stroke="none" />
          <circle cx={n.x} cy="130" r="14" stroke="rgb(var(--c-white))" strokeWidth="2" />
          <path className="nf-clock" d={`M${n.x} 130 V120`} stroke="rgb(var(--c-white))" strokeWidth="2.5" />
          <text x={n.x} y="178" textAnchor="middle" fill="currentColor" stroke="none" fontSize="15" fontWeight="700" letterSpacing="2" style={{ textTransform: 'uppercase' }}>{n.label}</text>
        </g>
      ))}
      {/* le « 0 » du 404 est un nœud qui pulse */}
      <text x="262" y="165" fill="currentColor" stroke="none" fontSize="110" fontWeight="900" fontFamily="var(--font-fraunces), Georgia, serif" textAnchor="end">4</text>
      <circle className="nf-ring" cx="320" cy="128" r="38" strokeWidth="12" />
      <circle cx="320" cy="128" r="9" fill="currentColor" stroke="none" />
      <text x="378" y="165" fill="currentColor" stroke="none" fontSize="110" fontWeight="900" fontFamily="var(--font-fraunces), Georgia, serif">4</text>
    </svg>
  );
}

export function NotFoundView() {
  const { language } = useLanguage();
  const lang = (['fr', 'en', 'es', 'vi'].includes(language as string) ? language : 'fr') as Lang;
  const c = COPY[lang];
  const pathname = usePathname() || '';
  const suggestions = useMemo(() => suggest(pathname), [pathname]);
  const shortcuts = useMemo(() => PAGES.filter(([h]) => ['/developpement-web', '/secteurs', '/blog'].includes(h)), []);

  useEffect(() => {
    // Suivi des 404 (le chargeur GA4 n'injecte gtag qu'après consentement) — aucune donnée personnelle
    const w = window as unknown as { gtag?: (...a: unknown[]) => void };
    w.gtag?.('event', 'page_not_found', { page_path: pathname, page_referrer: document.referrer || '(direct)' });
  }, [pathname]);

  return (
    <div className="theme-accueil">
      <Header />
      <main id="main-content" className="flex min-h-[100svh] items-center bg-creme px-4 pb-16 pt-28 sm:px-6">
        <div className="mx-auto w-full max-w-3xl text-center">
          <NodeNet alt={c.alt} paris={c.paris} hanoi={c.hanoi} />
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-chypre/80">{c.kicker}</p>
          <h1 className="mt-3 text-[2rem] leading-[1.1] text-chypre sm:text-5xl">{c.title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-chypre/90 sm:text-lg">{c.text}</p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <LocalizedLink href="/" className="inline-flex items-center gap-2 rounded-full bg-chypre px-7 py-3.5 text-sm font-semibold text-creme transition-opacity hover:opacity-90">
              {c.home} <ArrowRight size={15} aria-hidden="true" />
            </LocalizedLink>
            <LocalizedLink href="/contact" className="inline-flex items-center gap-2 rounded-full border border-chypre/40 px-7 py-3.5 text-sm font-semibold text-chypre transition-colors hover:bg-chypre/10">
              {c.contact}
            </LocalizedLink>
          </div>

          {suggestions.length > 0 && (
            <div className="mt-10">
              <p className="text-sm font-semibold text-chypre">{c.maybe}</p>
              <ul className="mt-3 flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <li key={s.href}>
                    <LocalizedLink href={s.href} className="inline-flex rounded-full bg-chypre px-5 py-2 text-sm font-semibold text-creme">{s.label[lang]}</LocalizedLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10">
            <p className="text-sm font-semibold text-chypre/90">{c.or}</p>
            <ul className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {shortcuts.map(([href, , label]) => (
                <li key={href}>
                  <LocalizedLink href={href} className="text-sm font-semibold text-chypre underline decoration-chypre/40 underline-offset-4 hover:decoration-chypre">{label[lang]}</LocalizedLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
