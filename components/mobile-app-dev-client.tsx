'use client';

import React, { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LocalizedLink } from '@/components/localized-link';
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
  pricing: { h2: string; subtitle: string; packs: { name: string; price: string; features: string[]; highlighted?: boolean }[]; note: string };
  faq: { h2: string; items: { q: string; a: string }[] };
  cta: { h2: string; subtitle: string; button: string };
}> = {
  fr: {
    hero: {
      h1: 'Développement d\'Applications Mobiles',
      highlight: 'iOS & Android',
      subtitle: 'Création d\'applications mobiles natives et cross-platform pour startups et PME. React Native, Flutter, Swift, Kotlin. Paris, Lille et partout en France.',
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
        { name: 'MVP Mobile', price: 'À partir de 6 900€', features: ['App cross-platform (React Native)', '3 à 5 écrans clés', 'Authentification + 1 intégration API', 'Publication stores incluse', 'Support 1 mois'] },
        { name: 'App Standard', price: 'À partir de 12 900€', features: ['iOS + Android (natif ou Flutter)', '10 à 15 écrans', 'Backend sur mesure + admin', 'Notifications push, analytics', 'Support 3 mois'], highlighted: true },
        { name: 'App Premium', price: 'Sur devis', features: ['Features avancées (IA, temps réel)', 'Design custom animations', 'Architecture scalable', 'SLA 24/7', 'Évolutions continues'] },
      ],
      note: 'Tarifs indicatifs TTC. Hébergement backend, frais développeur Apple (99$/an) et Google Play (25$) non inclus.',
    },
    faq: {
      h2: 'Questions fréquentes sur le développement mobile',
      items: [
        { q: 'Combien coûte le développement d\'une application mobile en France ?', a: 'Un MVP démarre à 6 900€ en cross-platform. Une app standard iOS + Android coûte entre 12 000€ et 30 000€ selon la complexité. Une app premium avec IA ou temps réel peut dépasser 50 000€.' },
        { q: 'Combien de temps pour créer une app mobile ?', a: 'Comptez 6 à 8 semaines pour un MVP, 12 à 16 semaines pour une app complète iOS + Android avec backend. Nous livrons par sprints de 2 semaines pour que vous voyiez l\'avancement.' },
        { q: 'Cross-platform (React Native/Flutter) ou natif (Swift/Kotlin) ?', a: 'Cross-platform pour un MVP rapide et un budget serré (une seule équipe). Natif si vous visez une expérience premium, des performances graphiques élevées ou une intégration profonde avec le système (Apple Watch, widgets iOS, etc.).' },
        { q: 'Gérez-vous la publication sur l\'App Store et Google Play ?', a: 'Oui, inclus dans tous nos packs. Nous créons les comptes développeurs si besoin, préparons les captures, descriptions, et gérons la soumission + les éventuels retours d\'Apple ou Google.' },
        { q: 'Intervenez-vous à Lille, Lyon, Marseille ?', a: 'Oui. Équipe basée à Paris mais clients partout en France. Nous travaillons en remote avec points hebdomadaires visio, et nous déplaçons pour les kick-offs et jalons majeurs.' },
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
        { name: 'Mobile MVP', price: 'From €6,900', features: ['Cross-platform app (React Native)', '3 to 5 core screens', 'Auth + 1 API integration', 'Store publication included', '1 month support'] },
        { name: 'Standard App', price: 'From €12,900', features: ['iOS + Android (native or Flutter)', '10 to 15 screens', 'Custom backend + admin', 'Push notifications, analytics', '3 months support'], highlighted: true },
        { name: 'Premium App', price: 'Custom quote', features: ['Advanced features (AI, real-time)', 'Custom design animations', 'Scalable architecture', '24/7 SLA', 'Continuous evolution'] },
      ],
      note: 'Indicative pricing, VAT included. Backend hosting, Apple Developer ($99/yr) and Google Play ($25) fees not included.',
    },
    faq: {
      h2: 'Mobile app development FAQ',
      items: [
        { q: 'How much does mobile app development cost?', a: 'An MVP starts at €6,900 cross-platform. A standard iOS + Android app costs between €12,000 and €30,000 depending on complexity. A premium app with AI or real-time features can exceed €50,000.' },
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
        { name: 'MVP Móvil', price: 'Desde 6 900€', features: ['App multiplataforma (React Native)', '3 a 5 pantallas clave', 'Autenticación + 1 integración API', 'Publicación en stores incluida', 'Soporte 1 mes'] },
        { name: 'App Estándar', price: 'Desde 12 900€', features: ['iOS + Android (nativo o Flutter)', '10 a 15 pantallas', 'Backend a medida + admin', 'Push, analytics', 'Soporte 3 meses'], highlighted: true },
        { name: 'App Premium', price: 'Presupuesto a medida', features: ['Funciones avanzadas (IA, tiempo real)', 'Animaciones custom', 'Arquitectura escalable', 'SLA 24/7', 'Evoluciones continuas'] },
      ],
      note: 'Precios indicativos IVA incluido. Hosting backend, cuenta Apple Developer (99$/año) y Google Play (25$) no incluidos.',
    },
    faq: {
      h2: 'Preguntas frecuentes sobre desarrollo móvil',
      items: [
        { q: '¿Cuánto cuesta desarrollar una app móvil?', a: 'Un MVP empieza en 6 900€ en multiplataforma. Una app estándar iOS + Android cuesta entre 12 000€ y 30 000€ según complejidad. Una app premium con IA o tiempo real puede superar 50 000€.' },
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

export function MobileAppDevClient({ lang }: Props) {
  const c = content[lang];
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-[#050510] pt-24">
        <section className="py-16 sm:py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#5db8f0]/10 via-[#22d3ee]/10 to-[#22d3ee]/5 pointer-events-none" aria-hidden="true" />
          <div className="max-w-5xl mx-auto text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 mb-8">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">Mobile App Development</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
              {c.hero.h1}{' '}
              <span className="bg-gradient-to-r from-[#5db8f0] to-[#22d3ee] bg-clip-text text-transparent">
                {c.hero.highlight}
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10">
              {c.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LocalizedLink
                href="/booking"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#5db8f0] to-[#22d3ee] text-[#050510] font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                {c.hero.ctaPrimary}
                <ArrowRight className="w-5 h-5" />
              </LocalizedLink>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-[#22d3ee]/40 text-[#22d3ee] font-semibold text-lg hover:bg-[#22d3ee]/10 transition-colors"
              >
                {c.hero.ctaSecondary}
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {c.tech.h2}
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                {c.tech.subtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {c.tech.cards.map((card, i) => {
                const Icon = techIcons[i % techIcons.length]!;
                return (
                  <article
                    key={card.name}
                    className="p-6 rounded-2xl border border-white/10 bg-[#0e1b3d]/30 hover:border-[#5db8f0]/30 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#5db8f0] to-[#22d3ee] flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#050510]" strokeWidth={2} />
                    </div>
                    <div className="text-xs font-semibold text-[#22d3ee] uppercase tracking-wider mb-2">
                      {card.tag}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {card.name}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {card.desc}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 px-4 bg-[#0e1b3d]/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
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
                    className="p-8 rounded-2xl bg-[#0e1b3d]/40 border border-white/10 hover:border-[#5db8f0]/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-[#5db8f0] to-[#22d3ee] flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[#050510]" strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {card.title}
                        </h3>
                        <p className="text-slate-400 leading-relaxed">
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

        <section className="py-16 sm:py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {c.process.h2}
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                {c.process.subtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {c.process.steps.map((step, i) => {
                const Icon = processIcons[i % processIcons.length]!;
                return (
                  <article
                    key={step.title}
                    className="p-6 rounded-2xl border border-white/10 bg-[#0e1b3d]/30"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#5db8f0] to-[#22d3ee] flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#050510]" strokeWidth={2} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-16 sm:py-20 px-4 bg-[#0e1b3d]/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {c.pricing.h2}
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                {c.pricing.subtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {c.pricing.packs.map((pack) => (
                <article
                  key={pack.name}
                  className={`p-8 rounded-3xl border-2 ${
                    pack.highlighted
                      ? 'border-[#5db8f0] bg-gradient-to-r from-[#5db8f0] to-[#22d3ee] text-[#050510]'
                      : 'border-white/10 bg-[#0e1b3d]/40'
                  }`}
                >
                  <h3 className={`text-2xl font-bold mb-2 ${pack.highlighted ? 'text-[#050510]' : 'text-white'}`}>
                    {pack.name}
                  </h3>
                  <div className={`text-3xl font-black mb-6 ${pack.highlighted ? 'text-[#050510]' : 'text-[#5db8f0]'}`}>
                    {pack.price}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {pack.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${pack.highlighted ? 'text-[#050510]' : 'text-emerald-400'}`} />
                        <span className={pack.highlighted ? 'text-[#050510]/90' : 'text-slate-300'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <LocalizedLink
                    href="/booking"
                    className={`block w-full text-center px-6 py-3 rounded-full font-semibold transition-colors ${
                      pack.highlighted
                        ? 'bg-[#050510] text-[#22d3ee] hover:bg-[#070f26]'
                        : 'bg-gradient-to-r from-[#5db8f0] to-[#22d3ee] text-[#050510] hover:opacity-90'
                    }`}
                  >
                    {c.cta.button}
                  </LocalizedLink>
                </article>
              ))}
            </div>
            <p className="text-sm text-slate-400 text-center">{c.pricing.note}</p>
          </div>
        </section>

        <section className="py-16 sm:py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
              {c.faq.h2}
            </h2>
            <div className="space-y-4">
              {c.faq.items.map((item, i) => (
                <article key={item.q} className="border border-white/10 rounded-2xl overflow-hidden bg-[#0e1b3d]/30">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-[#0e1b3d]/40 transition-colors"
                    aria-expanded={openFaq === i}
                  >
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      {item.q}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-slate-300 leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 px-4 bg-[#070f26]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {c.cta.h2}
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              {c.cta.subtitle}
            </p>
            <LocalizedLink
              href="/booking"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#5db8f0] to-[#22d3ee] text-[#050510] font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              {c.cta.button}
              <ArrowRight className="w-5 h-5" />
            </LocalizedLink>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
