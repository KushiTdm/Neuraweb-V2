'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  UtensilsCrossed,
  CalendarCheck,
  ShoppingBag,
  CreditCard,
  Star,
  Heart,
  Network,
  ArrowRight,
  ExternalLink,
  TrendingUp,
  Sparkles,
  Clock,
  Percent,
  Smartphone,
  ShieldCheck,
  BadgeCheck,
  Check,
} from 'lucide-react';

import { gsap, ScrollTrigger } from '@/lib/gsap-setup';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LocalizedLink } from '@/components/localized-link';
import { ResponsiveCards } from '@/components/ui/cards-carousel';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// ═══════════════════════════════════════════════════════════════════════════
// DONNÉES
// ═══════════════════════════════════════════════════════════════════════════

const TYPES_RESTO = [
  'Bistrot',
  'Brasserie',
  'Gastronomique',
  'Pizzeria',
  'Burger',
  'Food truck',
  'Cantine de quartier',
  'Traiteur',
  'Café',
  'Réseau / Franchise',
];

interface Formule {
  id: string;
  icon: React.ElementType;
  name: string;
  tagline: string;
  profil: string;
  bullets: string[];
  accent: string; // tailwind text/bg accent base, ex 'amber'
}

const FORMULES: Formule[] = [
  {
    id: 'landing',
    icon: Smartphone,
    name: 'Landing',
    tagline: 'Être trouvé et réservable, sans détour.',
    profil: 'Café, restaurant indépendant qui démarre en ligne',
    accent: 'amber',
    bullets: [
      'Page unique rapide, optimisée mobile',
      'Menu lisible + horaires + plan Google Maps',
      'Téléphone cliquable + réservation directe',
      'Galerie photos & SEO local de base',
    ],
  },
  {
    id: 'vitrine',
    icon: Star,
    name: 'Vitrine Pro',
    tagline: 'Une image à la hauteur de votre table.',
    profil: 'Restaurant qui veut une vraie crédibilité en ligne',
    accent: 'orange',
    bullets: [
      'Site multi-pages au design sur-mesure',
      'Avis Google mis en avant (preuve sociale)',
      'Carte modifiable en autonomie',
      'SEO local renforcé + bouton réservation',
    ],
  },
  {
    id: 'commande',
    icon: ShoppingBag,
    name: 'Réservation + Commande',
    tagline: 'Encaissez en direct, sans commission.',
    profil: 'Service en salle, à emporter et click & collect',
    accent: 'rose',
    bullets: [
      'Réservation en ligne native (créneaux, e-mail)',
      'Commande + click & collect avec suivi en direct',
      'Paiement Stripe sécurisé (~1,4 % vs 30 %)',
      'Promos anti-gaspillage en un clic',
    ],
  },
  {
    id: 'fidelite',
    icon: Heart,
    name: 'Fidélité + Compte client',
    tagline: 'Transformez un passage en habitude.',
    profil: 'Clientèle régulière, habitués à choyer',
    accent: 'fuchsia',
    bullets: [
      'Programme de points & paliers de récompenses',
      'Compte client : historique, profil, statuts',
      'Relances marketing automatiques',
      'Base clients first-party réutilisable',
    ],
  },
  {
    id: 'reseau',
    icon: Network,
    name: 'Réseau / Franchise',
    tagline: 'Pilotez tout votre réseau d’un seul écran.',
    profil: 'Chaînes et multi-sites',
    accent: 'violet',
    bullets: [
      'Tableau de bord centralisé multi-établissements',
      'Gestion d’inventaire & réassort automatique',
      'Intégration POS / caisse (Zelty, Lightspeed)',
      'Campagnes segmentées e-mail + SMS + push',
    ],
  },
];

interface Demo {
  name: string;
  url: string;
  type: string;
  desc: string;
  tag: string;
}

