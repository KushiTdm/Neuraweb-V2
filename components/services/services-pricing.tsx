'use client';

import { useEffect, useRef, useState, forwardRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from '@/lib/gsap-setup';
import { useLanguage } from '@/contexts/language-context';
import { useAnalytics } from '@/hooks/use-analytics';
import { X, ChevronRight, Sparkles, Zap, Shield, HeadphonesIcon, Globe, Rocket, Code, Database, Bot, Settings, TrendingUp, Users, MessageSquare, ShoppingCart, Mail, Search, Server, Clock, MessageCircle, Layout, BarChart3, Star, ArrowRight } from 'lucide-react';
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

// Icons mapping
const ICON_MAP: Record<string, React.ElementType> = {
  Code,
  Search,
  Globe,
  Shield,
  HeadphonesIcon,
  Zap,
  Settings,
  TrendingUp,
  Users,
  MessageSquare,
  ShoppingCart,
  Mail,
  Server,
  Bot,
  Database,
  Rocket,
  Clock,
  Sparkles,
  MessageCircle,
};

// Translations for pricing section
const PRICING_TRANSLATIONS = {
  fr: {
    title: 'Nos Packs',
    priceLabel: 'À partir de',
    vat: 'TVA non applicable',
    clickDetails: 'Cliquer pour voir les détails',
    deadline: 'Délai de livraison',
    choosePack: 'Choisir ce pack',
    cta: 'Devis personnalisé',
    whatsapp: 'WhatsApp',
    whatsappDesc: 'Discussion instantanée',
    chatbot: 'Chatbot IA',
    chatbotDesc: 'Réponses immédiates',
    highlight: 'Sur mesure',
    packs: {
      starter: {
        title: 'Pack Starter',
        subtitle: 'Lancez votre présence digitale',
        description: 'Parfait pour les entrepreneurs et petites entreprises qui souhaitent démarrer leur présence en ligne.',
        features: [
          { icon: 'Globe', text: 'Site vitrine 5 pages' },
          { icon: 'Code', text: 'Design moderne' },
          { icon: 'Search', text: 'SEO optimisé' },
          { icon: 'Mail', text: 'Formulaire de contact' },
          { icon: 'Server', text: 'Hébergement 1 an' },
        ],
        support: 'Support email',
        price: '1 500€',
        delay: '2-3 semaines',
      },
      business: {
        title: 'Pack Business',
        subtitle: 'Développez votre activité',
        description: 'Idéal pour les entreprises en croissance souhaitant améliorer leur visibilité et leurs processus.',
        features: [
          { icon: 'Globe', text: 'Site 15 pages' },
          { icon: 'Code', text: 'Design sur-mesure' },
          { icon: 'Users', text: 'Espace client' },
          { icon: 'MessageSquare', text: 'Blog intégré' },
          { icon: 'TrendingUp', text: 'Analytics avancés' },
          { icon: 'HeadphonesIcon', text: 'Support prioritaire' },
        ],
        support: 'Support prioritaire',
        price: '4 900€',
        delay: '4-6 semaines',
      },
      premium: {
        title: 'Pack Premium',
        subtitle: 'Solution complète',
        description: 'Pour les entreprises ambitieuses nécessitant une solution complète et évolutive.',
        features: [
          { icon: 'Globe', text: 'Site illimité' },
          { icon: 'ShoppingCart', text: 'E-commerce complet' },
          { icon: 'Settings', text: 'Intégrations API' },
          { icon: 'Shield', text: 'Sécurité avancée' },
          { icon: 'Zap', text: 'Performance optimale' },
          { icon: 'HeadphonesIcon', text: 'Support 24/7' },
        ],
        support: 'Support dédié 24/7',
        price: '9 900€',
        delay: '6-8 semaines',
      },
      ai: {
        title: 'Pack IA',
        subtitle: 'Intelligence Artificielle',
        description: 'Solutions IA sur-mesure pour automatiser et optimiser votre activité.',
        features: [
          { icon: 'Bot', text: 'Chatbot IA' },
          { icon: 'Zap', text: 'Automatisation' },
          { icon: 'Database', text: 'Analyse de données' },
          { icon: 'Sparkles', text: 'Machine Learning' },
          { icon: 'HeadphonesIcon', text: 'Support dédié' },
        ],
        support: 'Support dédié',
        price: 'Sur devis',
        delay: 'Variable',
      },
    },
  },
  en: {
    title: 'Our Packages',
    priceLabel: 'Starting at',
    vat: 'VAT not applicable',
    clickDetails: 'Click to see details',
    deadline: 'Delivery time',
    choosePack: 'Choose this pack',
    cta: 'Custom quote',
    whatsapp: 'WhatsApp',
    whatsappDesc: 'Instant discussion',
    chatbot: 'AI Chatbot',
    chatbotDesc: 'Immediate answers',
    highlight: 'Custom-made',
    packs: {
      starter: {
        title: 'Starter Pack',
        subtitle: 'Launch your digital presence',
        description: 'Perfect for entrepreneurs and small businesses looking to start their online presence.',
        features: [
          { icon: 'Globe', text: '5-page showcase site' },
          { icon: 'Code', text: 'Modern design' },
          { icon: 'Search', text: 'SEO optimized' },
          { icon: 'Mail', text: 'Contact form' },
          { icon: 'Server', text: '1-year hosting' },
        ],
        support: 'Email support',
        price: '€1,500',
        delay: '2-3 weeks',
      },
      business: {
        title: 'Business Pack',
        subtitle: 'Grow your business',
        description: 'Ideal for growing companies looking to improve their visibility and processes.',
        features: [
          { icon: 'Globe', text: '15-page site' },
          { icon: 'Code', text: 'Custom design' },
          { icon: 'Users', text: 'Client area' },
          { icon: 'MessageSquare', text: 'Integrated blog' },
          { icon: 'TrendingUp', text: 'Advanced analytics' },
          { icon: 'HeadphonesIcon', text: 'Priority support' },
        ],
        support: 'Priority support',
        price: '€4,900',
        delay: '4-6 weeks',
      },
      premium: {
        title: 'Premium Pack',
        subtitle: 'Complete solution',
        description: 'For ambitious companies requiring a complete and scalable solution.',
        features: [
          { icon: 'Globe', text: 'Unlimited site' },
          { icon: 'ShoppingCart', text: 'Full e-commerce' },
          { icon: 'Settings', text: 'API integrations' },
          { icon: 'Shield', text: 'Advanced security' },
          { icon: 'Zap', text: 'Optimal performance' },
          { icon: 'HeadphonesIcon', text: '24/7 support' },
        ],
        support: 'Dedicated 24/7 support',
        price: '€9,900',
        delay: '6-8 weeks',
      },
      ai: {
        title: 'AI Pack',
        subtitle: 'Artificial Intelligence',
        description: 'Custom AI solutions to automate and optimize your business.',
        features: [
          { icon: 'Bot', text: 'AI Chatbot' },
          { icon: 'Zap', text: 'Automation' },
          { icon: 'Database', text: 'Data analysis' },
          { icon: 'Sparkles', text: 'Machine Learning' },
          { icon: 'HeadphonesIcon', text: 'Dedicated support' },
        ],
        support: 'Dedicated support',
        price: 'On quote',
        delay: 'Variable',
      },
    },
  },
  es: {
    title: 'Nuestros Paquetes',
    priceLabel: 'A partir de',
    vat: 'IVA no aplicable',
    clickDetails: 'Haga clic para ver detalles',
    deadline: 'Tiempo de entrega',
    choosePack: 'Elegir este pack',
    cta: 'Presupuesto personalizado',
    whatsapp: 'WhatsApp',
    whatsappDesc: 'Discusión instantánea',
    chatbot: 'Chatbot IA',
    chatbotDesc: 'Respuestas inmediatas',
    highlight: 'A medida',
    packs: {
      starter: {
        title: 'Pack Starter',
        subtitle: 'Lanza tu presencia digital',
        description: 'Perfecto para emprendedores y pequeñas empresas que desean iniciar su presencia en línea.',
        features: [
          { icon: 'Globe', text: 'Sitio web 5 páginas' },
          { icon: 'Code', text: 'Diseño moderno' },
          { icon: 'Search', text: 'SEO optimizado' },
          { icon: 'Mail', text: 'Formulario de contacto' },
          { icon: 'Server', text: 'Alojamiento 1 año' },
        ],
        support: 'Soporte por email',
        price: '1.500€',
        delay: '2-3 semanas',
      },
      business: {
        title: 'Pack Business',
        subtitle: 'Desarrolla tu negocio',
        description: 'Ideal para empresas en crecimiento que desean mejorar su visibilidad y procesos.',
        features: [
          { icon: 'Globe', text: 'Sitio 15 páginas' },
          { icon: 'Code', text: 'Diseño personalizado' },
          { icon: 'Users', text: 'Área de cliente' },
          { icon: 'MessageSquare', text: 'Blog integrado' },
          { icon: 'TrendingUp', text: 'Analytics avanzados' },
          { icon: 'HeadphonesIcon', text: 'Soporte prioritario' },
        ],
        support: 'Soporte prioritario',
        price: '4.900€',
        delay: '4-6 semanas',
      },
      premium: {
        title: 'Pack Premium',
        subtitle: 'Solución completa',
        description: 'Para empresas ambiciosas que necesitan una solución completa y escalable.',
        features: [
          { icon: 'Globe', text: 'Sitio ilimitado' },
          { icon: 'ShoppingCart', text: 'E-commerce completo' },
          { icon: 'Settings', text: 'Integraciones API' },
          { icon: 'Shield', text: 'Seguridad avanzada' },
          { icon: 'Zap', text: 'Rendimiento óptimo' },
          { icon: 'HeadphonesIcon', text: 'Soporte 24/7' },
        ],
        support: 'Soporte dedicado 24/7',
        price: '9.900€',
        delay: '6-8 semanas',
      },
      ai: {
        title: 'Pack IA',
        subtitle: 'Inteligencia Artificial',
        description: 'Soluciones de IA personalizadas para automatizar y optimizar tu negocio.',
        features: [
          { icon: 'Bot', text: 'Chatbot IA' },
          { icon: 'Zap', text: 'Automatización' },
          { icon: 'Database', text: 'Análisis de datos' },
          { icon: 'Sparkles', text: 'Machine Learning' },
          { icon: 'HeadphonesIcon', text: 'Soporte dedicado' },
        ],
        support: 'Soporte dedicado',
        price: 'Bajo presupuesto',
        delay: 'Variable',
      },
    },
  },
};

export const ServicesPricing = forwardRef<HTMLDivElement, ServicesPricingProps>(
  ({ language = 'fr' }, ref) => {
  const [mounted, setMounted] = useState(false);
  const [modalPack, setModalPack] = useState<string | null>(null);
  const [contactPack, setContactPack] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalOpenTime = useRef<number>(0);
  const packViewTimes = useRef<Record<string, number>>({});
  const trackedPacks = useRef<Set<string>>(new Set());
  const router = useRouter();
  
  // Hook analytics pour le tracking
  const { 
    trackPackView, 
    trackPackClick, 
    trackPackChoose, 
    trackPackModalClose,
    trackContact 
  } = useAnalytics();

  const packs: Pack[] = [
    { id: 'starter', lucideIcon: Layout, gradient: 'from-[#5db8f0] to-[#22d3ee]' },
    { id: 'business', lucideIcon: BarChart3, gradient: 'from-[#5db8f0] to-[#22d3ee]', popular: true },
    { id: 'premium', lucideIcon: Star, gradient: 'from-[#5db8f0] to-[#22d3ee]' },
    { id: 'ai', lucideIcon: Sparkles, gradient: 'from-[#5db8f0] to-[#22d3ee]' },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      // Masquage initial via gsap.set (JS uniquement, après montage) — le HTML serveur
      // reste visible pour Google qui ne scroller pas. L'animation est identique côté UX.
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.set(card, { opacity: 0, y: 80 });
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'bottom 60%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [mounted]);

  useEffect(() => {
    if (modalPack && modalRef.current) {
      gsap.from(modalRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [modalPack]);

  const t = PRICING_TRANSLATIONS[language] || PRICING_TRANSLATIONS.fr;

  // Tracker les vues de packs avec Intersection Observer
  useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const packId = entry.target.getAttribute('data-pack-id');
          if (packId && entry.isIntersecting && !trackedPacks.current.has(packId)) {
            trackedPacks.current.add(packId);
            packViewTimes.current[packId] = Date.now();
            
            const packData = t.packs[packId as keyof typeof t.packs];
            if (packData) {
              trackPackView({
                pack_id: packId,
                pack_name: packData.title,
                pack_price: packData.price,
                language: language,
              });
            }
          }
        });
      },
      { threshold: 0.5 } // Déclenche quand 50% du pack est visible
    );

    // Observer chaque carte de pack
    cardsRef.current.forEach((card) => {
      if (card) {
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, [mounted, language, t.packs, trackPackView]);

  const openModal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setModalPack(id);
    modalOpenTime.current = Date.now();
    
    // Tracker le clic sur le pack
    const packData = t.packs[id as keyof typeof t.packs];
    if (packData) {
      trackPackClick({
        pack_id: id,
        pack_name: packData.title,
        pack_price: packData.price,
        language: language,
      });
    }
  };

  const closeModal = () => {
    // Tracker la fermeture de la modal avec le temps passé
    if (modalPack && modalOpenTime.current) {
      const timeSpent = Math.round((Date.now() - modalOpenTime.current) / 1000);
      const packData = t.packs[modalPack as keyof typeof t.packs];
      if (packData) {
        trackPackModalClose({
          pack_id: modalPack,
          pack_name: packData.title,
          pack_price: packData.price,
          language: language,
          time_spent_seconds: timeSpent,
        });
      }
    }
    setModalPack(null);
  };

  const getSub = () => language === 'fr' ? 'fr' : language === 'es' ? 'es' : 'en';

  const handleChoosePack = (packId: string) => {
    // Tracker la conversion (choix du pack)
    const packData = t.packs[packId as keyof typeof t.packs];
    if (packData) {
      trackPackChoose({
        pack_id: packId,
        pack_name: packData.title,
        pack_price: packData.price,
        language: language,
      });
    }
    // Rediriger vers la page booking avec le pack sélectionné
    router.push(`/${language}/booking?pack=${packId}`);
  };

  const handleContact = (type: 'whatsapp' | 'chatbot') => {
    // Tracker le contact
    trackContact({
      contact_type: type,
      language: language,
      pack_id: modalPack || undefined,
    });
    
    if (type === 'whatsapp') {
      window.open('https://wa.me/33749775654', '_blank');
    } else {
      window.dispatchEvent(new CustomEvent('openChatbot'));
    }
  };

  const currentPack = modalPack ? t.packs[modalPack as keyof typeof t.packs] : null;

  if (!mounted) {
    // SSR: render full content so Google can index pricing
    return (
      <section className="relative py-24 px-4 sm:px-6 bg-gradient-to-b from-[#050510] to-[#0e1b3d]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
            {t.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packs.map((pack) => {
              const packData = t.packs[pack.id as keyof typeof t.packs];
              const PackIconSSR = pack.lucideIcon;

              if (pack.id === 'ai') {
                return (
                  <div key={pack.id} className="relative rounded-2xl overflow-hidden bg-[#0e1b3d]/50 border border-white/10 border-dashed">
                    <div className="p-6">
                      <div className="w-12 h-12 mb-5 rounded-xl bg-[#5db8f0]/10 border border-[#5db8f0]/20 flex items-center justify-center">
                        <PackIconSSR className="w-6 h-6 text-[#5db8f0]" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">IA & Automatisation</h3>
                      <p className="text-white/60 text-sm mb-4">Services dédiés IA et automatisation.</p>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={pack.id}
                  className={`relative rounded-2xl overflow-hidden bg-[#0e1b3d]/50 border border-white/10 ${pack.popular ? 'ring-2 ring-[#5db8f0]' : ''}`}
                >
                  {pack.popular && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 text-xs font-semibold bg-[#5db8f0] text-[#050510] rounded-full">Populaire</span>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="w-12 h-12 mb-5 rounded-xl bg-[#5db8f0]/10 border border-[#5db8f0]/20 flex items-center justify-center">
                      <PackIconSSR className="w-6 h-6 text-[#5db8f0]" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{packData?.title}</h3>
                    <p className="text-white/60 text-sm mb-4">{packData?.subtitle}</p>
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-3xl font-bold text-white">{packData?.price}</span>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {packData?.features?.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                          <span className="w-4 h-4 text-[#5db8f0] flex-shrink-0">•</span>
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

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 bg-gradient-to-b from-[#050510] to-[#0e1b3d]"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16 text-white">
          {t.title}
        </h2>

        {(() => {
          const cardElements = packs.map((pack, index) => {
            const packData = t.packs[pack.id as keyof typeof t.packs];
            const PackIcon = pack.lucideIcon;

            // Carte spéciale pour les services IA — renvoie vers les pages dédiées
            if (pack.id === 'ai') {
              return (
                <div
                  key={pack.id}
                  ref={(el) => { if (el) cardsRef.current[index] = el; }}
                  className="relative group rounded-2xl overflow-hidden bg-[#0e1b3d]/50 border border-white/10 border-dashed hover:border-[#5db8f0]/40 transition-all duration-500"
                >
                  <div className="relative p-6 flex flex-col h-full">
                    <div className="w-12 h-12 mb-5 rounded-xl bg-[#5db8f0]/10 border border-[#5db8f0]/20 flex items-center justify-center">
                      <PackIcon className="w-6 h-6 text-[#5db8f0]" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {language === 'fr' ? 'IA & Automatisation' : language === 'es' ? 'IA & Automatización' : 'AI & Automation'}
                    </h3>
                    <p className="text-white/60 text-sm mb-6 flex-1">
                      {language === 'fr'
                        ? 'Chatbots RAG, agents IA, automatisation n8n/Make — des services dédiés pour aller plus loin.'
                        : language === 'es'
                        ? 'Chatbots RAG, agentes IA, automatización n8n/Make — servicios dedicados para ir más lejos.'
                        : 'RAG chatbots, AI agents, n8n/Make automation — dedicated services to go further.'}
                    </p>
                    <div className="space-y-2 mt-auto">
                      <LocalizedLink
                        href="/integration-ia"
                        className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-[#5db8f0]/10 border border-[#5db8f0]/20 text-[#5db8f0] text-sm font-medium hover:bg-[#5db8f0]/20 transition-colors"
                      >
                        <span>{language === 'fr' ? 'Intégration IA' : language === 'es' ? 'Integración IA' : 'AI Integration'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </LocalizedLink>
                      <LocalizedLink
                        href="/automatisation"
                        className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-[#22d3ee]/10 border border-[#22d3ee]/20 text-[#22d3ee] text-sm font-medium hover:bg-[#22d3ee]/20 transition-colors"
                      >
                        <span>{language === 'fr' ? 'Automatisation' : language === 'es' ? 'Automatización' : 'Automation'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </LocalizedLink>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={pack.id}
                data-pack-id={pack.id}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                className={`relative group cursor-pointer rounded-2xl overflow-hidden bg-[#0e1b3d]/50 border border-white/10 hover:border-[#5db8f0]/40 transition-all duration-500 ${pack.popular ? 'ring-2 ring-[#5db8f0]' : ''}`}
                onClick={(e) => openModal(pack.id, e)}
              >
                {pack.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 text-xs font-semibold bg-[#5db8f0] text-[#050510] rounded-full">
                      Populaire
                    </span>
                  </div>
                )}

                <div className={`absolute inset-0 bg-gradient-to-br ${pack.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                <div className="relative p-6">
                  <div className="w-12 h-12 mb-5 rounded-xl bg-[#5db8f0]/10 border border-[#5db8f0]/20 flex items-center justify-center">
                    <PackIcon className="w-6 h-6 text-[#5db8f0]" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {packData?.title}
                  </h3>
                  <p className="text-white/60 text-sm mb-4">
                    {packData?.subtitle}
                  </p>

                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-3xl font-bold text-white">
                      {packData?.price}
                    </span>
                    {packData?.price !== 'Sur devis' && packData?.price !== 'On quote' && packData?.price !== 'Bajo presupuesto' && (
                      <span className="text-white/50 text-sm">{t.vat}</span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6">
                    {packData?.features?.slice(0, 4).map((feature, i) => {
                      const FeatureIcon = ICON_MAP[feature.icon] || Code;
                      return (
                        <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                          <FeatureIcon className="w-4 h-4 text-[#5db8f0] flex-shrink-0" />
                          <span>{feature.text}</span>
                        </li>
                      );
                    })}
                    {(packData?.features?.length ?? 0) > 4 && (
                      <li className="text-[#5db8f0] text-sm">
                        +{(packData?.features?.length ?? 0) - 4} {language === 'fr' ? 'autres fonctionnalités' : language === 'es' ? 'otras características' : 'more features'}
                      </li>
                    )}
                  </ul>

                  <div className="flex items-center justify-between text-sm text-white/50 mb-4">
                    <span>{t.deadline}:</span>
                    <span className="text-white/80">{packData?.delay}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChoosePack(pack.id);
                    }}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r ${pack.gradient} text-[#050510] hover:shadow-lg hover:scale-[1.02]`}
                  >
                    {t.choosePack}
                  </button>
                </div>
              </div>
            );
          });

          return (
            <>
              {/* Desktop : grille 2 puis 4 colonnes */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cardElements}
              </div>

              {/* Mobile : carousel snap horizontal */}
              <div className="sm:hidden -mx-4">
                <CardsCarousel slideWidth="snap" padding={1} gap={1} dotColor="#5DB8F0">
                  {cardElements}
                </CardsCarousel>
              </div>
            </>
          );
        })()}

      </div>

      {/* Modal */}
      {modalPack && currentPack && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            className="relative max-w-lg w-full bg-[#0e1b3d] border border-white/10 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className={`h-2 bg-gradient-to-r ${packs.find(p => p.id === modalPack)?.gradient}`} />

            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                {currentPack.title}
              </h3>
              <p className="text-white/60 mb-6">{currentPack.description}</p>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-white">
                  {currentPack.price}
                </span>
              </div>

              <ul className="space-y-4 mb-8">
                {currentPack.features?.map((feature, i) => {
                  const FeatureIcon = ICON_MAP[feature.icon] || Code;
                  return (
                    <li key={i} className="flex items-center gap-3 text-white/80">
                      <FeatureIcon className="w-5 h-5 text-[#5db8f0] flex-shrink-0" />
                      <span>{feature.text}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-center justify-between text-white/60 mb-6 pb-6 border-b border-white/10">
                <span>{t.deadline}:</span>
                <span className="font-semibold text-white">{currentPack.delay}</span>
              </div>

              <div className="flex items-center justify-between text-white/60 mb-6">
                <span>Support:</span>
                <span className="font-semibold text-white">{currentPack.support}</span>
              </div>

              <button
                onClick={() => handleChoosePack(modalPack)}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r ${packs.find(p => p.id === modalPack)?.gradient} text-white hover:shadow-lg hover:scale-[1.02]`}
              >
                {t.choosePack}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
});

ServicesPricing.displayName = 'ServicesPricing';
