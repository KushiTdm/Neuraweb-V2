'use client';

import React, { useEffect, useRef } from 'react';
import {
  Landmark,
  ShieldCheck,
  Accessibility,
  FileCheck2,
  MessagesSquare,
  Smartphone,
  Store,
  ArrowRight,
  Sparkles,
  Clock,
  Check,
  ScrollText,
  Lock,
  Server,
  BadgeCheck,
  TrendingUp,
  Megaphone,
  CalendarCheck,
  MapPin,
  Bot,
} from 'lucide-react';

import { gsap, ScrollTrigger } from '@/lib/gsap-setup';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LocalizedLink } from '@/components/localized-link';
import { DemoCTA } from '@/components/demo-cta';
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

const TYPES_COLLECTIVITES = [
  'Mairie',
  'Commune',
  'Intercommunalité / EPCI',
  'Métropole',
  'CCAS',
  'Office de tourisme',
  'Syndicat mixte',
  'Médiathèque',
  'Centre culturel',
  'Établissement public',
];

interface Brique {
  id: string;
  icon: React.ElementType;
  name: string;
  tagline: string;
  profil: string;
  bullets: string[];
  accent: string;
}

const BRIQUES: Brique[] = [
  {
    id: 'site',
    icon: Accessibility,
    name: 'Site conforme',
    tagline: 'Un site institutionnel conforme et durable.',
    profil: 'Refonte ou mise en conformité du site existant',
    accent: 'indigo',
    bullets: [
      'Accessibilité RGAA 4.1.2 (106 critères)',
      'Déclaration d’accessibilité + schéma pluriannuel',
      'RGPD & cookies CNIL (Accepter / Refuser)',
      'Rapide, mobile-first, hébergé en France',
    ],
  },
  {
    id: 'demarches',
    icon: FileCheck2,
    name: 'Démarches en ligne',
    tagline: 'Des démarches réalisables de bout en bout.',
    profil: 'Sortir du déclaratif (PDF, liens externes)',
    accent: 'sky',
    bullets: [
      'Formulaires intelligents + suivi de demande',
      'Espace usager et historique des requêtes',
      'Connexion FranceConnect',
      'Signature électronique si nécessaire',
    ],
  },
  {
    id: 'chatbot',
    icon: MessagesSquare,
    name: 'Chatbot IA',
    tagline: 'Orienter chaque habitant, 24h/24.',
    profil: 'Désengorger l’accueil sur les questions fréquentes',
    accent: 'cyan',
    bullets: [
      'Oriente vers la bonne démarche / le bon service',
      'Transparence IA (art. 50 AI Act) + RGPD',
      'Données hébergées en France / UE',
      'Escalade vers un agent humain',
    ],
  },
  {
    id: 'app',
    icon: Smartphone,
    name: 'App citoyenne',
    tagline: 'Un point d’entrée unique vers la ville.',
    profil: 'Réservation, signalement, agenda, notifications',
    accent: 'blue',
    bullets: [
      'Réservation de salles & équipements sportifs',
      'Billetterie / inscriptions activités culturelles',
      'Signalement citoyen géolocalisé + suivi',
      'Agenda municipal & notifications push',
    ],
  },
  {
    id: 'commerces',
    icon: Store,
    name: 'Commerces locaux',
    tagline: 'Rendre le territoire visible en ligne.',
    profil: 'Attractivité & soutien au tissu économique',
    accent: 'violet',
    bullets: [
      'Annuaire des commerces optimisé SEO + IA',
      'Accompagnement individuel des commerçants',
      'Fiches reprises par Google et les assistants IA',
      'Tableau de bord & suivi pour la mairie',
    ],
  },
];

interface ConfItem {
  icon: React.ElementType;
  title: string;
  desc: string;
}

