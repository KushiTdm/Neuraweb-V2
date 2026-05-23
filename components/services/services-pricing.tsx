'use client';

import { useEffect, useRef, useState, forwardRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from '@/lib/gsap-setup';
import { useLanguage } from '@/contexts/language-context';
import { useAnalytics } from '@/hooks/use-analytics';
import {
  X, ChevronRight, Sparkles, Zap, Shield, HeadphonesIcon, Globe,
  Rocket, Code, Database, Settings, TrendingUp, Users, MessageSquare,
  ShoppingCart, Mail, Search, Server, Clock, MessageCircle, Layout,
  BarChart3, Star, ArrowRight, Bot, BookOpen,
} from 'lucide-react';
import { LocalizedLink } from '@/components/localized-link';
import { CardsCarousel } from '@/components/ui/cards-carousel';

interface ServicesPricingProps {
  language?: 'fr' | 'en' | 'es';
}

interface Pack {
  id: string;
  lucideIcon: React.ElementType;
  gradient: string;
  popular?: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Code, Search, Globe, Shield, HeadphonesIcon, Zap, Settings,
  TrendingUp, Users, MessageSquare, ShoppingCart, Mail, Server,
  Bot, Database, Rocket, Clock, Sparkles, MessageCircle,
};

// Liens croisés par pack (article blog + service complémentaire)
const CROSS_LINKS = {
  starter: {
    fr: [
      { label: 'Next.js vs WordPress : quel choix pour votre site ?', href: '/blog/nextjs-vs-wordpress-2025', type: 'article' as const },
      { label: 'Ajouter un chatbot IA à votre vitrine', href: '/integration-ia', type: 'service' as const },
    ],
    en: [
      { label: 'Next.js vs WordPress: which one for your site?', href: '/blog/nextjs-vs-wordpress-2025', type: 'article' as const },
      { label: 'Add an AI chatbot to your showcase site', href: '/integration-ia', type: 'service' as const },
    ],
    es: [
      { label: 'Next.js vs WordPress: ¿cuál elegir para tu web?', href: '/blog/nextjs-vs-wordpress-2025', type: 'article' as const },
      { label: 'Añade un chatbot IA a tu sitio vitrina', href: '/integration-ia', type: 'service' as const },
    ],
  },
  business: {
    fr: [
      { label: 'Comment intégrer l\'IA dans un site web en 2025', href: '/blog/integrer-ia-site-web-2025', type: 'article' as const },
      { label: 'Automatiser vos process métier', href: '/automatisation', type: 'service' as const },
    ],
    en: [
      { label: 'How to integrate AI into a website in 2025', href: '/blog/integrer-ia-site-web-2025', type: 'article' as const },
      { label: 'Automate your business processes', href: '/automatisation', type: 'service' as const },
    ],
    es: [
      { label: 'Cómo integrar IA en un sitio web en 2025', href: '/blog/integrer-ia-site-web-2025', type: 'article' as const },
      { label: 'Automatiza tus procesos de negocio', href: '/automatisation', type: 'service' as const },
    ],
  },
  premium: {
    fr: [
      { label: 'Intégration IA pour e-commerce & API', href: '/integration-ia', type: 'service' as const },
      { label: 'Automatisation n8n & Make pour PME', href: '/automatisation', type: 'service' as const },
    ],
    en: [
      { label: 'AI integration for e-commerce & APIs', href: '/integration-ia', type: 'service' as const },
      { label: 'n8n & Make automation for SMBs', href: '/automatisation', type: 'service' as const },
    ],
    es: [
      { label: 'Integración IA para e-commerce y APIs', href: '/integration-ia', type: 'service' as const },
      { label: 'Automatización n8n & Make para pymes', href: '/automatisation', type: 'service' as const },
    ],
  },
};

const PRICING_TRANSLATIONS = {
  fr: {
    title: 'Nos Packs Web',
    priceLabel: 'À partir de',
    vat: 'TVA non applicable',
    clickDetails: 'Cliquer pour voir les détails',
    deadline: 'Délai de livraison',
    choosePack: 'Choisir ce pack',
    cta: 'Devis personnalisé',
    chatbot: 'Chatbot IA',
    chatbotDesc: 'Réponses immédiates',
    highlight: 'Sur mesure',
    crossLinksTitle: 'Pour aller plus loin',
    crossLinkArticle: 'Article',
    crossLinkService: 'Service',
    otherServicesTitle: 'Nos autres services',
    otherServicesDesc: 'IA et automatisation pour aller encore plus loin.',
    packs: {
      starter: {
        title: 'Pack Starter',
        subtitle: 'Votre vitrine sur le web',
        description: 'Idéal pour les entrepreneurs et indépendants qui veulent une présence en ligne professionnelle, rapide et bien référencée.',
        features: [
          { icon: 'Globe', text: 'Site vitrine jusqu\'à 8 pages' },
          { icon: 'Code', text: 'Design responsive moderne' },
          { icon: 'Search', text: 'SEO technique inclus' },
          { icon: 'Mail', text: 'Formulaire de contact' },
          { icon: 'Server', text: 'Hébergement 1 an' },
          { icon: 'TrendingUp', text: 'Analytics Google' },
        ],
        support: 'Support email',
        price: '1 490€',
        delay: '2–3 semaines',
      },
      business: {
        title: 'Pack Business',
        subtitle: 'Votre plateforme de croissance',
        description: 'Pour les PME et startups qui veulent un site professionnel complet, avec blog, espace client et outils de conversion.',
        features: [
          { icon: 'Globe', text: 'Site jusqu\'à 20 pages' },
          { icon: 'Code', text: 'Design sur-mesure Figma' },
          { icon: 'Users', text: 'Espace client intégré' },
          { icon: 'MessageSquare', text: 'Blog + CMS léger' },
          { icon: 'TrendingUp', text: 'Analytics avancés' },
          { icon: 'HeadphonesIcon', text: 'Support prioritaire' },
          { icon: 'Search', text: 'SEO on-page complet' },
        ],
        support: 'Support prioritaire',
        price: '3 990€',
        delay: '4–6 semaines',
      },
      premium: {
        title: 'Pack Premium',
        subtitle: 'Solution complète & évolutive',
        description: 'Pour les entreprises ambitieuses : e-commerce, intégrations API tierces, sécurité renforcée et performance maximale.',
        features: [
          { icon: 'Globe', text: 'Pages illimitées' },
          { icon: 'ShoppingCart', text: 'E-commerce complet' },
          { icon: 'Settings', text: 'Intégrations API tierces' },
          { icon: 'Shield', text: 'Sécurité avancée' },
          { icon: 'Zap', text: 'Performance Core Web Vitals 90+' },
          { icon: 'HeadphonesIcon', text: 'Support dédié 24/7' },
          { icon: 'TrendingUp', text: 'Reporting & A/B testing' },
        ],
        support: 'Support dédié 24/7',
        price: '7 990€',
        delay: '6–8 semaines',
      },
    },
  },
  en: {
    title: 'Our Web Packages',
    priceLabel: 'Starting at',
    vat: 'VAT not applicable',
    clickDetails: 'Click to see details',
    deadline: 'Delivery time',
    choosePack: 'Choose this pack',
    cta: 'Custom quote',
    chatbot: 'AI Chatbot',
    chatbotDesc: 'Immediate answers',
    highlight: 'Custom-made',
    crossLinksTitle: 'Go further',
    crossLinkArticle: 'Article',
    crossLinkService: 'Service',
    otherServicesTitle: 'Our other services',
    otherServicesDesc: 'AI and automation to go even further.',
    packs: {
      starter: {
        title: 'Starter Pack',
        subtitle: 'Your showcase on the web',
        description: 'Perfect for entrepreneurs and freelancers who want a professional, fast and well-indexed online presence.',
        features: [
          { icon: 'Globe', text: 'Showcase site up to 8 pages' },
          { icon: 'Code', text: 'Modern responsive design' },
          { icon: 'Search', text: 'Technical SEO included' },
          { icon: 'Mail', text: 'Contact form' },
          { icon: 'Server', text: '1-year hosting' },
          { icon: 'TrendingUp', text: 'Google Analytics' },
        ],
        support: 'Email support',
        price: '€1,490',
        delay: '2–3 weeks',
      },
      business: {
        title: 'Business Pack',
        subtitle: 'Your growth platform',
        description: 'For SMBs and startups that want a complete professional site with blog, client area and conversion tools.',
        features: [
          { icon: 'Globe', text: 'Site up to 20 pages' },
          { icon: 'Code', text: 'Custom Figma design' },
          { icon: 'Users', text: 'Integrated client area' },
          { icon: 'MessageSquare', text: 'Blog + light CMS' },
          { icon: 'TrendingUp', text: 'Advanced analytics' },
          { icon: 'HeadphonesIcon', text: 'Priority support' },
          { icon: 'Search', text: 'Full on-page SEO' },
        ],
        support: 'Priority support',
        price: '€3,990',
        delay: '4–6 weeks',
      },
      premium: {
        title: 'Premium Pack',
        subtitle: 'Complete & scalable solution',
        description: 'For ambitious companies: e-commerce, third-party API integrations, enhanced security and maximum performance.',
        features: [
          { icon: 'Globe', text: 'Unlimited pages' },
          { icon: 'ShoppingCart', text: 'Full e-commerce' },
          { icon: 'Settings', text: 'Third-party API integrations' },
          { icon: 'Shield', text: 'Advanced security' },
          { icon: 'Zap', text: 'Core Web Vitals 90+ performance' },
          { icon: 'HeadphonesIcon', text: 'Dedicated 24/7 support' },
          { icon: 'TrendingUp', text: 'Reporting & A/B testing' },
        ],
        support: 'Dedicated 24/7 support',
        price: '€7,990',
        delay: '6–8 weeks',
      },
    },
  },
  es: {
    title: 'Nuestros Paquetes Web',
    priceLabel: 'A partir de',
    vat: 'IVA no aplicable',
    clickDetails: 'Haga clic para ver detalles',
    deadline: 'Tiempo de entrega',
    choosePack: 'Elegir este pack',
    cta: 'Presupuesto personalizado',
    chatbot: 'Chatbot IA',
    chatbotDesc: 'Respuestas inmediatas',
    highlight: 'A medida',
    crossLinksTitle: 'Para ir más lejos',
    crossLinkArticle: 'Artículo',
    crossLinkService: 'Servicio',
    otherServicesTitle: 'Nuestros otros servicios',
    otherServicesDesc: 'IA y automatización para ir aún más lejos.',
    packs: {
      starter: {
        title: 'Pack Starter',
        subtitle: 'Tu vitrina en la web',
        description: 'Ideal para emprendedores y autónomos que quieren una presencia online profesional, rápida y bien posicionada.',
        features: [
          { icon: 'Globe', text: 'Sitio vitrina hasta 8 páginas' },
          { icon: 'Code', text: 'Diseño responsive moderno' },
          { icon: 'Search', text: 'SEO técnico incluido' },
          { icon: 'Mail', text: 'Formulario de contacto' },
          { icon: 'Server', text: 'Alojamiento 1 año' },
          { icon: 'TrendingUp', text: 'Google Analytics' },
        ],
        support: 'Soporte por email',
        price: '1.490€',
        delay: '2–3 semanas',
      },
      business: {
        title: 'Pack Business',
        subtitle: 'Tu plataforma de crecimiento',
        description: 'Para pymes y startups que quieren un sitio profesional completo con blog, área de clientes y herramientas de conversión.',
        features: [
          { icon: 'Globe', text: 'Sitio hasta 20 páginas' },
          { icon: 'Code', text: 'Diseño personalizado Figma' },
          { icon: 'Users', text: 'Área de cliente integrada' },
          { icon: 'MessageSquare', text: 'Blog + CMS ligero' },
          { icon: 'TrendingUp', text: 'Analytics avanzados' },
          { icon: 'HeadphonesIcon', text: 'Soporte prioritario' },
          { icon: 'Search', text: 'SEO on-page completo' },
        ],
        support: 'Soporte prioritario',
        price: '3.990€',
        delay: '4–6 semanas',
      },
      premium: {
        title: 'Pack Premium',
        subtitle: 'Solución completa y escalable',
        description: 'Para empresas ambiciosas: e-commerce, integraciones API externas, seguridad reforzada y rendimiento máximo.',
        features: [
          { icon: 'Globe', text: 'Páginas ilimitadas' },
          { icon: 'ShoppingCart', text: 'E-commerce completo' },
          { icon: 'Settings', text: 'Integraciones API externas' },
          { icon: 'Shield', text: 'Seguridad avanzada' },
          { icon: 'Zap', text: 'Rendimiento Core Web Vitals 90+' },
          { icon: 'HeadphonesIcon', text: 'Soporte dedicado 24/7' },
          { icon: 'TrendingUp', text: 'Reporting & A/B testing' },
        ],
        support: 'Soporte dedicado 24/7',
        price: '7.990€',
        delay: '6–8 semanas',
      },
    },
  },
};

export const ServicesPricing = forwardRef<HTMLDivElement, ServicesPricingProps>(
  ({ language = 'fr' }, ref) => {
  const [mounted, setMounted] = useState(false);
  const [modalPack, setModalPack] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalOpenTime = useRef<number>(0);
  const packViewTimes = useRef<Record<string, number>>({});
  const trackedPacks = useRef<Set<string>>(new Set());
  const router = useRouter();

  const { trackPackView, trackPackClick, trackPackChoose, trackPackModalClose, trackContact } = useAnalytics();

  const packs: Pack[] = [
    { id: 'starter', lucideIcon: Layout, gradient: 'from-white/40 to-white/20' },
    { id: 'business', lucideIcon: BarChart3, gradient: 'from-white to-gray-100', popular: true },
    { id: 'premium', lucideIcon: Star, gradient: 'from-white/40 to-white/20' },
  ];

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.set(card, { opacity: 0, y: 80 });
        gsap.to(card, {
          opacity: 1, y: 0, duration: 0.8, delay: index * 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%', end: 'bottom 60%', toggleActions: 'play none none reverse' },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [mounted]);

  useEffect(() => {
    if (modalPack && modalRef.current) {
      gsap.from(modalRef.current, { opacity: 0, scale: 0.9, duration: 0.3, ease: 'power2.out' });
    }
  }, [modalPack]);

  const t = PRICING_TRANSLATIONS[language] || PRICING_TRANSLATIONS.fr;

  useEffect(() => {
    if (!mounted) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const packId = entry.target.getAttribute('data-pack-id');
        if (packId && entry.isIntersecting && !trackedPacks.current.has(packId)) {
          trackedPacks.current.add(packId);
          packViewTimes.current[packId] = Date.now();
          const packData = t.packs[packId as keyof typeof t.packs];
          if (packData) {
            trackPackView({ pack_id: packId, pack_name: packData.title, pack_price: packData.price, language });
          }
        }
      });
    }, { threshold: 0.5 });
    cardsRef.current.forEach((card) => { if (card) observer.observe(card); });
    return () => observer.disconnect();
  }, [mounted, language, t.packs, trackPackView]);

  const openModal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalPack(id);
    modalOpenTime.current = Date.now();
    const packData = t.packs[id as keyof typeof t.packs];
    if (packData) trackPackClick({ pack_id: id, pack_name: packData.title, pack_price: packData.price, language });
  };

  const closeModal = () => {
    if (modalPack && modalOpenTime.current) {
      const timeSpent = Math.round((Date.now() - modalOpenTime.current) / 1000);
      const packData = t.packs[modalPack as keyof typeof t.packs];
      if (packData) trackPackModalClose({ pack_id: modalPack, pack_name: packData.title, pack_price: packData.price, language, time_spent_seconds: timeSpent });
    }
    setModalPack(null);
  };

  const handleChoosePack = (packId: string) => {
    const packData = t.packs[packId as keyof typeof t.packs];
    if (packData) trackPackChoose({ pack_id: packId, pack_name: packData.title, pack_price: packData.price, language });
    router.push(`/${language}/booking?pack=${packId}`);
  };

  const handleContact = (type: 'chatbot') => {
    trackContact({ contact_type: type, language, pack_id: modalPack || undefined });
    if (type === 'chatbot') window.dispatchEvent(new CustomEvent('openChatbot'));
  };

  const currentPack = modalPack ? t.packs[modalPack as keyof typeof t.packs] : null;
  const currentCrossLinks = modalPack
    ? CROSS_LINKS[modalPack as keyof typeof CROSS_LINKS]?.[language] ?? CROSS_LINKS[modalPack as keyof typeof CROSS_LINKS]?.fr
    : null;

  // ─── SSR fallback ─────────────────────────────────────────────────────────
  if (!mounted) {
    return (
      <section ref={ref} className="relative py-24 px-4 sm:px-6 bg-gradient-to-b from-[#050510] to-[#0e1b3d]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">{t.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packs.map((pack) => {
              const packData = t.packs[pack.id as keyof typeof t.packs];
              const PackIconSSR = pack.lucideIcon;
              return (
                <div key={pack.id} className={`relative rounded-2xl overflow-hidden bg-[#0e1b3d]/50 border border-white/10 ${pack.popular ? 'ring-2 ring-white' : ''}`}>
                  {pack.popular && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 text-xs font-semibold bg-white text-gray-900 rounded-full">Populaire</span>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="w-12 h-12 mb-5 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                      <PackIconSSR className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{packData?.title}</h3>
                    <p className="text-white/60 text-sm mb-4">{packData?.subtitle}</p>
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-3xl font-bold text-white">{packData?.price}</span>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {packData?.features?.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                          <span className="w-4 h-4 text-white flex-shrink-0">•</span>
                          <span>{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="text-sm text-white/50 mb-4">
                      <span>{t.deadline}: </span>
                      <span className="text-white/80">{packData?.delay}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // ─── Version interactive ───────────────────────────────────────────────────
  const cardElements = packs.map((pack, index) => {
    const packData = t.packs[pack.id as keyof typeof t.packs];
    const PackIcon = pack.lucideIcon;

    return (
      <div
        key={pack.id}
        data-pack-id={pack.id}
        ref={(el) => { if (el) cardsRef.current[index] = el; }}
        className={`relative group cursor-pointer rounded-2xl overflow-hidden bg-[#0e1b3d]/50 border border-white/10 hover:border-white/40 transition-all duration-500 ${pack.popular ? 'ring-2 ring-white' : ''}`}
        onClick={(e) => openModal(pack.id, e)}
      >
        {pack.popular && (
          <div className="absolute top-4 right-4 z-10">
            <span className="px-3 py-1 text-xs font-semibold bg-white text-gray-900 rounded-full">Populaire</span>
          </div>
        )}
        <div className={`absolute inset-0 bg-gradient-to-br ${pack.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
        <div className="relative p-6">
          <div className="w-12 h-12 mb-5 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
            <PackIcon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{packData?.title}</h3>
          <p className="text-white/60 text-sm mb-4">{packData?.subtitle}</p>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-3xl font-bold text-white">{packData?.price}</span>
            <span className="text-white/50 text-sm">{t.vat}</span>
          </div>
          <ul className="space-y-3 mb-6">
            {packData?.features?.slice(0, 4).map((feature, i) => {
              const FeatureIcon = ICON_MAP[feature.icon] || Code;
              return (
                <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                  <FeatureIcon className="w-4 h-4 text-white flex-shrink-0" />
                  <span>{feature.text}</span>
                </li>
              );
            })}
            {(packData?.features?.length ?? 0) > 4 && (
              <li className="text-white/80 text-sm">
                +{(packData?.features?.length ?? 0) - 4} {language === 'fr' ? 'autres inclus' : language === 'es' ? 'más incluidos' : 'more included'}
              </li>
            )}
          </ul>
          <div className="flex items-center justify-between text-sm text-white/50 mb-4">
            <span>{t.deadline}:</span>
            <span className="text-white/80">{packData?.delay}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleChoosePack(pack.id); }}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${pack.popular ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-white/10 border border-white/30 text-white hover:bg-white/20'}`}
          >
            {t.choosePack}
          </button>
        </div>
      </div>
    );
  });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 bg-gradient-to-b from-[#050510] to-[#0e1b3d]"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16 text-white">
          {t.title}
        </h2>

        {/* Desktop : grille 3 colonnes */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-6">
          {cardElements}
        </div>

        {/* Mobile : carousel snap horizontal */}
        <div className="sm:hidden -mx-4">
          <CardsCarousel slideWidth="snap" padding={1} gap={1} dotColor="#ffffff">
            {cardElements}
          </CardsCarousel>
        </div>
      </div>

      {/* Modal détail pack */}
      {modalPack && currentPack && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            className="relative max-w-lg w-full bg-[#0e1b3d] border border-white/10 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={closeModal} className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors z-10">
              <X className="w-6 h-6" />
            </button>

            <div className={`h-2 bg-gradient-to-r ${packs.find(p => p.id === modalPack)?.gradient}`} />

            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-2">{currentPack.title}</h3>
              <p className="text-white/60 mb-6">{currentPack.description}</p>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-white">{currentPack.price}</span>
                <span className="text-white/40 text-sm">{t.vat}</span>
              </div>

              <ul className="space-y-4 mb-6">
                {currentPack.features?.map((feature, i) => {
                  const FeatureIcon = ICON_MAP[feature.icon] || Code;
                  return (
                    <li key={i} className="flex items-center gap-3 text-white/80">
                      <FeatureIcon className="w-5 h-5 text-white flex-shrink-0" />
                      <span>{feature.text}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-center justify-between text-white/60 mb-3 pb-3 border-b border-white/10">
                <span>{t.deadline}:</span>
                <span className="font-semibold text-white">{currentPack.delay}</span>
              </div>
              <div className="flex items-center justify-between text-white/60 mb-6">
                <span>Support:</span>
                <span className="font-semibold text-white">{currentPack.support}</span>
              </div>

              <button
                onClick={() => handleChoosePack(modalPack)}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02] mb-6 ${packs.find(p => p.id === modalPack)?.popular ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-white/10 border border-white/30 text-white hover:bg-white/20'}`}
              >
                {t.choosePack}
              </button>

              {/* Liens croisés dans le modal */}
              {currentCrossLinks && currentCrossLinks.length > 0 && (
                <div className="border-t border-white/10 pt-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">{t.crossLinksTitle}</p>
                  <div className="space-y-2">
                    {currentCrossLinks.map((link, i) => (
                      <LocalizedLink
                        key={i}
                        href={link.href}
                        onClick={closeModal}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all group"
                      >
                        {link.type === 'article'
                          ? <BookOpen className="w-4 h-4 text-white/80 flex-shrink-0" />
                          : <Bot className="w-4 h-4 text-white/80 flex-shrink-0" />
                        }
                        <span className="text-sm text-white/70 group-hover:text-white transition-colors">{link.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white ml-auto transition-colors" />
                      </LocalizedLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
});

ServicesPricing.displayName = 'ServicesPricing';