const DEMOS: Demo[] = [
  {
    name: 'Marguerite',
    url: 'https://restaurants-marguerite.vercel.app/',
    type: 'Cantine de marché',
    tag: 'Landing',
    desc: 'Menu ardoise du jour, formule déj 19 €, réservation, galerie et plan d’accès.',
  },
  {
    name: 'Atelier & Fourchette',
    url: 'https://restaurants-atelier-fourchette.vercel.app/',
    type: 'Cantine de saison',
    tag: 'Vitrine Pro',
    desc: 'Vitrine soignée et de saison, design éditorial mettant la cuisine en avant.',
  },
  {
    name: 'Le Jardin d’Or',
    url: 'https://restaurants-jardindor.vercel.app/',
    type: 'Gastronomique',
    tag: 'Vitrine Pro',
    desc: 'Site haut de gamme, avis 4,9/5 (428), plats signature et galerie immersive.',
  },
  {
    name: 'Séraphine',
    url: 'https://restaurants-seraphine.vercel.app/',
    type: 'Bistrot de marché',
    tag: 'Réservation + Commande',
    desc: 'Réservation en ligne et commande à emporter, carte qui change au gré du marché.',
  },
  {
    name: 'BurgerBoom',
    url: 'https://restaurants-burger.vercel.app/',
    type: 'Burger artisanal',
    tag: 'Commande + Fidélité',
    desc: 'Commande, click & collect, promos happy hour −20 % et programme de points.',
  },
  {
    name: 'Voltaire',
    url: 'https://restaurants-voltaire.vercel.app/',
    type: 'Cantine d’habitués',
    tag: 'Fidélité',
    desc: 'Compte client, points 1 € = 1 pt, paliers café / dessert / dîner offerts.',
  },
  {
    name: 'L’Éden Fruité',
    url: 'https://ledenfruite.vercel.app/',
    type: 'Réseau 80+ restos',
    tag: 'Réseau / Franchise',
    desc: 'Localisateur multi-sites, espace franchise, carte fidélité et actualités réseau.',
  },
];

interface UseCase {
  icon: React.ElementType;
  context: string;
  solution: string;
  result: string;
}

const USE_CASES: UseCase[] = [
  {
    icon: CreditCard,
    context: 'Un fast-food fait 5 000 €/mois de ventes via Uber Eats et Deliveroo, qui prélèvent 30 %.',
    solution: 'Commande + paiement Stripe en direct sur son propre site (≈ 1,4 % + 0,25 €).',
    result: '≈ 1 400 €/mois récupérés · ~17 000 €/an · site amorti en 1 à 3 mois',
  },
  {
    icon: Heart,
    context: 'Une cantine de quartier voit ses habitués revenir… ou pas, sans aucun moyen de les relancer.',
    solution: 'Programme de fidélité (points, paliers) + relances automatiques sur base client.',
    result: '+1 visite/mois × 300 habitués à 25 € = +7 500 €/mois de CA récurrent',
  },
  {
    icon: Star,
    context: 'Un restaurant a d’excellents avis Google… noyés sur une plateforme tierce.',
    solution: 'Avis 4,9/5 affichés dès le premier écran + design pro et rassurant.',
    result: 'Taux de réservation +30 à +50 % grâce à la preuve sociale',
  },
  {
    icon: Percent,
    context: 'Chaque soir, des plats du jour finissent à la poubelle faute d’écoulement.',
    solution: 'Promo « dernière heure » / « invendu du jour » −20 à −50 % appliquée en un clic.',
    result: 'Marge nette récupérée chaque service + clientèle « bonnes affaires »',
  },
  {
    icon: ShoppingBag,
    context: 'Le click & collect au comptoir génère erreurs, files d’attente et appels « c’est prêt ? ».',
    solution: 'Créneau réservé, code de retrait 4 chiffres, suivi en direct + upsell intégré.',
    result: 'Panier moyen +15 à +25 % · zéro appel de suivi · moins d’erreurs',
  },
  {
    icon: Smartphone,
    context: '9 clients sur 10 vérifient un resto sur leur téléphone avant de venir — sans le trouver.',
    solution: 'Page rapide, fiche Google à jour, données structurées schema.org Restaurant.',
    result: 'Visible sur « restaurant + quartier » et cité par les réponses IA (Google, ChatGPT)',
  },
];