const CONFORMITE: ConfItem[] = [
  {
    icon: Accessibility,
    title: 'Accessibilité RGAA & ARCOM',
    desc: "Depuis le décret n° 2023-931, l’ARCOM peut sanctionner jusqu’à 50 000 € par service numérique non conforme. Nous remettons votre site au niveau RGAA 4.1.2 et produisons déclaration d’accessibilité + schéma pluriannuel.",
  },
  {
    icon: Lock,
    title: 'RGPD & cookies CNIL',
    desc: "Bandeau cookies avec choix explicite Accepter / Refuser (la « poursuite de navigation » n’est plus un consentement valable), registre des traitements, information des personnes et contrats sous-traitant conformes à l’article 28.",
  },
  {
    icon: Bot,
    title: 'IA conforme à l’AI Act',
    desc: "L’obligation de transparence de l’article 50 de l’AI Act est contraignante depuis le 2 août 2026 : l’usager sait qu’il parle à une IA, les contenus générés sont identifiés et un contrôle humain est conservé.",
  },
  {
    icon: Server,
    title: 'Hébergement souverain',
    desc: "Données hébergées en France ou dans l’UE, chiffrement, sauvegardes, gestion des accès et réversibilité contractualisée. La collectivité reste propriétaire de son code, de ses contenus et de ses données.",
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
    icon: ShieldCheck,
    context: 'Le site de la mairie n’affiche ni déclaration d’accessibilité ni schéma pluriannuel — un manquement désormais sanctionnable.',
    solution: 'Audit RGAA 4.1.2, remise à niveau, déclaration et schéma pluriannuel publiés.',
    result: 'Risque d’amende ARCOM (jusqu’à 50 000 €) écarté · site inclusif pour tous',
  },
  {
    icon: MessagesSquare,
    context: 'L’accueil est saturé d’appels répétitifs : « où faire ma carte d’identité ? », « horaires ? », « quel formulaire ? ».',
    solution: 'Chatbot IA qui oriente 24h/24 vers la bonne démarche, avec escalade vers un agent.',
    result: 'Accueil désengorgé sur les questions fréquentes · réponse immédiate 24h/24',
  },
  {
    icon: CalendarCheck,
    context: 'Salles municipales et ateliers culturels se réservent par téléphone ou e-mail, avec créneaux mal remplis.',
    solution: 'Réservation en ligne des salles, équipements et activités, disponible en continu.',
    result: 'Meilleur taux de remplissage · zéro échange manuel · suivi centralisé',
  },
  {
    icon: MapPin,
    context: 'Les habitants signalent voirie, éclairage et propreté par des canaux dispersés, sans suivi.',
    solution: 'Signalement citoyen géolocalisé avec photo et suivi du traitement de la demande.',
    result: 'Demandes tracées et priorisées · lien habitant ↔ mairie renforcé',
  },
  {
    icon: Store,
    context: 'Les commerces de la commune sont peu visibles sur Google et absents des réponses des assistants IA.',
    solution: 'Annuaire local optimisé SEO + GEO et accompagnement des commerçants volontaires.',
    result: 'Commerces trouvables sur « + nom de ville » · attractivité du territoire',
  },
  {
    icon: FileCheck2,
    context: 'La rubrique « Mes démarches » reste déclarative : elle renvoie vers des PDF ou un passage en mairie.',
    solution: 'Démarches réalisables en ligne de bout en bout, FranceConnect et suivi de demande.',
    result: 'Moins de déplacements inutiles · service public disponible 24h/24',
  },
];

