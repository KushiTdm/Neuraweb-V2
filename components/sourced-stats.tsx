'use client';

import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

// Repères chiffrés tiers (sources officielles ou indépendantes), vérifiés le 18/10/2026.
// Règle : aucun chiffre ici n'est un résultat NeuraWeb ; chacun est cité avec son éditeur, son année et son lien.
// Voir ../docs/01-marque/CHIFFRES_ET_PREUVES.md.
type L4 = { fr: string; en: string; es: string; vi: string };

interface Stat {
  value: string;
  label: L4;
  source: L4;
  url: string;
}

const STATS: Record<string, Stat> = {
  speed53: {
    value: '53 %',
    label: {
      fr: 'des visites mobiles sont abandonnées quand une page met plus de 3 secondes à charger.',
      en: 'of mobile visits are abandoned when a page takes more than 3 seconds to load.',
      es: 'de las visitas móviles se abandonan cuando una página tarda más de 3 segundos en cargar.',
      vi: 'lượt truy cập di động bị bỏ khi trang tải lâu hơn 3 giây.',
    },
    source: { fr: 'Google, 2016', en: 'Google, 2016', es: 'Google, 2016', vi: 'Google, 2016' },
    url: 'https://blog.google/products/admanager/the-need-for-mobile-speed/',
  },
  speed84: {
    value: '+8,4 %',
    label: {
      fr: 'de conversions en e-commerce pour 0,1 s gagnée sur mobile (37 marques, 30 M de sessions).',
      en: 'retail conversions for every 0.1 s gained on mobile (37 brands, 30 M sessions).',
      es: 'de conversiones en e-commerce por cada 0,1 s ganada en móvil (37 marcas, 30 M de sesiones).',
      vi: 'tỷ lệ chuyển đổi bán lẻ khi nhanh hơn 0,1 giây trên di động (37 thương hiệu, 30 triệu phiên).',
    },
    source: { fr: 'Deloitte pour Google, 2020', en: 'Deloitte for Google, 2020', es: 'Deloitte para Google, 2020', vi: 'Deloitte cho Google, 2020' },
    url: 'https://web.dev/case-studies/milliseconds-make-millions',
  },
  site65: {
    value: '65 %',
    label: {
      fr: 'des TPE/PME françaises ont un site internet : plus d’un tiers n’en ont pas.',
      en: 'of French small businesses have a website: more than a third do not.',
      es: 'de las pymes francesas tienen sitio web: más de un tercio no lo tiene.',
      vi: 'doanh nghiệp nhỏ tại Pháp có website: hơn một phần ba chưa có.',
    },
    source: { fr: 'Baromètre France Num (DGE), 2024', en: 'France Num barometer (DGE), 2024', es: 'Barómetro France Num (DGE), 2024', vi: 'Khảo sát France Num (DGE), 2024' },
    url: 'https://www.francenum.gouv.fr/guides-et-conseils/strategie-numerique/comprendre-le-numerique/barometre-france-num-2024-perception',
  },
  restoOnline49: {
    value: '49 %',
    label: {
      fr: 'des TPE/PME de l’hébergement-restauration ont une solution de vente en ligne (26 % tous secteurs).',
      en: 'of French hospitality and food-service small businesses have an online sales solution (26% across all sectors).',
      es: 'de las pymes francesas de hostelería y restauración tienen venta en línea (26 % en todos los sectores).',
      vi: 'doanh nghiệp nhỏ ngành lưu trú – ăn uống ở Pháp có bán hàng trực tuyến (26 % trên mọi ngành).',
    },
    source: { fr: 'Baromètre France Num (DGE), 2024', en: 'France Num barometer (DGE), 2024', es: 'Barómetro France Num (DGE), 2024', vi: 'Khảo sát France Num (DGE), 2024' },
    url: 'https://www.francenum.gouv.fr/guides-et-conseils/strategie-numerique/comprendre-le-numerique/barometre-france-num-2024-perception',
  },
  cart70: {
    value: '70,22 %',
    label: {
      fr: 'de taux moyen d’abandon de panier en ligne (moyenne de 50 études).',
      en: 'average online cart abandonment rate (average of 50 studies).',
      es: 'de tasa media de abandono de carrito en línea (media de 50 estudios).',
      vi: 'tỷ lệ bỏ giỏ hàng trực tuyến trung bình (trung bình của 50 nghiên cứu).',
    },
    source: { fr: 'Baymard Institute, mis à jour en 2025', en: 'Baymard Institute, updated 2025', es: 'Baymard Institute, actualizado en 2025', vi: 'Baymard Institute, cập nhật 2025' },
    url: 'https://baymard.com/lists/cart-abandonment-rate',
  },
  ai18: {
    value: '18 %',
    label: {
      fr: 'des entreprises françaises de 10 salariés ou plus utilisent au moins une technologie d’IA en 2025 (10 % en 2024).',
      en: 'of French companies with 10+ employees used at least one AI technology in 2025 (10% in 2024).',
      es: 'de las empresas francesas con 10 o más empleados usaron alguna tecnología de IA en 2025 (10 % en 2024).',
      vi: 'doanh nghiệp Pháp từ 10 nhân viên trở lên dùng ít nhất một công nghệ AI năm 2025 (10 % năm 2024).',
    },
    source: { fr: 'Insee, Insee Première n° 2120', en: 'Insee, Insee Première no. 2120', es: 'Insee, Insee Première n.º 2120', vi: 'Insee, Insee Première số 2120' },
    url: 'https://www.insee.fr/fr/statistiques/9025878',
  },
  ai54: {
    value: '54 %',
    label: {
      fr: 'des entreprises qui n’utilisent pas l’IA citent un manque d’expertise.',
      en: 'of companies not using AI cite a lack of expertise.',
      es: 'de las empresas que no usan IA citan falta de experiencia.',
      vi: 'doanh nghiệp chưa dùng AI nêu lý do thiếu chuyên môn.',
    },
    source: { fr: 'Insee, enquête TIC 2025', en: 'Insee, ICT survey 2025', es: 'Insee, encuesta TIC 2025', vi: 'Insee, khảo sát TIC 2025' },
    url: 'https://www.insee.fr/fr/statistiques/9025878',
  },
  mck60: {
    value: '60 %',
    label: {
      fr: 'des métiers comptent au moins 30 % d’activités automatisables avec les technologies existantes.',
      en: 'of occupations have at least 30% of activities that could be automated with existing technology.',
      es: 'de las ocupaciones tienen al menos un 30 % de actividades automatizables con la tecnología existente.',
      vi: 'nghề nghiệp có ít nhất 30 % hoạt động có thể tự động hóa bằng công nghệ hiện có.',
    },
    source: { fr: 'McKinsey Global Institute, 2017', en: 'McKinsey Global Institute, 2017', es: 'McKinsey Global Institute, 2017', vi: 'McKinsey Global Institute, 2017' },
    url: 'https://www.mckinsey.com/featured-insights/digital-disruption/harnessing-automation-for-a-future-that-works',
  },
  phone91: {
    value: '91 %',
    label: {
      fr: 'des Français de 12 ans et plus possèdent un smartphone.',
      en: 'of people in France aged 12 and over own a smartphone.',
      es: 'de los franceses de 12 años o más tienen smartphone.',
      vi: 'người Pháp từ 12 tuổi trở lên có điện thoại thông minh.',
    },
    source: { fr: 'Arcep / Credoc, Baromètre du numérique 2025', en: 'Arcep / Credoc, Digital barometer 2025', es: 'Arcep / Credoc, Barómetro digital 2025', vi: 'Arcep / Credoc, Khảo sát số 2025' },
    url: 'https://www.arcep.fr/cartes-et-donnees/nos-publications-chiffrees/barometre-du-numerique/le-barometre-du-numerique-edition-2025.html',
  },
};

