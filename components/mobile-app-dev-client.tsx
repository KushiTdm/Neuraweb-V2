'use client';

import React, { useRef, useState } from 'react';
import { useGsapReveal } from '@/hooks/use-gsap-reveal';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LocalizedLink } from '@/components/localized-link';
import { DemoCTA } from '@/components/demo-cta';
import { ResponsiveCards } from '@/components/ui/cards-carousel';
import {
  Smartphone,
  Apple,
  Zap,
  Code2,
  ShoppingBag,
  Calendar,
  Briefcase,
  Globe,
  Search,
  Palette,
  Wrench,
  Upload,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Clock,
  TrendingUp,
} from 'lucide-react';

type Lang = 'fr' | 'en' | 'es';

interface Props {
  lang: Lang;
}

const content: Record<Lang, {
  hero: { h1: string; highlight: string; subtitle: string; ctaPrimary: string; ctaSecondary: string };
  tech: { h2: string; subtitle: string; cards: { name: string; tag: string; desc: string }[] };
  types: { h2: string; subtitle: string; cards: { title: string; desc: string }[] };
  process: { h2: string; subtitle: string; steps: { title: string; desc: string }[] };
  pricing: { h2: string; subtitle: string; packs: { name: string; price: string; delay: string; features: string[]; highlighted?: boolean }[]; note: string };
  useCases: { h2: string; subtitle: string; items: { sector: string; context: string; solution: string; result: string; pack: string }[] };
  faq: { h2: string; items: { q: string; a: string }[] };
  cta: { h2: string; subtitle: string; button: string };
}> = {
  fr: {
    hero: {
      h1: 'Développement d\'Applications Mobiles',
      highlight: 'iOS & Android',
      subtitle: 'Création d\'applications mobiles natives et cross-platform pour startups et PME. React Native, Flutter, Swift, Kotlin. Basée à Lille, partout en France.',
      ctaPrimary: 'Demander un devis gratuit',
      ctaSecondary: 'Voir les tarifs',
    },
    tech: {
      h2: 'Technologies mobiles que nous maîtrisons',
      subtitle: 'De la PWA à l\'app native, nous choisissons la stack adaptée à votre budget et à vos utilisateurs.',
      cards: [
        { name: 'React Native', tag: 'Cross-platform', desc: 'Une seule base de code pour iOS et Android. Idéal pour valider un MVP rapidement.' },
        { name: 'Flutter', tag: 'Performance', desc: 'Interface fluide à 60 fps, framework Google éprouvé. Recommandé pour les apps graphiques.' },
        { name: 'Swift (iOS natif)', tag: 'Apple', desc: 'Expérience premium, accès complet aux APIs iOS, publication App Store optimisée.' },
        { name: 'Kotlin (Android natif)', tag: 'Google', desc: 'Performance native Android, intégration Material Design, publication Play Store.' },
      ],
    },
    types: {
      h2: 'Quel type d\'application mobile ?',
      subtitle: 'Nous développons des apps adaptées à votre secteur et à vos objectifs business.',
      cards: [
        { title: 'App e-commerce mobile', desc: 'Catalogue produit, paiement in-app, notifications push, suivi de commande. Intégration Stripe, Shopify, WooCommerce.' },
        { title: 'App de réservation', desc: 'Prise de rendez-vous, calendrier temps réel, confirmation automatique. Idéal pour hôtels, restaurants, praticiens.' },
        { title: 'App métier / B2B SaaS', desc: 'Outils internes, CRM mobile, gestion de flotte, remontée terrain. Synchronisation offline incluse.' },
        { title: 'Progressive Web App (PWA)', desc: 'Alternative économique à l\'app native : fonctionne dans le navigateur, installable, notifications push. 0€ de frais store.' },
      ],
    },
    process: {
      h2: 'Notre processus de création d\'application mobile',
      subtitle: 'De l\'idée à la publication sur l\'App Store et Google Play, en 8 à 16 semaines.',
      steps: [
        { title: '1. Audit & cadrage', desc: 'Analyse du marché, définition du MVP, choix de la stack (native vs cross-platform) selon votre budget et vos contraintes.' },
        { title: '2. Design UX/UI', desc: 'Maquettes Figma, prototype cliquable, respect des guidelines iOS Human Interface et Material Design.' },
        { title: '3. Développement', desc: 'Sprints bi-hebdomadaires avec démo, code versionné sur GitHub, tests automatisés, backend API sécurisé.' },
        { title: '4. Tests & publication', desc: 'Beta TestFlight + Play Console, corrections, soumission stores, support post-lancement inclus 3 mois.' },
      ],
    },
    pricing: {
      h2: 'Tarifs développement application mobile',
      subtitle: 'Des forfaits transparents, pas de mauvaise surprise. Devis détaillé sous 24h.',
      packs: [
        { name: 'MVP Mobile', price: 'À partir de 8 900€', delay: '3 à 4 semaines', features: ['App cross-platform (React Native)', '3 à 5 écrans clés', 'Authentification + 1 intégration API', 'Publication stores incluse', 'Support 1 mois'] },
        { name: 'App Standard', price: 'À partir de 15 900€', delay: '6 à 10 semaines', features: ['iOS + Android (natif ou Flutter)', '10 à 15 écrans', 'Backend sur mesure + admin', 'Notifications push, analytics', 'Support 3 mois'], highlighted: true },
        { name: 'App Premium', price: 'Sur devis', delay: '12 semaines et +', features: ['Features avancées (IA, temps réel)', 'Design custom animations', 'Architecture scalable', 'SLA 24/7', 'Évolutions continues'] },
      ],
      note: 'Tarifs indicatifs TTC. Hébergement backend, frais développeur Apple (99$/an) et Google Play (25$) non inclus.',
    },
    useCases: {
      h2: 'Cas d\'usage concrets',
      subtitle: 'Comment nos clients utilisent une application mobile pour valider, fidéliser et faire croître leur activité.',
      items: [
        { sector: 'Startup FoodTech', context: 'Lever des fonds suppose de prouver la traction. Un site web ne suffit pas à valider l\'usage mobile.', solution: 'MVP React Native (5 écrans) : commande, paiement Stripe, suivi livraison temps réel, publication App Store + Play Store.', result: 'Hypothèse validée en 6 semaines au lieu de 6 mois · rétention J+30 de 22% (vs 8% en web)', pack: 'MVP Mobile' },
        { sector: 'Chaîne de restaurants (15 sites)', context: 'Programme de fidélité papier, commandes par téléphone, aucune donnée client exploitable.', solution: 'App iOS + Android (15 écrans) : menu, commande, fidélité, paiement Apple/Google Pay, backend + notifications push.', result: 'Commandes à emporter ×4 · fréquence de visite +62% · 15 000 profils clients collectés', pack: 'App Standard' },
        { sector: 'PME e-commerce / retail', context: 'Site mobile lent, panier abandonné, aucune notification pour relancer les clients.', solution: 'App native catalogue + paiement in-app + notifications push + suivi de commande, synchro Shopify/WooCommerce.', result: 'Taux d\'engagement ×3 grâce aux push · panier moyen +20% via l\'upsell in-app', pack: 'App Standard' },
        { sector: 'B2B / SaaS terrain', context: 'Équipes mobiles sans outil adapté, ressaisie au bureau, données de terrain perdues.', solution: 'App métier scalable avec synchronisation offline, temps réel et tableau de bord admin sur mesure.', result: 'Remontée terrain en temps réel · 0 ressaisie · décisions basées sur des données fiables', pack: 'App Premium' },
      ],
    },
    faq: {
      h2: 'Questions fréquentes sur le développement mobile',
      items: [
        { q: 'Combien coûte le développement d\'une application mobile en France ?', a: 'Un MVP démarre à 8 900€ en cross-platform — soit bien en dessous des 11 000€ à 25 000€ généralement constatés sur le marché français en 2026. Une app standard iOS + Android se situe entre 15 900€ et 30 000€ selon la complexité. Une app premium avec IA ou temps réel peut dépasser 50 000€.' },
        { q: 'Combien de temps pour créer une app mobile ?', a: 'Comptez 6 à 8 semaines pour un MVP, 12 à 16 semaines pour une app complète iOS + Android avec backend. Nous livrons par sprints de 2 semaines pour que vous voyiez l\'avancement.' },
        { q: 'Cross-platform (React Native/Flutter) ou natif (Swift/Kotlin) ?', a: 'Cross-platform pour un MVP rapide et un budget serré (une seule équipe). Natif si vous visez une expérience premium, des performances graphiques élevées ou une intégration profonde avec le système (Apple Watch, widgets iOS, etc.).' },
        { q: 'Gérez-vous la publication sur l\'App Store et Google Play ?', a: 'Oui, inclus dans tous nos packs. Nous créons les comptes développeurs si besoin, préparons les captures, descriptions, et gérons la soumission + les éventuels retours d\'Apple ou Google.' },
        { q: 'Intervenez-vous à Lille, Lyon, Marseille ?', a: 'Oui. Équipe basée à Lille, clients partout en France (Paris, Lyon, Marseille...). Nous travaillons en remote avec points hebdomadaires visio, et nous déplaçons pour les kick-offs et jalons majeurs.' },
      ],
    },
    cta: {
      h2: 'Prêt à lancer votre application mobile ?',
      subtitle: 'Devis gratuit sous 24h. Aucun engagement.',
      button: 'Demander un devis',
    },
  },
  en: {
    hero: {
      h1: 'Mobile App Development',
      highlight: 'iOS & Android',
      subtitle: 'Custom mobile app development for startups and SMBs. Native and cross-platform: React Native, Flutter, Swift, Kotlin. Based in France, clients worldwide.',
      ctaPrimary: 'Get a free quote',
      ctaSecondary: 'View pricing',
    },
    tech: {
      h2: 'Mobile technologies we master',
      subtitle: 'From PWA to native apps, we pick the stack that fits your budget and your users.',
      cards: [
        { name: 'React Native', tag: 'Cross-platform', desc: 'One codebase for iOS and Android. Ideal to validate an MVP quickly.' },
        { name: 'Flutter', tag: 'Performance', desc: 'Smooth 60fps interface, Google-backed framework. Recommended for graphics-heavy apps.' },
        { name: 'Swift (iOS native)', tag: 'Apple', desc: 'Premium experience, full access to iOS APIs, optimized App Store submission.' },
        { name: 'Kotlin (Android native)', tag: 'Google', desc: 'Native Android performance, Material Design integration, Play Store publication.' },
      ],
    },
    types: {
      h2: 'What kind of mobile app?',
      subtitle: 'We build apps tailored to your industry and business goals.',
      cards: [
        { title: 'Mobile e-commerce app', desc: 'Product catalog, in-app payment, push notifications, order tracking. Stripe, Shopify, WooCommerce integrations.' },
        { title: 'Booking app', desc: 'Appointment scheduling, real-time calendar, automatic confirmation. Ideal for hotels, restaurants, practitioners.' },
        { title: 'B2B / business app', desc: 'Internal tools, mobile CRM, fleet management, field reporting. Offline sync included.' },
        { title: 'Progressive Web App (PWA)', desc: 'Cost-effective native alternative: runs in browser, installable, push notifications. Zero store fees.' },
      ],
    },
    process: {
      h2: 'Our mobile app development process',
      subtitle: 'From idea to App Store and Google Play, in 8 to 16 weeks.',
      steps: [
        { title: '1. Audit & scoping', desc: 'Market analysis, MVP definition, stack choice (native vs cross-platform) based on your budget and constraints.' },
        { title: '2. UX/UI design', desc: 'Figma mockups, clickable prototype, iOS Human Interface and Material Design guidelines compliance.' },
        { title: '3. Development', desc: 'Bi-weekly sprints with demos, GitHub-versioned code, automated tests, secure backend API.' },
        { title: '4. Testing & release', desc: 'TestFlight + Play Console beta, fixes, store submission, 3 months post-launch support included.' },
      ],
    },
    pricing: {
      h2: 'Mobile app development pricing',
      subtitle: 'Transparent packages, no surprises. Detailed quote within 24h.',
      packs: [
        { name: 'Mobile MVP', price: 'From €8,900', delay: '3 to 4 weeks', features: ['Cross-platform app (React Native)', '3 to 5 core screens', 'Auth + 1 API integration', 'Store publication included', '1 month support'] },
        { name: 'Standard App', price: 'From €15,900', delay: '6 to 10 weeks', features: ['iOS + Android (native or Flutter)', '10 to 15 screens', 'Custom backend + admin', 'Push notifications, analytics', '3 months support'], highlighted: true },
        { name: 'Premium App', price: 'Custom quote', delay: '12+ weeks', features: ['Advanced features (AI, real-time)', 'Custom design animations', 'Scalable architecture', '24/7 SLA', 'Continuous evolution'] },
      ],
      note: 'Indicative pricing, VAT included. Backend hosting, Apple Developer ($99/yr) and Google Play ($25) fees not included.',
    },
    useCases: {
      h2: 'Real-world use cases',
      subtitle: 'How our clients use a mobile app to validate, retain and grow their business.',
      items: [
        { sector: 'FoodTech startup', context: 'Raising funds means proving traction. A website alone can\'t validate mobile usage.', solution: 'React Native MVP (5 screens): ordering, Stripe payment, real-time delivery tracking, App Store + Play Store publication.', result: 'Hypothesis validated in 6 weeks instead of 6 months · 22% D+30 retention (vs 8% on web)', pack: 'Mobile MVP' },
        { sector: 'Restaurant chain (15 sites)', context: 'Paper loyalty program, phone-only orders, no usable customer data.', solution: 'iOS + Android app (15 screens): menu, ordering, loyalty, Apple/Google Pay, backend + push notifications.', result: 'Takeaway orders ×4 · visit frequency +62% · 15,000 customer profiles collected', pack: 'Standard App' },
        { sector: 'E-commerce / retail SMB', context: 'Slow mobile site, abandoned carts, no notification to re-engage customers.', solution: 'Native app with catalog + in-app payment + push notifications + order tracking, Shopify/WooCommerce sync.', result: 'Engagement ×3 thanks to push · average basket +20% via in-app upsell', pack: 'Standard App' },
        { sector: 'B2B / field SaaS', context: 'Mobile teams with no suitable tool, re-entry at the office, field data lost.', solution: 'Scalable business app with offline sync, real-time updates and a custom admin dashboard.', result: 'Real-time field reporting · zero re-entry · decisions driven by reliable data', pack: 'Premium App' },
      ],
    },
    faq: {
      h2: 'Mobile app development FAQ',
      items: [
        { q: 'How much does mobile app development cost?', a: 'An MVP starts at €8,900 cross-platform — well below the €11,000 to €25,000 typically seen on the French market in 2026. A standard iOS + Android app costs between €15,900 and €30,000 depending on complexity. A premium app with AI or real-time features can exceed €50,000.' },
        { q: 'How long does it take to build a mobile app?', a: 'Count 6-8 weeks for an MVP, 12-16 weeks for a full iOS + Android app with backend. We deliver in 2-week sprints so you see progress continuously.' },
        { q: 'Cross-platform (React Native/Flutter) or native (Swift/Kotlin)?', a: 'Cross-platform for a fast MVP and tight budget (single team). Native if you need premium experience, high graphics performance, or deep OS integration (Apple Watch, iOS widgets, etc.).' },
        { q: 'Do you handle App Store and Google Play submission?', a: 'Yes, included in all packs. We set up developer accounts if needed, prepare screenshots and descriptions, and handle submission plus any feedback from Apple or Google.' },
        { q: 'Do you work with international clients?', a: 'Yes. Team based in France but we work with clients worldwide. Remote-first with weekly video syncs, and we travel for kickoffs and major milestones.' },
      ],
    },
    cta: {
      h2: 'Ready to launch your mobile app?',
      subtitle: 'Free quote within 24h. No commitment.',
      button: 'Request a quote',
    },
  },
  es: {
    hero: {
      h1: 'Desarrollo de Aplicaciones Móviles',
      highlight: 'iOS y Android',
      subtitle: 'Desarrollo de apps móviles a medida para startups y pymes. Nativas y multiplataforma: React Native, Flutter, Swift, Kotlin. Basados en Francia, clientes en toda Europa.',
      ctaPrimary: 'Solicitar presupuesto gratis',
      ctaSecondary: 'Ver precios',
    },
    tech: {
      h2: 'Tecnologías móviles que dominamos',
      subtitle: 'De PWA a apps nativas, elegimos el stack adaptado a tu presupuesto y a tus usuarios.',
      cards: [
        { name: 'React Native', tag: 'Multiplataforma', desc: 'Un único código para iOS y Android. Ideal para validar un MVP rápido.' },
        { name: 'Flutter', tag: 'Rendimiento', desc: 'Interfaz fluida a 60fps, framework respaldado por Google. Recomendado para apps gráficas.' },
        { name: 'Swift (iOS nativo)', tag: 'Apple', desc: 'Experiencia premium, acceso completo a APIs iOS, publicación optimizada en App Store.' },
        { name: 'Kotlin (Android nativo)', tag: 'Google', desc: 'Rendimiento nativo Android, integración Material Design, publicación en Play Store.' },
      ],
    },
    types: {
      h2: '¿Qué tipo de aplicación móvil?',
      subtitle: 'Desarrollamos apps adaptadas a tu sector y objetivos de negocio.',
      cards: [
        { title: 'App de e-commerce móvil', desc: 'Catálogo, pago in-app, notificaciones push, seguimiento de pedidos. Integración Stripe, Shopify, WooCommerce.' },
        { title: 'App de reservas', desc: 'Citas en línea, calendario en tiempo real, confirmación automática. Ideal para hoteles, restaurantes, profesionales.' },
        { title: 'App B2B / empresarial', desc: 'Herramientas internas, CRM móvil, gestión de flotas, reportes de campo. Sincronización offline incluida.' },
        { title: 'Progressive Web App (PWA)', desc: 'Alternativa económica a la app nativa: funciona en el navegador, instalable, push. Sin comisiones de store.' },
      ],
    },
    process: {
      h2: 'Nuestro proceso de creación de apps móviles',
      subtitle: 'De la idea a la publicación en App Store y Google Play, en 8 a 16 semanas.',
      steps: [
        { title: '1. Auditoría y alcance', desc: 'Análisis de mercado, definición del MVP, elección del stack según presupuesto y restricciones.' },
        { title: '2. Diseño UX/UI', desc: 'Mockups en Figma, prototipo clicable, cumplimiento de guías iOS Human Interface y Material Design.' },
        { title: '3. Desarrollo', desc: 'Sprints quincenales con demo, código versionado en GitHub, tests automáticos, backend API seguro.' },
        { title: '4. Testing y publicación', desc: 'Beta TestFlight + Play Console, correcciones, envío a stores, soporte post-lanzamiento 3 meses incluido.' },
      ],
    },
    pricing: {
      h2: 'Precios desarrollo aplicación móvil',
      subtitle: 'Paquetes transparentes, sin sorpresas. Presupuesto detallado en 24h.',
      packs: [
        { name: 'MVP Móvil', price: 'Desde 8 900€', delay: '3 a 4 semanas', features: ['App multiplataforma (React Native)', '3 a 5 pantallas clave', 'Autenticación + 1 integración API', 'Publicación en stores incluida', 'Soporte 1 mes'] },
        { name: 'App Estándar', price: 'Desde 15 900€', delay: '6 a 10 semanas', features: ['iOS + Android (nativo o Flutter)', '10 a 15 pantallas', 'Backend a medida + admin', 'Push, analytics', 'Soporte 3 meses'], highlighted: true },
        { name: 'App Premium', price: 'Presupuesto a medida', delay: '12 semanas y +', features: ['Funciones avanzadas (IA, tiempo real)', 'Animaciones custom', 'Arquitectura escalable', 'SLA 24/7', 'Evoluciones continuas'] },
      ],
      note: 'Precios indicativos IVA incluido. Hosting backend, cuenta Apple Developer (99$/año) y Google Play (25$) no incluidos.',
    },
    useCases: {
      h2: 'Casos de uso concretos',
      subtitle: 'Cómo nuestros clientes usan una app móvil para validar, fidelizar y hacer crecer su negocio.',
      items: [
        { sector: 'Startup FoodTech', context: 'Levantar fondos exige demostrar tracción. Una web no basta para validar el uso móvil.', solution: 'MVP React Native (5 pantallas): pedido, pago Stripe, seguimiento de entrega en tiempo real, publicación App Store + Play Store.', result: 'Hipótesis validada en 6 semanas en lugar de 6 meses · retención D+30 del 22% (vs 8% en web)', pack: 'MVP Móvil' },
        { sector: 'Cadena de restaurantes (15 sedes)', context: 'Programa de fidelidad en papel, pedidos solo por teléfono, sin datos de cliente aprovechables.', solution: 'App iOS + Android (15 pantallas): menú, pedido, fidelidad, pago Apple/Google Pay, backend + notificaciones push.', result: 'Pedidos para llevar ×4 · frecuencia de visita +62% · 15 000 perfiles de cliente recopilados', pack: 'App Estándar' },
        { sector: 'Pyme e-commerce / retail', context: 'Web móvil lenta, carrito abandonado, sin notificaciones para reactivar clientes.', solution: 'App nativa con catálogo + pago in-app + notificaciones push + seguimiento de pedido, sincronización Shopify/WooCommerce.', result: 'Engagement ×3 gracias a las push · cesta media +20% vía upsell in-app', pack: 'App Estándar' },
        { sector: 'B2B / SaaS de campo', context: 'Equipos móviles sin herramienta adecuada, reintroducción en oficina, datos de campo perdidos.', solution: 'App empresarial escalable con sincronización offline, tiempo real y panel admin a medida.', result: 'Reporte de campo en tiempo real · cero reintroducción · decisiones basadas en datos fiables', pack: 'App Premium' },
      ],
    },
    faq: {
      h2: 'Preguntas frecuentes sobre desarrollo móvil',
      items: [
        { q: '¿Cuánto cuesta desarrollar una app móvil?', a: 'Un MVP empieza en 8 900€ en multiplataforma — muy por debajo de los 11 000€ a 25 000€ habituales en el mercado francés en 2026. Una app estándar iOS + Android cuesta entre 15 900€ y 30 000€ según complejidad. Una app premium con IA o tiempo real puede superar 50 000€.' },
        { q: '¿Cuánto tiempo lleva crear una app móvil?', a: 'Cuenta 6 a 8 semanas para un MVP, 12 a 16 semanas para una app completa iOS + Android con backend. Entregamos por sprints de 2 semanas.' },
        { q: '¿Multiplataforma (React Native/Flutter) o nativo (Swift/Kotlin)?', a: 'Multiplataforma para un MVP rápido y presupuesto ajustado (un solo equipo). Nativo si buscas experiencia premium, rendimiento gráfico alto o integración profunda con el sistema.' },
        { q: '¿Gestionáis la publicación en App Store y Google Play?', a: 'Sí, incluido en todos nuestros paquetes. Creamos las cuentas de desarrollador si hace falta, preparamos capturas, descripciones y gestionamos el envío.' },
        { q: '¿Trabajáis con clientes internacionales?', a: 'Sí. Equipo basado en Francia pero clientes en toda Europa. Trabajamos en remoto con puntos semanales por video, y viajamos para kickoffs y hitos clave.' },
      ],
    },
    cta: {
      h2: '¿Listo para lanzar tu app móvil?',
      subtitle: 'Presupuesto gratis en 24h. Sin compromiso.',
      button: 'Solicitar presupuesto',
    },
  },
};