// ⚠️ Doit rester synchrone avec FAQ_DATA dans app/[lang]/collectivites/page.tsx
const FAQ: { q: string; a: string }[] = [
  {
    q: 'Une commune peut-elle nous confier un projet sans appel d’offres ?',
    a: "Oui, dans la plupart des cas. Depuis le 1er avril 2026, un marché de fournitures ou de services peut être conclu sans publicité ni mise en concurrence sous 60 000 € HT (le seuil était de 40 000 € HT auparavant). La grande majorité des projets web, chatbot ou application pour une commune de taille moyenne entre dans cette fenêtre. Au-delà, on passe en procédure adaptée (MAPA), dont la collectivité définit librement les modalités. Nous maîtrisons le Code de la commande publique et accompagnons vos services sur la procédure la plus adaptée au périmètre retenu.",
  },
  {
    q: 'Notre site est-il vraiment exposé à une sanction d’accessibilité ?',
    a: "Oui. L’article 47 de la loi de 2005 impose l’accessibilité (RGAA 4.1.2) aux sites publics, et le décret n° 2023-931 du 9 octobre 2023 a confié à l’ARCOM un pouvoir de sanction. Après une mise en demeure laissant 3 mois pour corriger, l’ARCOM peut prononcer une amende pouvant aller jusqu’à 50 000 € par service numérique non conforme, reconductible. L’absence de déclaration d’accessibilité ou de schéma pluriannuel est elle aussi sanctionnable. Nous réalisons un audit d’accessibilité gracieux pour situer votre site.",
  },
  {
    q: 'Que comprend exactement la mise en conformité RGAA ?',
    a: "Un audit sur les 106 critères du RGAA 4.1.2, une remise à niveau du site (structure sémantique, contrastes, navigation clavier, formulaires accessibles, médias sous-titrés, PDF balisés), la rédaction de la déclaration d’accessibilité à afficher dès la page d’accueil, l’état des non-conformités, un plan de correction priorisé et l’aide à la rédaction du schéma pluriannuel sur 3 ans. L’accessibilité est intégrée dès la conception, pas ajoutée après coup.",
  },
  {
    q: 'Le chatbot pour la mairie est-il conforme au RGPD et à l’AI Act ?',
    a: "Oui, par conception. L’usager est clairement informé qu’il dialogue avec une IA — c’est l’obligation de transparence de l’article 50 de l’AI Act, juridiquement contraignante depuis le 2 août 2026. Les données sont hébergées en France ou dans l’UE, le traitement est documenté (base légale, information des personnes) et une escalade vers un agent humain reste toujours possible. Le chatbot oriente vers la bonne démarche 24h/24 et désengorge l’accueil sur les questions fréquentes.",
  },
  {
    q: 'Où sont hébergées les données des administrés ?',
    a: "En France ou dans l’Union européenne, avec SSL/HTTPS systématique, sauvegardes automatiques, chiffrement et gestion des accès. Pour les données les plus sensibles, nous privilégions un hébergement souverain. La collectivité reste propriétaire de ses contenus, de son code source et de ses données, et nous contractualisons la réversibilité dès le départ.",
  },
  {
    q: 'Peut-on commencer petit puis élargir le projet ?',
    a: "Oui, c’est même recommandé pour une collectivité. Le projet se phase : on peut démarrer par la refonte du site et sa mise en conformité, puis ajouter les démarches en ligne, le chatbot, l’application mobile citoyenne (réservation de salles, signalement, agenda) et la visibilité des commerces locaux, sans rien refaire. Chaque brique est indépendante et budgétée séparément.",
  },
  {
    q: 'Quelles retombées concrètes pour la commune ?',
    a: "Une réduction de la charge d’accueil téléphonique et physique sur les demandes répétitives, un meilleur taux de remplissage des salles et ateliers grâce à la réservation 24h/24, des données d’usage anonymisées pour ajuster les ressources, un lien renforcé entre habitants et mairie via le signalement citoyen, et une image modernisée utile à l’attractivité du territoire.",
  },
  {
    q: 'En combien de temps un projet est-il livré ?',
    a: "Comptez 4 à 8 semaines pour une refonte de site conforme RGAA, 6 à 10 semaines en ajoutant les démarches en ligne et un chatbot, et un planning dédié pour une application mobile citoyenne ou un dispositif multi-services. Nous proposons systématiquement un audit et un échange gracieux d’environ 30 minutes avant toute proposition chiffrée.",
  },
];

// Accents tailwind par brique (classes statiques pour purge OK)
const ACCENT: Record<string, { chip: string; icon: string; ring: string }> = {
  indigo: { chip: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: 'text-indigo-600 bg-indigo-50', ring: 'hover:border-indigo-300' },
  sky: { chip: 'bg-sky-50 text-sky-700 border-sky-200', icon: 'text-sky-600 bg-sky-50', ring: 'hover:border-sky-300' },
  cyan: { chip: 'bg-cyan-50 text-cyan-700 border-cyan-200', icon: 'text-cyan-600 bg-cyan-50', ring: 'hover:border-cyan-300' },
  blue: { chip: 'bg-blue-50 text-blue-700 border-blue-200', icon: 'text-blue-600 bg-blue-50', ring: 'hover:border-blue-300' },
  violet: { chip: 'bg-violet-50 text-violet-700 border-violet-200', icon: 'text-violet-600 bg-violet-50', ring: 'hover:border-violet-300' },
};

// ═══════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════