// ⚠️ Doit rester synchrone avec FAQ_DATA dans app/[lang]/restaurants/page.tsx
const FAQ: { q: string; a: string }[] = [
  {
    q: 'Combien coûte un site web pour restaurant ?',
    a: "Cela dépend de vos besoins. Une landing page soignée démarre autour de 990 à 1 490 €. Un site vitrine pro (multi-pages, avis, galerie) se situe entre 1 490 et 2 490 €. Un site avec réservation en ligne, commande et paiement Stripe va de 2 990 à 3 990 €. La formule fidélité + compte client se situe entre 4 990 et 7 990 €. Pour un réseau multi-restaurants ou une franchise, c'est sur devis. À chaque fois, vous restez propriétaire de votre site et de vos données.",
  },
  {
    q: 'Pourquoi un site direct plutôt qu’Uber Eats ou Deliveroo ?',
    a: "Les plateformes de livraison prélèvent 20 à 30 % de commission sur chaque commande. Un paiement encaissé directement sur votre site via Stripe coûte environ 1,4 % + 0,25 € par transaction en Europe. Pour 5 000 € de ventes en ligne par mois, l'écart représente environ 1 400 € économisés chaque mois, soit près de 17 000 €/an. En plus, vous récupérez la donnée client (e-mail, historique) que les plateformes confisquent.",
  },
  {
    q: 'Quels sont les frais mensuels en plus du développement ?',
    a: "Les frais d'infrastructure dépendent de la formule : 10 à 20 €/mois pour une vitrine simple (domaine + hébergement), 20 à 40 €/mois avec CMS et avis, 40 à 80 €/mois dès qu'on ajoute réservation, commande et paiement (base de données + e-mail/SMS), 80 à 150 €/mois pour la fidélité avec volume marketing. S'ajoutent les frais Stripe (1,4 % + 0,25 €) uniquement sur les paiements réellement encaissés.",
  },
  {
    q: 'Puis-je commencer petit et faire évoluer le site ?',
    a: "Oui. Chaque formule inclut tout le niveau précédent. On peut démarrer par une vitrine pour être trouvable et réservable, puis ajouter la commande en ligne, puis la fidélité, sans tout refaire. Votre investissement initial n'est jamais perdu : le site grandit avec votre activité.",
  },
  {
    q: 'Comment fonctionne le click & collect ?',
    a: "Le client choisit ses plats, paie en ligne, sélectionne un créneau de retrait et reçoit un code à 4 chiffres. Il suit sa commande en direct (Reçue → En préparation → Prête à retirer). Côté cuisine, un tableau reçoit les commandes en temps réel avec un bouton pour faire avancer chaque statut. Résultat : moins d'appels « c'est prêt ? », moins d'erreurs, et un panier souvent supérieur grâce aux suggestions intégrées.",
  },
  {
    q: 'Vais-je pouvoir mettre à jour ma carte moi-même ?',
    a: "Oui. Dès la formule Vitrine Pro, vous modifiez vos plats, vos prix et vos horaires en autonomie via une interface simple. Sur les formules avec commande, vous appliquez aussi en un clic des promotions anti-gaspillage (« dernière heure », « invendu du jour », −20 à −50 %) : le prix se met à jour en direct sur la carte vue par vos clients.",
  },
  {
    q: 'Le site sera-t-il bien référencé sur Google ?',
    a: "Oui : optimisation SEO local incluse dans toutes les formules, données structurées schema.org (Restaurant, menu, horaires, avis), connexion à votre fiche Google Business Profile, sitemap XML. Objectif : apparaître quand on cherche « restaurant + quartier » et être repris par les réponses IA de Google et des assistants.",
  },
  {
    q: 'En combien de temps mon site est-il livré ?',
    a: "Comptez 1 à 2 semaines pour une landing page, 2 à 4 semaines pour une vitrine pro, 4 à 6 semaines pour un site avec réservation, commande et paiement, et 6 à 10 semaines pour une plateforme de fidélité complète. Un réseau multi-sites est planifié selon le périmètre.",
  },
  {
    q: 'À qui appartient le site et les données clients ?',
    a: "À vous, intégralement. Vous êtes propriétaire de votre nom de domaine, du code de votre site et de votre base clients (e-mails, historique de commandes, points de fidélité). Contrairement aux plateformes de livraison, personne ne s'interpose entre vous et vos clients.",
  },
];

// Accents tailwind par formule (classes statiques pour purge OK)
const ACCENT: Record<string, { chip: string; icon: string; ring: string }> = {
  amber: { chip: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'text-amber-600 bg-amber-50', ring: 'hover:border-amber-300' },
  orange: { chip: 'bg-orange-50 text-orange-700 border-orange-200', icon: 'text-orange-600 bg-orange-50', ring: 'hover:border-orange-300' },
  rose: { chip: 'bg-rose-50 text-rose-700 border-rose-200', icon: 'text-rose-600 bg-rose-50', ring: 'hover:border-rose-300' },
  fuchsia: { chip: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200', icon: 'text-fuchsia-600 bg-fuchsia-50', ring: 'hover:border-fuchsia-300' },
  violet: { chip: 'bg-violet-50 text-violet-700 border-violet-200', icon: 'text-violet-600 bg-violet-50', ring: 'hover:border-violet-300' },
};

// ═══════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════

export function RestaurantsPageClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 36,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });
      ScrollTrigger.refresh();
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const scrollToFormules = () =>
    document.getElementById('formules')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <>
      <Header />
      <div ref={containerRef} className="bg-white text-slate-800 overflow-x-hidden">
        <Hero onScrollToFormules={scrollToFormules} />
        <Problem />
        <Formules />
        <Demos />
        <UseCases />
        <Faq />
        <BlogTeaser />
        <FinalCTA />
      </div>
      <Footer />
    </>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────────