const techIcons = [Code2, Zap, Apple, Smartphone];
const typeIcons = [ShoppingBag, Calendar, Briefcase, Globe];
const processIcons = [Search, Palette, Wrench, Upload];

// Délais d'apparition échelonnés pour les grilles de cartes (reveal au scroll)
const DELAY_CLASSES = ['', 'delay-100', 'delay-200', 'delay-300', 'delay-400', 'delay-500'];

export function MobileAppDevClient({ lang }: Props) {
  const c = content[lang];
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Animations au scroll (GSAP ScrollTrigger) + parallaxe — voir useGsapReveal
  const containerRef = useRef<HTMLElement>(null);
  useGsapReveal(containerRef, [lang]);

  return (
    <>
      <Header />
      <main ref={containerRef} id="main-content" className="min-h-screen bg-[#050510] pt-24">
        <section className="py-16 sm:py-24 px-4 relative overflow-hidden" style={{ background: '#070F26' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/5 to-white/5 pointer-events-none" aria-hidden="true" />
          <div className="max-w-5xl mx-auto text-center relative">
            <div className="animate-on-scroll fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 mb-8">
              <Smartphone className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Mobile App Development</span>
            </div>
            <h1 className="animate-on-scroll fade-up delay-100 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
              {c.hero.h1}{' '}
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {c.hero.highlight}
              </span>
            </h1>
            <p className="animate-on-scroll fade-up delay-200 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10">
              {c.hero.subtitle}
            </p>
            <div className="animate-on-scroll fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center">
              <LocalizedLink
                href="/booking"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-gray-900 font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all"
              >
                {c.hero.ctaPrimary}
                <ArrowRight className="w-5 h-5" />
              </LocalizedLink>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white/40 text-white font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                {c.hero.ctaSecondary}
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 px-4" style={{ background: '#F7FAFD' }}>
          <div className="max-w-6xl mx-auto">
            <div className="animate-on-scroll fade-up text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0e1b3d] mb-4">
                {c.tech.h2}
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                {c.tech.subtitle}
              </p>
            </div>
            <div className="animate-on-scroll fade-up delay-100">
            <ResponsiveCards breakpoint="sm" gridClass="grid-cols-2 lg:grid-cols-4" gridGap="gap-6">
              {c.tech.cards.map((card, i) => {
                const Icon = techIcons[i % techIcons.length]!;
                return (
                  <article
                    key={card.name}
                    className="p-6 rounded-2xl border border-slate-200 shadow-sm bg-white hover:border-gray-300 transition-colors h-full"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                    </div>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                      {card.tag}
                    </div>
                    <h3 className="text-xl font-bold text-[#0e1b3d] mb-2">
                      {card.name}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {card.desc}
                    </p>
                  </article>
                );
              })}
            </ResponsiveCards>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 px-4" style={{ background: '#070F26' }}>
          <div className="max-w-6xl mx-auto">
            <div className="animate-on-scroll fade-up text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {c.types.h2}
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                {c.types.subtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {c.types.cards.map((card, i) => {
                const Icon = typeIcons[i % typeIcons.length]!;
                return (
                  <article
                    key={card.title}
                    className={`animate-on-scroll fade-up ${DELAY_CLASSES[Math.min(i, 5)]} p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-gray-300 transition-colors`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                        <Icon className="w-6 h-6 text-gray-900" strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {card.title}
                        </h3>
                        <p className="text-slate-300 leading-relaxed">
                          {card.desc}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 px-4" style={{ background: '#F7FAFD' }}>
          <div className="max-w-5xl mx-auto">
            <div className="animate-on-scroll fade-up text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0e1b3d] mb-4">
                {c.process.h2}
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                {c.process.subtitle}
              </p>
            </div>
            <div className="animate-on-scroll fade-up delay-100">
            <ResponsiveCards breakpoint="sm" gridClass="grid-cols-2 lg:grid-cols-4" gridGap="gap-6">
              {c.process.steps.map((step, i) => {
                const Icon = processIcons[i % processIcons.length]!;
                return (
                  <article
                    key={step.title}
                    className="p-6 rounded-2xl border border-slate-200 shadow-sm bg-white h-full"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                    </div>
                    <h3 className="text-lg font-bold text-[#0e1b3d] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {step.desc}
                    </p>
                  </article>
                );
              })}
            </ResponsiveCards>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-16 sm:py-20 px-4" style={{ background: '#070F26' }}>
          <div className="max-w-6xl mx-auto">
            <div className="animate-on-scroll fade-up text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {c.pricing.h2}
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                {c.pricing.subtitle}
              </p>
            </div>
            <div className="animate-on-scroll fade-up delay-100 mb-6">
              <ResponsiveCards breakpoint="md" gridClass="grid-cols-3" gridGap="gap-6">
                {c.pricing.packs.map((pack) => (
                  <article
                    key={pack.name}
                    className={`p-8 rounded-3xl border-2 h-full ${
                      pack.highlighted
                        ? 'border-white bg-white text-gray-900'
                        : 'border-white/20 bg-white/5'
                    }`}
                  >
                    <h3 className={`text-2xl font-bold mb-2 ${pack.highlighted ? 'text-gray-900' : 'text-white'}`}>
                      {pack.name}
                    </h3>
                    <div className={`text-3xl font-black mb-2 ${pack.highlighted ? 'text-gray-900' : 'text-white'}`}>
                      {pack.price}
                    </div>
                    <div className={`flex items-center gap-1.5 text-sm mb-6 ${pack.highlighted ? 'text-gray-900/70' : 'text-slate-400'}`}>
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{pack.delay}</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {pack.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${pack.highlighted ? 'text-gray-900' : 'text-emerald-400'}`} />
                          <span className={pack.highlighted ? 'text-gray-900/90' : 'text-slate-300'}>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <LocalizedLink
                      href="/booking"
                      className={`block w-full text-center px-6 py-3 rounded-full font-semibold transition-colors ${
                        pack.highlighted
                          ? 'bg-gray-900 text-white hover:bg-gray-800'
                          : 'bg-white/10 border border-white/30 text-white hover:bg-white/20'
                      }`}
                    >
                      {c.cta.button}
                    </LocalizedLink>
                  </article>
                ))}
              </ResponsiveCards>
            </div>
            <p className="animate-on-scroll fade-up delay-200 text-sm text-slate-400 text-center">{c.pricing.note}</p>
          </div>
        </section>

        <section className="py-16 sm:py-20 px-4" style={{ background: '#0B1430' }}>
          <div className="max-w-6xl mx-auto">
            <div className="animate-on-scroll fade-up text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {c.useCases.h2}
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                {c.useCases.subtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {c.useCases.items.map((uc, i) => (
                <article key={uc.sector} className={`animate-on-scroll fade-up ${DELAY_CLASSES[Math.min(i, 5)]} p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 h-full flex flex-col`}>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h3 className="text-lg font-bold text-white">{uc.sector}</h3>
                    <span className="text-xs bg-white/10 text-white px-3 py-1 rounded-full font-medium whitespace-nowrap">{uc.pack}</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-3 leading-relaxed">{uc.context}</p>
                  <p className="text-sm text-slate-200 mb-4 leading-relaxed">{uc.solution}</p>
                  <div className="mt-auto flex items-start gap-2 rounded-xl bg-emerald-400/10 border border-emerald-400/20 p-3">
                    <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-emerald-300">{uc.result}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 px-4" style={{ background: '#F7FAFD' }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="animate-on-scroll fade-up text-3xl sm:text-4xl font-bold text-[#0e1b3d] text-center mb-12">
              {c.faq.h2}
            </h2>
            <div className="animate-on-scroll fade-up delay-100 space-y-4">
              {c.faq.items.map((item, i) => (
                <article key={item.q} className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-slate-50 transition-colors"
                    aria-expanded={openFaq === i}
                  >
                    <h3 className="text-base sm:text-lg font-semibold text-[#0e1b3d]">
                      {item.q}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 text-slate-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 px-4" style={{ background: '#070F26' }}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="animate-on-scroll fade-up text-3xl sm:text-4xl font-bold text-white mb-4">
              {c.cta.h2}
            </h2>
            <p className="animate-on-scroll fade-up delay-100 text-lg text-slate-300 mb-8">
              {c.cta.subtitle}
            </p>
            <div className="animate-on-scroll fade-up delay-200">
            <LocalizedLink
              href="/booking"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-gray-900 font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-gray-100 transform hover:scale-105 transition-all"
            >
              {c.cta.button}
              <ArrowRight className="w-5 h-5" />
            </LocalizedLink>
            </div>
          </div>
        </section>
        <DemoCTA sector="mobile" />
      </main>
      <Footer />
    </>
  );
}