export function CollectivitesPageClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect du choix d'accessibilité : pas d'animation si l'utilisateur la réduit
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Décalages de départ selon la direction demandée via data-reveal
      const fromByDir: Record<string, gsap.TweenVars> = {
        up: { y: 40 },
        down: { y: -40 },
        left: { x: -48 },
        right: { x: 48 },
        scale: { scale: 0.9 },
      };

      // 1) Révélations individuelles (avec direction optionnelle)
      gsap.utils
        .toArray<HTMLElement>('[data-reveal]')
        .forEach((el) => {
          // Les éléments d'un groupe stagger sont gérés plus bas
          if (el.closest('[data-reveal-group]')) return;
          const dir = el.dataset.reveal || 'up';
          gsap.from(el, {
            opacity: 0,
            ...fromByDir[dir],
            duration: 0.75,
            ease: dir === 'scale' ? 'back.out(1.6)' : 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });

      // 2) Révélations en cascade (stagger) pour les grilles
      gsap.utils
        .toArray<HTMLElement>('[data-reveal-group]')
        .forEach((group) => {
          const items = group.querySelectorAll<HTMLElement>('[data-reveal]');
          if (!items.length) return;
          gsap.from(items, {
            opacity: 0,
            y: 44,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: { trigger: group, start: 'top 82%', once: true },
          });
        });

      // 3) Parallaxe douce sur les halos décoratifs (scrub lié au scroll)
      gsap.utils
        .toArray<HTMLElement>('[data-parallax]')
        .forEach((el) => {
          const depth = parseFloat(el.dataset.parallax || '60');
          gsap.to(el, {
            yPercent: depth,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement || el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        });

      ScrollTrigger.refresh();
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const scrollToBriques = () =>
    document.getElementById('briques')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <>
      <Header />
      <div ref={containerRef} className="bg-white text-slate-800 overflow-x-hidden">
        <Hero onScrollToBriques={scrollToBriques} />
        <Problem />
        <Briques />
        <Conformite />
        <UseCases />
        <Process />
        <DemoCTA sector="collectivite" />
        <Faq />
        <FinalCTA />
      </div>
      <Footer />
    </>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────────

function Hero({ onScrollToBriques }: { onScrollToBriques: () => void }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 pt-24 pb-12 md:pt-32 md:pb-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.10),transparent_60%)] pointer-events-none" />
      <div data-parallax="40" className="absolute -top-32 -right-32 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
      <div data-parallax="-40" className="absolute -bottom-32 -left-32 w-72 h-72 sm:w-96 sm:h-96 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7" data-reveal="left">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-indigo-200 text-indigo-700 text-xs sm:text-sm font-medium mb-4 md:mb-6">
            <Landmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Collectivités & secteur public
          </span>

          <h1 className="font-display text-[2rem] leading-[1.1] sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
            Le numérique de votre commune,{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
              conforme et utile
            </span>
          </h1>

          <p className="mt-4 md:mt-6 text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl">
            Sites <strong>conformes RGAA & RGPD</strong>, démarches en ligne,
            chatbot IA et application citoyenne. Une agence locale qui maîtrise la{' '}
            <strong>commande publique</strong> et accompagne votre transition numérique,
            brique par brique.
          </p>

          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onScrollToBriques}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white shadow-lg shadow-indigo-600/20 h-12 px-6 sm:px-8"
            >
              Découvrir les services
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-white border-indigo-300 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 h-12 px-6 sm:px-8"
            >
              <LocalizedLink href="/booking">Demander un audit gratuit</LocalizedLink>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-6 md:mt-10 flex flex-wrap gap-x-4 gap-y-2 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
            {[
              { icon: Accessibility, label: 'RGAA', longLabel: 'Accessibilité RGAA', color: 'text-indigo-600' },
              { icon: Lock, label: 'RGPD', longLabel: 'Conforme RGPD/CNIL', color: 'text-sky-600' },
              { icon: Server, label: 'France', longLabel: 'Hébergement France', color: 'text-cyan-600' },
              { icon: ScrollText, label: 'Marché public', longLabel: 'Commande publique', color: 'text-blue-600' },
            ].map(({ icon: Icon, label, longLabel, color }) => (
              <div key={label} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-slate-700">
                <Icon className={cn('w-4 h-4 sm:w-5 sm:h-5', color)} />
                <span className="sm:hidden">{label}</span>
                <span className="hidden sm:inline">{longLabel}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mini-tableau de conformité (sans image) */}
        <div className="lg:col-span-5" data-reveal="right">
          <div className="relative">
            <div className="rounded-2xl md:rounded-3xl bg-white shadow-2xl shadow-indigo-600/10 border border-slate-200 p-5 sm:p-6">
              <div className="flex items-center gap-2.5 mb-4 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Landmark className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-display font-bold text-slate-900 leading-tight">Tableau de conformité</p>
                  <p className="text-xs text-slate-500">État d’un service numérique public</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  { label: 'Accessibilité RGAA 4.1.2', icon: Accessibility },
                  { label: 'Déclaration + schéma pluriannuel', icon: ScrollText },
                  { label: 'RGPD & cookies (Accepter / Refuser)', icon: Lock },
                  { label: 'Transparence IA (AI Act art. 50)', icon: Bot },
                  { label: 'Hébergement France / UE', icon: Server },
                ].map(({ label, icon: Icon }) => (
                  <li key={label} className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                      <Check className="w-4 h-4 text-emerald-600" />
                    </span>
                    <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-sm text-slate-700 leading-snug">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Badge sanction évitée — animation bounce continue */}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:-bottom-4 sm:-left-4 animate-bounce-subtle bg-white rounded-2xl shadow-xl px-3.5 py-2.5 sm:px-4 sm:py-3 border border-amber-200 flex items-center gap-2 whitespace-nowrap motion-reduce:animate-none">
              <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span className="text-[11px] sm:text-xs font-semibold text-slate-700">Amende ARCOM jusqu’à 50 000 € évitée</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PROBLEM / STATS / TYPES ────────────────────────────────────────────────

function Problem() {
  const stats = [
    { value: '50 000 €', label: 'd’amende ARCOM possible pour un site public non conforme' },
    { value: '60 000 €', label: 'seuil de dispense de marché (depuis le 1er avril 2026)' },
    { value: '2 août 2026', label: 'transparence IA obligatoire (art. 50 de l’AI Act)' },
    { value: '24h/24', label: 'de services en ligne attendus par les administrés' },
  ];
  return (
    <section className="bg-slate-50 py-10 md:py-16 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          data-reveal-group
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 md:mb-12"
        >
          {stats.map((s) => (
            <div key={s.value} data-reveal className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm text-center">
              <div className="font-display text-lg sm:text-3xl font-extrabold text-indigo-600 mb-1.5 sm:mb-2 leading-tight">{s.value}</div>
              <p className="text-xs sm:text-sm text-slate-600 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 md:mb-6" data-reveal>
          Pensé pour tous les acteurs publics locaux
        </p>
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2.5" data-reveal>
          {TYPES_COLLECTIVITES.map((t) => (
            <span key={t} className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white border border-slate-200 text-slate-700 font-medium text-xs sm:text-sm shadow-sm">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── BRIQUES DE SERVICE ─────────────────────────────────────────────────────

function Briques() {
  const briqueCards = BRIQUES.map((b) => {
    const a = ACCENT[b.accent];
    const Icon = b.icon;
    return (
      <div
        key={b.id}
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
            {b.name}
          </span>
        </div>
        <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 mb-1">{b.tagline}</h3>
        <p className="text-sm text-slate-500 mb-4">{b.profil}</p>
        <ul className="space-y-2 sm:space-y-2.5 mb-6">
          {b.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2 text-sm text-slate-700">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-4 border-t border-slate-100">
          <LocalizedLink
            href="/booking"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-700 hover:text-indigo-800 transition-colors"
          >
            En parler avec nous
            <ArrowRight className="w-4 h-4" />
          </LocalizedLink>
        </div>
      </div>
    );
  });

  const ctaCard = (
    <div
      key="cta"
      data-reveal
      className="flex flex-col justify-center rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-cyan-50 p-5 sm:p-6 text-center h-full"
    >
      <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600 mx-auto mb-3" />
      <h3 className="font-display text-lg font-bold text-slate-900 mb-2">
        Par où commencer ?
      </h3>
      <p className="text-sm text-slate-600 mb-5">
        On audite votre situation et on vous propose un plan phasé, adapté à votre budget et à la commande publique.
      </p>
      <Button
        asChild
        className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white w-full"
      >
        <LocalizedLink href="/booking">Demander un échange</LocalizedLink>
      </Button>
    </div>
  );

  return (
    <section id="briques" className="py-14 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14" data-reveal>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4">
            5 briques, <span className="text-indigo-600">à activer selon vos priorités</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Chaque brique est indépendante et budgétée séparément. On démarre par l’essentiel,
            on élargit au rythme de la collectivité, sans tout refaire.
          </p>
        </div>

        <ResponsiveCards
          breakpoint="md"
          gridClass="grid-cols-2 lg:grid-cols-3"
          gridGap="gap-6"
          dotColor="#4f46e5"
          carouselPadding={1}
        >
          {[...briqueCards, ctaCard]}
        </ResponsiveCards>
      </div>
    </section>
  );
}

// ─── CONFORMITÉ (différenciateur secteur public) ────────────────────────────

function Conformite() {
  return (
    <section className="py-14 md:py-28 bg-gradient-to-br from-cyan-50 via-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14" data-reveal>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-indigo-200 text-indigo-700 text-xs sm:text-sm font-medium mb-4 md:mb-5">
            <BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Conformité by design
          </span>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4">
            La conformité n’est pas une option
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Pour un service public numérique, accessibilité, RGPD, transparence IA et souveraineté
            des données sont des obligations — désormais sanctionnées. Nous les intégrons dès la conception.
          </p>
        </div>

        <div data-reveal-group className="grid sm:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
          {CONFORMITE.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                data-reveal
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">{c.title}</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 md:mt-8 max-w-3xl mx-auto px-2">
          Références : article 47 de la loi n° 2005-102, décret n° 2023-931 (ARCOM), RGAA 4.1.2,
          recommandations CNIL, article 50 du règlement européen sur l’IA. Informations à jour de juin 2026,
          fournies à titre indicatif et ne constituant pas un conseil juridique.
        </p>
      </div>
    </section>
  );
}

// ─── CAS D'USAGE ────────────────────────────────────────────────────────────

function UseCases() {
  const useCaseCards = USE_CASES.map((uc, i) => {
    const Icon = uc.icon;
    return (
      <article
        key={i}
        data-reveal
        className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm h-full"
      >
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
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
            Des cas d’usage <span className="text-indigo-600">concrets</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Ce que vivent réellement les communes en 2026, et comment le numérique y répond.
          </p>
        </div>

        <ResponsiveCards
          breakpoint="md"
          gridClass="grid-cols-2 lg:grid-cols-3"
          gridGap="gap-6"
          dotColor="#4f46e5"
          carouselPadding={1}
        >
          {useCaseCards}
        </ResponsiveCards>
      </div>
    </section>
  );
}

// ─── PROCESS / COMMANDE PUBLIQUE ────────────────────────────────────────────

function Process() {
  const steps = [
    {
      icon: Megaphone,
      step: '01',
      title: 'Audit & échange gracieux',
      desc: 'Un point d’environ 30 minutes, sans engagement : audit d’accessibilité et de conformité, écoute de vos priorités.',
    },
    {
      icon: ScrollText,
      step: '02',
      title: 'Cadrage & commande publique',
      desc: 'On définit le périmètre et la procédure adaptée : dispense sous 60 000 € HT ou procédure adaptée (MAPA), avec les pièces attendues.',
    },
    {
      icon: FileCheck2,
      step: '03',
      title: 'Réalisation phasée',
      desc: 'Livraison brique par brique avec recette, documentation d’exploitation, documentation accessibilité et réversibilité.',
    },
    {
      icon: ShieldCheck,
      step: '04',
      title: 'Maintenance & conformité',
      desc: 'Suivi dans la durée : mises à jour, sécurité, accompagnement à la conformité (RGAA, RGPD, IA) au fil des évolutions.',
    },
  ];

  return (
    <section className="py-14 md:py-28 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14" data-reveal>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4">
            Travailler avec une collectivité, <span className="text-indigo-600">sereinement</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Nous maîtrisons le Code de la commande publique et avançons étape par étape, dans le respect des procédures.
          </p>
        </div>

        <div data-reveal-group className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                data-reveal
                className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm h-full"
              >
                <span className="absolute top-4 right-5 font-display text-3xl font-extrabold text-slate-100">
                  {s.step}
                </span>
                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function Faq() {
  return (
    <section className="py-12 md:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-10" data-reveal>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
            Questions <span className="text-indigo-600">fréquentes</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Commande publique, accessibilité, RGPD, IA : ce que les élus et services nous demandent avant de se lancer.
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

// ─── CTA FINAL ─────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="relative py-14 md:py-28 overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
      <div data-parallax="-35" className="absolute -bottom-32 -left-32 w-72 h-72 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-reveal="scale">
        <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 md:mb-5 leading-tight">
          Engageons la transition numérique de votre commune
        </h2>
        <p className="text-base sm:text-xl text-white/90 mb-6 md:mb-10 max-w-2xl mx-auto">
          Audit d’accessibilité et échange d’environ 30 minutes, à titre gracieux et sans engagement.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="bg-white hover:bg-slate-50 text-indigo-700 h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-bold shadow-2xl shadow-indigo-900/30 w-full sm:w-auto"
          >
            <LocalizedLink href="/booking">
              <Sparkles className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              Demander un audit gratuit
            </LocalizedLink>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-transparent border-white/60 text-white hover:bg-white/10 hover:text-white h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-bold w-full sm:w-auto"
          >
            <LocalizedLink href="/contact">Nous contacter</LocalizedLink>
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
