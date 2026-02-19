'use client';

import { useEffect, useRef, useState, forwardRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { gsap } from '@/lib/gsap-setup';
import { Check, X, ChevronRight, Sparkles, Zap, Shield, HeadphonesIcon, Globe, Rocket, Code, Database, Bot, Settings, TrendingUp, Users, MessageSquare, ShoppingCart, Mail, Search, Server, Clock, Star } from 'lucide-react';

interface ServicesPricingProps {
  language?: 'fr' | 'en';
}

interface Pack {
  id: string;
  icon: string;
  gradient: string;
  popular?: boolean;
}

// Features détaillées pour la modale
const PACK_DETAILS = {
  fr: {
    starter: {
      title: 'Pack Starter',
      subtitle: 'Lancez votre présence digitale avec style',
      description: 'Parfait pour les entrepreneurs et PME qui souhaitent établir leur présence en ligne avec un site moderne et professionnel.',
      features: [
        { icon: Globe, text: 'Site vitrine responsive (jusqu\'à 5 pages)' },
        { icon: Code, text: 'Design moderne et personnalisé' },
        { icon: Search, text: 'Optimisation SEO technique' },
        { icon: Mail, text: 'Formulaire de contact avancé' },
        { icon: Server, text: 'Hébergement haute performance 1 an' },
        { icon: Shield, text: 'Certificat SSL sécurisé' },
        { icon: Zap, text: 'Optimisation vitesse (Score 90+ PageSpeed)' },
        { icon: Globe, text: 'Nom de domaine inclus 1 an' },
      ],
      technologies: ['Next.js', 'Tailwind CSS', 'Vercel'],
      support: 'Support email pendant 30 jours',
    },
    business: {
      title: 'Pack Business',
      subtitle: 'Propulsez votre croissance digitale',
      description: 'La solution complète pour les entreprises ambitieuses qui veulent se démarquer avec un site évolutif et des fonctionnalités avancées.',
      features: [
        { icon: Globe, text: 'Site professionnel (jusqu\'à 15 pages)' },
        { icon: Code, text: 'Design premium sur-mesure' },
        { icon: Database, text: 'Back-office administrateur complet' },
        { icon: MessageSquare, text: 'Blog intégré avec gestionnaire' },
        { icon: TrendingUp, text: 'Analytics et tableau de bord' },
        { icon: Users, text: 'Multi-utilisateurs avec rôles' },
        { icon: Zap, text: 'Optimisation SEO avancée' },
        { icon: Server, text: 'Hébergement premium 1 an' },
        { icon: HeadphonesIcon, text: 'Support prioritaire 6 mois' },
        { icon: Settings, text: 'Formation complète incluse' },
      ],
      technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'Tailwind CSS'],
      support: 'Support prioritaire 6 mois + Formation',
    },
    premium: {
      title: 'Pack Premium',
      subtitle: 'L\'excellence pour vos projets ambitieux',
      description: 'Notre offre haut de gamme pour les projets e-commerce et les entreprises requiring une solution complète avec intégrations avancées.',
      features: [
        { icon: Globe, text: 'Site premium (pages illimitées)' },
        { icon: ShoppingCart, text: 'E-commerce complet avec paiement' },
        { icon: Database, text: 'Gestion des stocks et commandes' },
        { icon: Users, text: 'Espace client personnel' },
        { icon: Code, text: 'Intégrations API tierces (CRM, ERP...)' },
        { icon: Zap, text: 'Performance optimisée (CDN, Cache)' },
        { icon: Search, text: 'SEO expert + Schema markup' },
        { icon: Shield, text: 'Sécurité renforcée + Sauvegardes' },
        { icon: HeadphonesIcon, text: 'Support dédié 24/7' },
        { icon: Settings, text: 'Maintenance proactive 3 mois' },
        { icon: Users, text: 'Formation équipe complète' },
        { icon: Rocket, text: 'Accompagnement marketing digital' },
      ],
      technologies: ['Next.js', 'Stripe', 'Prisma', 'PostgreSQL', 'Redis'],
      support: 'Support dédié 24/7 + Maintenance 3 mois',
    },
    ai: {
      title: 'Pack IA',
      subtitle: 'Intelligence artificielle pour votre business',
      description: 'Solutions d\'intelligence artificielle sur-mesure pour automatiser et optimiser vos processus métier.',
      features: [
        { icon: Bot, text: 'Chatbot IA conversationnel' },
        { icon: Zap, text: 'Automatisation des processus' },
        { icon: TrendingUp, text: 'Analyse prédictive de données' },
        { icon: MessageSquare, text: 'Génération de contenu automatique' },
        { icon: Users, text: 'Assistant virtuel personnalisé' },
        { icon: Database, text: 'Intégration avec vos outils existants' },
        { icon: Settings, text: 'Fine-tuning sur vos données' },
        { icon: HeadphonesIcon, text: 'Support technique dédié' },
        { icon: Shield, text: 'Sécurité et confidentialité des données' },
        { icon: Code, text: 'API et documentation complète' },
      ],
      technologies: ['OpenAI', 'LangChain', 'Pinecone', 'Next.js'],
      support: 'Support dédié + Maintenance continue',
    },
  },
  en: {
    starter: {
      title: 'Starter Pack',
      subtitle: 'Launch your digital presence with style',
      description: 'Perfect for entrepreneurs and SMEs looking to establish their online presence with a modern and professional website.',
      features: [
        { icon: Globe, text: 'Responsive showcase site (up to 5 pages)' },
        { icon: Code, text: 'Modern and personalized design' },
        { icon: Search, text: 'Technical SEO optimization' },
        { icon: Mail, text: 'Advanced contact form' },
        { icon: Server, text: 'High-performance hosting 1 year' },
        { icon: Shield, text: 'Secure SSL certificate' },
        { icon: Zap, text: 'Speed optimization (90+ PageSpeed)' },
        { icon: Globe, text: 'Domain name included 1 year' },
      ],
      technologies: ['Next.js', 'Tailwind CSS', 'Vercel'],
      support: 'Email support for 30 days',
    },
    business: {
      title: 'Business Pack',
      subtitle: 'Propel your digital growth',
      description: 'The complete solution for ambitious companies looking to stand out with an evolving site and advanced features.',
      features: [
        { icon: Globe, text: 'Professional site (up to 15 pages)' },
        { icon: Code, text: 'Premium custom design' },
        { icon: Database, text: 'Complete admin back-office' },
        { icon: MessageSquare, text: 'Integrated blog with manager' },
        { icon: TrendingUp, text: 'Analytics and dashboard' },
        { icon: Users, text: 'Multi-user with roles' },
        { icon: Zap, text: 'Advanced SEO optimization' },
        { icon: Server, text: 'Premium hosting 1 year' },
        { icon: HeadphonesIcon, text: 'Priority support 6 months' },
        { icon: Settings, text: 'Complete training included' },
      ],
      technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'Tailwind CSS'],
      support: 'Priority support 6 months + Training',
    },
    premium: {
      title: 'Premium Pack',
      subtitle: 'Excellence for your ambitious projects',
      description: 'Our high-end offer for e-commerce projects and companies requiring a complete solution with advanced integrations.',
      features: [
        { icon: Globe, text: 'Premium site (unlimited pages)' },
        { icon: ShoppingCart, text: 'Complete e-commerce with payment' },
        { icon: Database, text: 'Stock and order management' },
        { icon: Users, text: 'Personal customer area' },
        { icon: Code, text: 'Third-party API integrations (CRM, ERP...)' },
        { icon: Zap, text: 'Optimized performance (CDN, Cache)' },
        { icon: Search, text: 'Expert SEO + Schema markup' },
        { icon: Shield, text: 'Enhanced security + Backups' },
        { icon: HeadphonesIcon, text: 'Dedicated 24/7 support' },
        { icon: Settings, text: 'Proactive maintenance 3 months' },
        { icon: Users, text: 'Complete team training' },
        { icon: Rocket, text: 'Digital marketing support' },
      ],
      technologies: ['Next.js', 'Stripe', 'Prisma', 'PostgreSQL', 'Redis'],
      support: 'Dedicated 24/7 support + 3 months maintenance',
    },
    ai: {
      title: 'AI Pack',
      subtitle: 'Artificial intelligence for your business',
      description: 'Custom AI solutions to automate and optimize your business processes.',
      features: [
        { icon: Bot, text: 'Conversational AI chatbot' },
        { icon: Zap, text: 'Process automation' },
        { icon: TrendingUp, text: 'Predictive data analysis' },
        { icon: MessageSquare, text: 'Automatic content generation' },
        { icon: Users, text: 'Personalized virtual assistant' },
        { icon: Database, text: 'Integration with existing tools' },
        { icon: Settings, text: 'Fine-tuning on your data' },
        { icon: HeadphonesIcon, text: 'Dedicated technical support' },
        { icon: Shield, text: 'Data security and privacy' },
        { icon: Code, text: 'Complete API and documentation' },
      ],
      technologies: ['OpenAI', 'LangChain', 'Pinecone', 'Next.js'],
      support: 'Dedicated support + Continuous maintenance',
    },
  },
};