function Hero({ onScrollToFormules }: { onScrollToFormules: () => void }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-rose-50 pt-24 pb-12 md:pt-32 md:pb-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(244,114,182,0.10),transparent_60%)] pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7" data-reveal>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-amber-200 text-amber-700 text-xs sm:text-sm font-medium mb-4 md:mb-6">
            <UtensilsCrossed className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Sites web pour restaurants
          </span>

          <h1 className="font-display text-[2rem] leading-[1.1] sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
            Votre restaurant mérite mieux que{' '}
            <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              30 % de commission
            </span>
          </h1>

          <p className="mt-4 md:mt-6 text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl">
            Réservation en ligne, commande et <strong>click & collect avec paiement
            sans commission</strong>, fidélité : un site qui vous appartient et qui
            transforme un visiteur en client fidèle. <strong>7 démos en ligne</strong> à
            l’appui.
          </p>

          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onScrollToFormules}
              size="lg"
              className="bg-gradient-to-r from-amber-600 to-rose-500 hover:from-amber-700 hover:to-rose-600 text-white shadow-lg shadow-amber-600/20 h-12 px-6 sm:px-8"
            >
              Voir les formules
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-white border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 h-12 px-6 sm:px-8"
            >
              <LocalizedLink href="/booking">Demander un devis gratuit</LocalizedLink>
            </Button>
          </div>

          {/* Trust badges : ligne compacte mobile, grille à partir de sm */}
          <div className="mt-6 md:mt-10 flex flex-wrap gap-x-4 gap-y-2 sm:grid sm:grid-cols-3 sm:gap-4">
            {[
              { icon: CreditCard, label: 'Sans commission', longLabel: 'Paiement sans commission', color: 'text-rose-600' },
              { icon: CalendarCheck, label: 'Réservation', longLabel: 'Réservation en ligne', color: 'text-amber-600' },
              { icon: ShieldCheck, label: 'Site à vous', longLabel: 'Site & données à vous', color: 'text-orange-600' },
            ].map(({ icon: Icon, label, longLabel, color }) => (
              <div key={label} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-slate-700">
                <Icon className={cn('w-4 h-4 sm:w-5 sm:h-5', color)} />
                <span className="sm:hidden">{label}</span>
                <span className="hidden sm:inline">{longLabel}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5" data-reveal>
          <div className="relative">
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-amber-600/20 border border-white/60 bg-white max-h-[60vh] md:max-h-none">
              <Image
                src="/assets/restaurant/template-restaurant.webp"
                alt="Aperçu d'un site web pour restaurant créé par NeuraWeb"
                width={800}
                height={1200}
                priority
                className="w-full h-auto object-cover object-top max-h-[60vh] md:max-h-none"
                sizes="(min-width: 1024px) 40vw, 90vw"
              />
            </div>
            {/* Badge haut-droit */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl px-4 py-3 border border-slate-200 hidden sm:flex items-center gap-2.5">
              <span className="text-base font-bold text-slate-400 line-through">30 %</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="text-base font-bold text-rose-600">1,4 %</span>
            </div>
            {/* Badge bas-gauche */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-4 py-3 border border-emerald-200 hidden sm:flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-slate-700">≈ 1 400 €/mois récupérés</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PROBLEM / TYPES ──────────────────────────────────────────────────────

function Problem() {
  const stats = [
    { value: '9/10', label: 'clients vérifient un resto sur leur mobile avant de venir' },
    { value: '20–30 %', label: 'de commission prélevée par les plateformes de livraison' },
    { value: '~1,4 %', label: 'de frais seulement avec un paiement Stripe en direct' },
    { value: '×5', label: 'plus cher d’acquérir un client que d’en fidéliser un' },
  ];
  return (
    <section className="bg-slate-50 py-10 md:py-16 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 md:mb-12">
          {stats.map((s) => (
            <div key={s.value} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm text-center">
              <div className="font-display text-2xl sm:text-4xl font-extrabold text-amber-600 mb-1.5 sm:mb-2">{s.value}</div>
              <p className="text-xs sm:text-sm text-slate-600 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 md:mb-6">
          Pensé pour tous les profils de restauration
        </p>
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2.5">
          {TYPES_RESTO.map((t) => (
            <span key={t} className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white border border-slate-200 text-slate-700 font-medium text-xs sm:text-sm shadow-sm">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FORMULES (sans prix) ──────────────────────────────────────────────────

function Formules() {
  const formuleCards = FORMULES.map((f) => {
    const a = ACCENT[f.accent];
    const Icon = f.icon;
    return (
      <div
        key={f.id}
        data-reveal
        className={cn(
          'flex flex-col rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition-all hover:shadow-md h-full',
          a.ring
        )}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={cn('w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center', a.icon)}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border', a.chip)}>
            {f.name}
          </span>
        </div>
        <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 mb-1">{f.tagline}</h3>
        <p className="text-sm text-slate-500 mb-4">{f.profil}</p>
        <ul className="space-y-2 sm:space-y-2.5 mb-6">
          {f.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-4 border-t border-slate-100">
          <LocalizedLink
            href="/booking"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors"
          >
            Demander un devis
            <ArrowRight className="w-4 h-4" />
          </LocalizedLink>
        </div>
      </div>
    );
  });

  // Carte CTA finale (incluse dans la grille desktop ET le carrousel mobile)
  const ctaCard = (
    <div
      key="cta"
      data-reveal
      className="flex flex-col justify-center rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-rose-50 p-5 sm:p-6 text-center h-full"
    >
      <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-amber-600 mx-auto mb-3" />
      <h3 className="font-display text-lg font-bold text-slate-900 mb-2">
        Pas sûr de la bonne formule ?
      </h3>
      <p className="text-sm text-slate-600 mb-5">
        On audite votre situation et on vous recommande le bon niveau, gratuitement.
      </p>
      <Button
        asChild
        className="bg-gradient-to-r from-amber-600 to-rose-500 hover:from-amber-700 hover:to-rose-600 text-white w-full"
      >
        <LocalizedLink href="/booking">Échanger avec nous</LocalizedLink>
      </Button>
    </div>
  );

  return (
    <section id="formules" className="py-14 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14" data-reveal>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4">
            5 formules, <span className="text-amber-600">de la vitrine au réseau</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Chaque formule inclut tout le niveau précédent. On démarre petit, on fait évoluer
            sans rien refaire. <span className="text-slate-800 font-medium">Les fourchettes de prix
            sont détaillées dans la&nbsp;FAQ.</span>
          </p>
        </div>

        <ResponsiveCards
          breakpoint="md"
          gridClass="grid-cols-2 lg:grid-cols-3"
          gridGap="gap-6"
          dotColor="#d97706"
          carouselPadding={1}
        >
          {[...formuleCards, ctaCard]}
        </ResponsiveCards>
      </div>
    </section>
  );
}

// ─── DÉMOS LIVE ────────────────────────────────────────────────────────────

function Demos() {
  const demoCards = DEMOS.map((d) => (
    <a
      key={d.name}
      href={d.url}
      target="_blank"
      rel="noopener noreferrer"
      data-reveal
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition-all hover:shadow-lg hover:border-amber-300 hover:-translate-y-0.5 h-full"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          {d.tag}
        </span>
        <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-amber-600 transition-colors" />
      </div>
      <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">{d.name}</h3>
      <p className="text-sm font-medium text-slate-400 mb-3">{d.type}</p>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">{d.desc}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 group-hover:gap-2.5 transition-all">
        Ouvrir la démo
        <ArrowRight className="w-4 h-4" />
      </span>
    </a>
  ));

  return (
    <section className="py-14 md:py-28 bg-gradient-to-br from-rose-50 via-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14" data-reveal>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium mb-4 md:mb-5">
            <BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            7 démos réelles & cliquables
          </span>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4">
            Voyez exactement ce que vous achetez
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Pas de maquette PowerPoint : des sites en ligne, fonctionnels, que vous pouvez tester
            tout de suite.
          </p>
        </div>

        <ResponsiveCards
          breakpoint="md"
          gridClass="grid-cols-2 lg:grid-cols-3"
          gridGap="gap-6"
          dotColor="#e11d48"
          carouselPadding={1}
        >
          {demoCards}
        </ResponsiveCards>
      </div>
    </section>
  );
}

// ─── CAS D'USAGE CHIFFRÉS ──────────────────────────────────────────────────

function UseCases() {
  const useCaseCards = USE_CASES.map((uc, i) => {
    const Icon = uc.icon;
    return (
      <article
        key={i}
        data-reveal
        className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm h-full"
      >
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
        </div>
        <p className="text-sm text-slate-500 mb-3 leading-relaxed">{uc.context}</p>
        <p className="text-sm text-slate-800 mb-4 leading-relaxed font-medium">{uc.solution}</p>
        <div className="mt-auto flex items-start gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3">
          <TrendingUp className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm font-semibold text-emerald-700">{uc.result}</span>
        </div>
      </article>
    );
  });

  return (
    <section className="py-14 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14" data-reveal>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4">
            Des résultats <span className="text-amber-600">chiffrés</span>, pas des promesses
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Ce qui se fait vraiment en 2026 dans la restauration, et ce que vous pouvez en attendre.
          </p>
        </div>

        <ResponsiveCards
          breakpoint="md"
          gridClass="grid-cols-2 lg:grid-cols-3"
          gridGap="gap-6"
          dotColor="#d97706"
          carouselPadding={1}
        >
          {useCaseCards}
        </ResponsiveCards>

        <p className="text-center text-xs text-slate-400 mt-6 md:mt-8 max-w-3xl mx-auto px-2">
          Fourchettes indicatives basées sur des moyennes du secteur et nos projets ; les résultats
          réels dépendent de votre volume, votre ticket moyen et votre zone de chalandise.
        </p>
      </div>
    </section>
  );
}

// ─── FAQ (avec fourchettes de prix) ────────────────────────────────────────

function Faq() {
  return (
    <section className="py-12 md:py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-10" data-reveal>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
            Questions <span className="text-amber-600">fréquentes</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Budgets, délais, fonctionnement : tout ce que les restaurateurs nous demandent avant de se lancer.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full" data-reveal>
          {FAQ.map((item, idx) => (
            <AccordionItem
              key={idx}
              value={`faq-${idx}`}
              className="border border-slate-200 rounded-lg mb-2 overflow-hidden bg-white shadow-sm data-[state=open]:shadow-md"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline text-left font-semibold text-slate-900 text-base">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-slate-600 leading-relaxed text-sm">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

// ─── BLOG TEASER ───────────────────────────────────────────────────────────

function BlogTeaser() {
  return (
    <section className="py-10 md:py-12 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8" data-reveal>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 md:mb-4">
          À lire aussi
        </p>
        <LocalizedLink
          href="/blog/site-restaurant-sans-commission-2026"
          className="group flex items-start gap-3 sm:gap-5 rounded-2xl border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-colors p-4 sm:p-5"
        >
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
              Article · Sites Web
            </p>
            <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2 group-hover:text-amber-700 transition-colors leading-snug">
              Site de restaurant en 2026 : zéro commission, 100 % de marge
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Uber Eats prend 30 %, votre site direct 1,4 %. Sur 5 000 €/mois de ventes,
              c'est ~1 400 € récupérés chaque mois.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform" />
        </LocalizedLink>
      </div>
    </section>
  );
}

// ─── CTA FINAL ─────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="relative py-14 md:py-28 overflow-hidden bg-gradient-to-br from-amber-600 via-orange-500 to-rose-500 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-reveal>
        <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 md:mb-5 leading-tight">
          Reprenez la main sur vos commandes
        </h2>
        <p className="text-base sm:text-xl text-white/90 mb-6 md:mb-10 max-w-2xl mx-auto">
          Devis gratuit sous 24h. Sans engagement. On vous montre les démos en direct.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="bg-white hover:bg-slate-50 text-amber-700 h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-bold shadow-2xl shadow-amber-900/30 w-full sm:w-auto"
          >
            <LocalizedLink href="/booking">
              <Sparkles className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              Demander mon devis gratuit
            </LocalizedLink>
          </Button>
        </div>

        <p className="mt-6 md:mt-8 inline-flex items-center gap-2 text-xs sm:text-sm text-white/80">
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Réponse garantie sous 4 heures ouvrées
        </p>
      </div>
    </section>
  );
}
