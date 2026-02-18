'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { gsap } from '@/lib/gsap-setup';
import { Check } from 'lucide-react';

interface ServicesPricingProps {
  language?: 'fr' | 'en';
}

interface Pack {
  id: string;
  icon: string;
  gradient: string;
  popular?: boolean;
  featuresCount: number;
}

export function ServicesPricing({ language = 'fr' }: ServicesPricingProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const packs: Pack[] = [
    {
      id: 'starter',
      icon: '/assets/etoile.webp',
      gradient: 'from-blue-500 to-cyan-500',
      featuresCount: 5,
    },
    {
      id: 'business',
      icon: '/assets/eclair.webp',
      gradient: 'from-purple-500 to-pink-500',
      popular: true,
      featuresCount: 6,
    },
    {
      id: 'premium',
      icon: '/assets/couronne.webp',
      gradient: 'from-orange-500 to-red-500',
      featuresCount: 7,
    },
    {
      id: 'ai',
      icon: '/assets/robot.webp',
      gradient: 'from-green-500 to-teal-500',
      featuresCount: 5,
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
        'servicePage.pricing.cta': 'Devis personnalisé',
        // Starter
        'servicePage.pricing.starter.name': 'Starter',
        'servicePage.pricing.starter.price': '1 500€',
        'servicePage.pricing.starter.desc': 'Idéal pour démarrer votre présence en ligne',
        'servicePage.pricing.starter.delay': '2-3 semaines',
        'servicePage.pricing.starter.features.1': 'Site vitrine responsive',
        'servicePage.pricing.starter.features.2': 'Design personnalisé',
        'servicePage.pricing.starter.features.3': 'Optimisation SEO de base',
        'servicePage.pricing.starter.features.4': 'Formulaire de contact',
        'servicePage.pricing.starter.features.5': 'Hébergement 1 an inclus',
        // Business
        'servicePage.pricing.business.name': 'Business',
        'servicePage.pricing.business.price': '3 500€',
        'servicePage.pricing.business.desc': 'Solution complète pour entreprises en croissance',
        'servicePage.pricing.business.delay': '4-6 semaines',
        'servicePage.pricing.business.popular': '⭐ Populaire',
        'servicePage.pricing.business.features.1': 'Tout du pack Starter',
        'servicePage.pricing.business.features.2': 'Espace administrateur',
        'servicePage.pricing.business.features.3': 'Blog intégré',
        'servicePage.pricing.business.features.4': 'Analytics avancés',
        'servicePage.pricing.business.features.5': 'Support prioritaire',
        'servicePage.pricing.business.features.6': 'Formation incluse',
        // Premium
        'servicePage.pricing.premium.name': 'Premium',
        'servicePage.pricing.premium.price': '6 000€',
        'servicePage.pricing.premium.desc': 'Solution premium pour projets ambitieux',
        'servicePage.pricing.premium.delay': '6-8 semaines',
        'servicePage.pricing.premium.features.1': 'Tout du pack Business',
        'servicePage.pricing.premium.features.2': 'E-commerce complet',
        'servicePage.pricing.premium.features.3': 'Intégration API tierces',
        'servicePage.pricing.premium.features.4': 'Optimisation avancée',
        'servicePage.pricing.premium.features.5': 'Support 24/7',
        'servicePage.pricing.premium.features.6': 'Maintenance 3 mois',
        'servicePage.pricing.premium.features.7': 'Formation approfondie',
        // AI
        'servicePage.pricing.ai.name': 'Pack IA',
        'servicePage.pricing.ai.price': 'Sur devis',
        'servicePage.pricing.ai.desc': 'Intégration IA personnalisée',
        'servicePage.pricing.ai.delay': 'Variable',
        'servicePage.pricing.ai.features.1': 'Chatbot IA',
        'servicePage.pricing.ai.features.2': 'Automatisation',
        'servicePage.pricing.ai.features.3': 'Analyse de données',
        'servicePage.pricing.ai.features.4': 'Machine Learning',
        'servicePage.pricing.ai.features.5': 'Support dédié',
      },
      en: {
        'servicePage.pricing.title': 'Our Packages',
        'servicePage.pricing.priceLabel': 'Starting at',
        'servicePage.pricing.vat': 'VAT not applicable',
        'servicePage.pricing.clickDetails': 'Click to see details',
        'servicePage.pricing.deadline': 'Delivery time',
        'servicePage.pricing.choosePack': 'Choose this pack',
        'servicePage.pricing.cta': 'Custom quote',
        // Starter
        'servicePage.pricing.starter.name': 'Starter',
        'servicePage.pricing.starter.price': '€1,500',
        'servicePage.pricing.starter.desc': 'Perfect to start your online presence',
        'servicePage.pricing.starter.delay': '2-3 weeks',
        'servicePage.pricing.starter.features.1': 'Responsive showcase site',
        'servicePage.pricing.starter.features.2': 'Custom design',
        'servicePage.pricing.starter.features.3': 'Basic SEO optimization',
        'servicePage.pricing.starter.features.4': 'Contact form',
        'servicePage.pricing.starter.features.5': '1 year hosting included',
        // Business
        'servicePage.pricing.business.name': 'Business',
        'servicePage.pricing.business.price': '€3,500',
        'servicePage.pricing.business.desc': 'Complete solution for growing businesses',
        'servicePage.pricing.business.delay': '4-6 weeks',
        'servicePage.pricing.business.popular': '⭐ Popular',
        'servicePage.pricing.business.features.1': 'All Starter features',
        'servicePage.pricing.business.features.2': 'Admin panel',
        'servicePage.pricing.business.features.3': 'Integrated blog',
        'servicePage.pricing.business.features.4': 'Advanced analytics',
        'servicePage.pricing.business.features.5': 'Priority support',
        'servicePage.pricing.business.features.6': 'Training included',
        // Premium
        'servicePage.pricing.premium.name': 'Premium',
        'servicePage.pricing.premium.price': '€6,000',
        'servicePage.pricing.premium.desc': 'Premium solution for ambitious projects',
        'servicePage.pricing.premium.delay': '6-8 weeks',
        'servicePage.pricing.premium.features.1': 'All Business features',
        'servicePage.pricing.premium.features.2': 'Full e-commerce',
        'servicePage.pricing.premium.features.3': 'Third-party API integration',
        'servicePage.pricing.premium.features.4': 'Advanced optimization',
        'servicePage.pricing.premium.features.5': '24/7 support',
        'servicePage.pricing.premium.features.6': '3 months maintenance',
        'servicePage.pricing.premium.features.7': 'In-depth training',
        // AI
        'servicePage.pricing.ai.name': 'AI Pack',
        'servicePage.pricing.ai.price': 'Custom',
        'servicePage.pricing.ai.desc': 'Custom AI integration',
        'servicePage.pricing.ai.delay': 'Variable',
        'servicePage.pricing.ai.features.1': 'AI Chatbot',
        'servicePage.pricing.ai.features.2': 'Automation',
        'servicePage.pricing.ai.features.3': 'Data analysis',
        'servicePage.pricing.ai.features.4': 'Machine Learning',
        'servicePage.pricing.ai.features.5': 'Dedicated support',
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
    router.push(`/quote?pack=${packId}`);
  };

  if (!mounted) {
    return (
      <section className="min-h-screen py-36 px-6 bg-gradient-to-b from-slate-800 to-slate-900 flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-5xl md:text-7xl font-bold text-white text-center mb-24">
            {t('servicePage.pricing.title')}
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="min-h-screen py-36 px-6 bg-gradient-to-b from-slate-800 to-slate-900 flex items-center"
    >
      <div className="max-w-7xl mx-auto w-full">
        <h2
          ref={titleRef}
          className="text-5xl md:text-7xl font-bold text-white text-center mb-24"
        >
          {t('servicePage.pricing.title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packs.map((pack, index) => {
            const isFlipped = flippedCards.has(index);

            return (
              <div
                key={index}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                className="relative h-[650px] cursor-pointer"
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
                    className={`absolute w-full h-full rounded-3xl bg-gradient-to-br ${pack.gradient} p-8 shadow-2xl flex flex-col justify-between`}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    {pack.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-slate-900 px-6 py-2 rounded-full font-bold text-sm">
                        {t(`servicePage.pricing.${pack.id}.popular`)}
                      </div>
                    )}
                    <div>
                      <div className="relative w-16 h-16 mb-6">
                        <Image
                          src={pack.icon}
                          alt={t(`servicePage.pricing.${pack.id}.name`)}
                          fill
                          sizes="64px"
                          className="object-contain drop-shadow-lg"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="text-4xl font-bold text-white mb-4">
                        {t(`servicePage.pricing.${pack.id}.name`)}
                      </h3>
                      <div className="mb-2">
                        <p className="text-white/70 text-sm font-medium mb-1">
                          {t('servicePage.pricing.priceLabel')}
                        </p>
                        <div className="text-5xl font-bold text-white">
                          {t(`servicePage.pricing.${pack.id}.price`)}
                        </div>
                      </div>
                      <p className="text-white/80 text-sm mb-8">
                        {t('servicePage.pricing.vat')}
                      </p>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <p className="text-white/95 text-base leading-relaxed">
                          {t(`servicePage.pricing.${pack.id}.desc`)}
                        </p>
                      </div>
                    </div>
                    <div className="text-center text-white/90 text-lg">
                      {t('servicePage.pricing.clickDetails')}
                    </div>
                  </div>

                  {/* Face arrière */}
                  <div
                    className="absolute w-full h-full rounded-3xl bg-white p-8 shadow-2xl flex flex-col justify-between overflow-y-auto"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900 mb-6">
                        {t(`servicePage.pricing.${pack.id}.name`)}
                      </h3>
                      <ul className="space-y-3 mb-8">
                        {Array.from({ length: pack.featuresCount }).map((_, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                            <span className="text-slate-700 text-base">
                              {t(`servicePage.pricing.${pack.id}.features.${i + 1}`)}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="bg-slate-50 rounded-xl p-4 mb-6">
                        <p className="text-slate-600 text-sm font-semibold mb-1">
                          {t('servicePage.pricing.deadline')}
                        </p>
                        <p className="text-slate-900 text-lg font-bold">
                          {t(`servicePage.pricing.${pack.id}.delay`)}
                        </p>
                      </div>
                    </div>
                    <button
                      className={`w-full py-4 rounded-xl bg-gradient-to-r ${pack.gradient} text-white font-bold text-lg hover:scale-105 transition-transform shadow-lg`}
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

        <div className="mt-16 text-center">
          <button
            onClick={() => router.push('/quote')}
            className="px-8 py-4 bg-white text-slate-900 font-bold text-lg rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
          >
            {t('servicePage.pricing.cta')}
          </button>
        </div>
      </div>
    </section>
  );
}