export const ServicesPricing = forwardRef<HTMLDivElement, ServicesPricingProps>(
  function ServicesPricing({ language = 'fr' }, forwardedRef) {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);
    const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
    const [modalPack, setModalPack] = useState<string | null>(null);

    const packs: Pack[] = [
      {
        id: 'starter',
        icon: '/assets/etoile.webp',
        gradient: 'from-blue-500 to-cyan-500',
      },
      {
        id: 'business',
        icon: '/assets/eclair.webp',
        gradient: 'from-purple-500 to-pink-500',
        popular: true,
      },
      {
        id: 'premium',
        icon: '/assets/couronne.webp',
        gradient: 'from-orange-500 to-red-500',
      },
      {
        id: 'ai',
        icon: '/assets/robot.webp',
        gradient: 'from-green-500 to-teal-500',
      },
    ];

    const t = (key: string): string => {
      const translations: Record<string, Record<string, string>> = {
        fr: {
          'servicePage.pricing.title': 'Nos Packs',
          'servicePage.pricing.priceLabel': 'À partir de',
          'servicePage.pricing.vat': 'TVA non applicable',
          'servicePage.pricing.clickDetails': 'Cliquer pour voir les détails',
          'servicePage.pricing.deadline': 'Délai de livraison',
          'servicePage.pricing.choosePack': 'Choisir ce pack',
          'servicePage.pricing.viewDetails': 'Voir le détail',
          // Starter
          'servicePage.pricing.starter.name': 'Starter',
          'servicePage.pricing.starter.price': '1 990€',
          'servicePage.pricing.starter.desc': 'Lancez votre présence digitale avec un site moderne et professionnel',
          'servicePage.pricing.starter.delay': '2-3 semaines',
          'servicePage.pricing.starter.highlight': 'Idéal pour démarrer',
          // Business
          'servicePage.pricing.business.name': 'Business',
          'servicePage.pricing.business.price': '4 900€',
          'servicePage.pricing.business.desc': 'Propulsez votre croissance avec un site évolutif et des fonctionnalités avancées',
          'servicePage.pricing.business.delay': '4-6 semaines',
          'servicePage.pricing.business.popular': '⭐ Populaire',
          'servicePage.pricing.business.highlight': 'Le plus choisi',
          // Premium
          'servicePage.pricing.premium.name': 'Premium',
          'servicePage.pricing.premium.price': '6 900€',
          'servicePage.pricing.premium.desc': 'L\'excellence pour vos projets e-commerce et intégrations enterprise',
          'servicePage.pricing.premium.delay': '6-8 semaines',
          'servicePage.pricing.premium.highlight': 'Solution complète',
          // AI
          'servicePage.pricing.ai.name': 'Pack IA',
          'servicePage.pricing.ai.price': 'Sur devis',
          'servicePage.pricing.ai.desc': 'Intégrez l\'intelligence artificielle pour automatiser et révolutionner votre business',
          'servicePage.pricing.ai.delay': 'Variable',
          'servicePage.pricing.ai.highlight': 'Sur-mesure',
        },
        en: {
          'servicePage.pricing.title': 'Our Packages',
          'servicePage.pricing.priceLabel': 'Starting at',
          'servicePage.pricing.vat': 'VAT not applicable',
          'servicePage.pricing.clickDetails': 'Click to see details',
          'servicePage.pricing.deadline': 'Delivery time',
          'servicePage.pricing.choosePack': 'Choose this pack',
          'servicePage.pricing.viewDetails': 'View details',
          // Starter
          'servicePage.pricing.starter.name': 'Starter',
          'servicePage.pricing.starter.price': '€1,990',
          'servicePage.pricing.starter.desc': 'Launch your digital presence with a modern and professional website',
          'servicePage.pricing.starter.delay': '2-3 weeks',
          'servicePage.pricing.starter.highlight': 'Perfect to start',
          // Business
          'servicePage.pricing.business.name': 'Business',
          'servicePage.pricing.business.price': '€4,900',
          'servicePage.pricing.business.desc': 'Propel your growth with an evolving site and advanced features',
          'servicePage.pricing.business.delay': '4-6 weeks',
          'servicePage.pricing.business.popular': '⭐ Popular',
          'servicePage.pricing.business.highlight': 'Most chosen',
          // Premium
          'servicePage.pricing.premium.name': 'Premium',
          'servicePage.pricing.premium.price': '€6,900',
          'servicePage.pricing.premium.desc': 'Excellence for your e-commerce projects and enterprise integrations',
          'servicePage.pricing.premium.delay': '6-8 weeks',
          'servicePage.pricing.premium.highlight': 'Complete solution',
          // AI
          'servicePage.pricing.ai.name': 'AI Pack',
          'servicePage.pricing.ai.price': 'Custom',
          'servicePage.pricing.ai.desc': 'Integrate AI to automate and revolutionize your business',
          'servicePage.pricing.ai.delay': 'Variable',
          'servicePage.pricing.ai.highlight': 'Custom-made',
        },
      };
      return translations[language][key] || key;
    };

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      if (!mounted) return;

      const ctx = gsap.context(() => {
        gsap.from(titleRef.current, {
          y: 80,
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            end: 'bottom 60%',
            toggleActions: 'play none none reverse',
          },
        });

        cardsRef.current.forEach((card, index) => {
          if (!card) return;

          gsap.from(card, {
            x: index === 0 ? -200 : index === 2 ? 200 : 0,
            y: index === 1 ? -100 : 0,
            opacity: 0,
            scale: 0.8,
            duration: 1,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'bottom 60%',
              toggleActions: 'play none none reverse',
            },
          });

          gsap.to(card, {
            y: '+=10',
            repeat: -1,
            yoyo: true,
            duration: 2 + index * 0.5,
            ease: 'power1.inOut',
          });
        });
      }, sectionRef);

      return () => ctx.revert();
    }, [mounted]);

    const toggleFlip = (index: number) => {
      setFlippedCards((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
        return newSet;
      });
    };

    const handleChoosePack = (packId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      router.push(`/contact?pack=${packId}`);
    };

    const openModal = (packId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setModalPack(packId);
    };

    const closeModal = () => {
      setModalPack(null);
    };

    const currentPackDetails = modalPack ? PACK_DETAILS[language][modalPack as keyof typeof PACK_DETAILS['fr']] : null;

    if (!mounted) {
      return (
        <section
          ref={forwardedRef}
          className="py-20 md:py-28 px-4 md:px-6 bg-gradient-to-b from-slate-800 to-slate-900"
        >
          <div className="max-w-7xl mx-auto w-full pt-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white text-center mb-12">
              {t('servicePage.pricing.title')}
            </h2>
          </div>
        </section>
      );
    }

    return (
      <>
        <section
          ref={forwardedRef}
          className="py-20 md:py-28 px-4 md:px-6 bg-gradient-to-b from-slate-800 to-slate-900"
        >
          <div ref={sectionRef} className="max-w-7xl mx-auto w-full pt-8">
            <h2
              ref={titleRef}
              className="text-4xl md:text-6xl font-bold text-white text-center mb-4"
            >
              {t('servicePage.pricing.title')}
            </h2>
            <p className="text-center text-white/60 mb-10 md:mb-14 text-lg">
              {language === 'fr' 
                ? 'Des solutions adaptées à vos besoins et votre budget'
                : 'Solutions tailored to your needs and budget'}
            </p>

            {/* Grid responsive optimisé - 2 colonnes sur sm, 4 sur lg */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {packs.map((pack, index) => {
                const isFlipped = flippedCards.has(index);

                return (
                  <div
                    key={index}
                    ref={(el) => {
                      if (el) cardsRef.current[index] = el;
                    }}
                    className="relative h-[400px] sm:h-[420px] lg:h-[440px] cursor-pointer"
                    style={{ perspective: '1000px' }}
                    onClick={() => toggleFlip(index)}
                  >
                    <div
                      className="relative w-full h-full transition-transform duration-700"
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      }}
                    >
                      {/* Face avant */}
                      <div
                        className={`absolute w-full h-full rounded-2xl md:rounded-3xl bg-gradient-to-br ${pack.gradient} p-5 md:p-6 shadow-2xl flex flex-col`}
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        {pack.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-slate-900 px-4 py-1.5 rounded-full font-bold text-xs whitespace-nowrap shadow-lg">
                            {t(`servicePage.pricing.${pack.id}.popular`)}
                          </div>
                        )}
                        <div className="flex items-start gap-3 mb-2">
                          <div className="relative w-11 h-11 md:w-12 md:h-12 flex-shrink-0">
                            <Image
                              src={pack.icon}
                              alt={t(`servicePage.pricing.${pack.id}.name`)}
                              fill
                              sizes="48px"
                              className="object-contain drop-shadow-lg"
                              loading="lazy"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg md:text-xl font-bold text-white">
                              {t(`servicePage.pricing.${pack.id}.name`)}
                            </h3>
                            <p className="text-white/60 text-xs">
                              {t(`servicePage.pricing.${pack.id}.highlight`)}
                            </p>
                          </div>
                        </div>
                        <div className="mb-2">
                          <div className="text-3xl md:text-4xl font-bold text-white">
                            {t(`servicePage.pricing.${pack.id}.price`)}
                          </div>
                          <p className="text-white/60 text-xs mt-0.5">
                            {t('servicePage.pricing.vat')}
                          </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 flex-grow">
                          <p className="text-white/90 text-sm leading-relaxed">
                            {t(`servicePage.pricing.${pack.id}.desc`)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20">
                          <div className="flex items-center gap-1.5 text-white/70 text-xs">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{t(`servicePage.pricing.${pack.id}.delay`)}</span>
                          </div>
                          <div className="text-white/80 text-xs font-medium flex items-center gap-1">
                            {t('servicePage.pricing.clickDetails')}
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                      {/* Face arrière */}
                      <div
                        className="absolute w-full h-full rounded-2xl md:rounded-3xl bg-white p-4 md:p-5 shadow-2xl flex flex-col overflow-y-auto"
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-bold text-slate-900">
                            {t(`servicePage.pricing.${pack.id}.name`)}
                          </h3>
                          <button
                            onClick={(e) => openModal(pack.id, e)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          >
                            {t('servicePage.pricing.viewDetails')}
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-2xl font-bold text-slate-900">
                            {t(`servicePage.pricing.${pack.id}.price`)}
                          </p>
                          <p className="text-slate-500 text-xs flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            {t(`servicePage.pricing.${pack.id}.delay`)}
                          </p>
                        </div>

                        <button
                          className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${pack.gradient} text-white font-bold text-sm hover:scale-105 transition-transform shadow-lg`}
                          onClick={(e) => handleChoosePack(pack.id, e)}
                        >
                          {t('servicePage.pricing.choosePack')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Modale détaillée */}
        {modalPack && currentPackDetails && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          >
            <div 
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header avec gradient */}
              <div className={`bg-gradient-to-r ${packs.find(p => p.id === modalPack)?.gradient} p-6 md:p-8 relative`}>
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {currentPackDetails.title}
                </h3>
                <p className="text-white/80 text-sm md:text-base">
                  {currentPackDetails.subtitle}
                </p>
              </div>

              {/* Contenu */}
              <div className="p-6 md:p-8">
                <p className="text-slate-600 mb-6 text-sm md:text-base leading-relaxed">
                  {currentPackDetails.description}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    {language === 'fr' ? 'Ce qui est inclus' : 'What\'s included'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {currentPackDetails.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <feature.icon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 text-sm">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Code className="w-4 h-4 text-blue-500" />
                    {language === 'fr' ? 'Technologies utilisées' : 'Technologies used'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentPackDetails.technologies.map((tech, index) => (
                      <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Support */}
                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                    <HeadphonesIcon className="w-4 h-4 text-purple-500" />
                    {language === 'fr' ? 'Support & Accompagnement' : 'Support & Guidance'}
                  </h4>
                  <p className="text-slate-600 text-sm">{currentPackDetails.support}</p>
                </div>

                {/* Prix et CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
                  <div>
                    <p className="text-3xl font-bold text-slate-900">
                      {t(`servicePage.pricing.${modalPack}.price`)}
                    </p>
                    <p className="text-slate-500 text-xs">{t('servicePage.pricing.vat')}</p>
                  </div>
                  <button
                    className={`w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r ${packs.find(p => p.id === modalPack)?.gradient} text-white font-bold hover:scale-105 transition-transform shadow-lg`}
                    onClick={(e) => handleChoosePack(modalPack, e)}
                  >
                    {t('servicePage.pricing.choosePack')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);