const TITLE: L4 = {
  fr: 'Repères chiffrés du marché',
  en: 'Market figures',
  es: 'Cifras del mercado',
  vi: 'Số liệu thị trường',
};
const NOTE: L4 = {
  fr: 'Données publiques citées avec leur source : elles décrivent le marché, pas des résultats de NeuraWeb.',
  en: 'Public data cited with their source: they describe the market, not NeuraWeb results.',
  es: 'Datos públicos citados con su fuente: describen el mercado, no resultados de NeuraWeb.',
  vi: 'Dữ liệu công khai kèm nguồn: mô tả thị trường, không phải kết quả của NeuraWeb.',
};
const SOURCE_LABEL: L4 = { fr: 'Source', en: 'Source', es: 'Fuente', vi: 'Nguồn' };

interface SourcedStatsProps {
  ids: (keyof typeof STATS)[];
  /** dark = section sombre (texte clair) · light = section claire */
  tone?: 'dark' | 'light';
  className?: string;
}

export function SourcedStats({ ids, tone = 'dark', className = '' }: SourcedStatsProps) {
  const { language } = useLanguage();
  const lang = (['fr', 'en', 'es', 'vi'].includes(language as string) ? language : 'fr') as keyof L4;
  const dark = tone === 'dark';

  return (
    <div className={className}>
      <h3 className={`mb-6 text-center font-display text-xl font-bold sm:text-2xl ${dark ? 'text-white' : 'text-slate-900'}`}>{TITLE[lang]}</h3>
      <ul className={`grid gap-4 ${ids.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        {ids.map((id) => {
          const s = STATS[id];
          return (
            <li
              key={id}
              className={`flex flex-col rounded-2xl border p-5 sm:p-6 ${dark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}
            >
              <p className={`mb-2 font-display text-4xl font-black leading-none ${dark ? 'text-white' : 'text-slate-900'}`}>{s.value}</p>
              <p className={`mb-4 text-sm leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{s.label[lang]}</p>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-auto inline-flex min-h-[44px] items-center gap-1 text-xs font-semibold underline underline-offset-4 ${dark ? 'text-slate-200' : 'text-slate-700'}`}
              >
                {SOURCE_LABEL[lang]} : {s.source[lang]}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
      <p className={`mt-4 text-center text-xs ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{NOTE[lang]}</p>
    </div>
  );
}
