'use client';

import { BookOpen, Bot, Zap, ArrowRight } from 'lucide-react';
import { LocalizedLink } from '@/components/localized-link';

interface ServicesRelatedLinksProps {
  language?: 'fr' | 'en' | 'es';
}

const CONTENT = {
  fr: {
    title: 'Pour aller plus loin',
    subtitle: 'Articles et services complémentaires à votre projet web.',
    articles: [
      {
        label: 'Next.js vs WordPress : quel choix en 2025 ?',
        href: '/blog/nextjs-vs-wordpress-2025',
        desc: 'Comparatif technique et business pour choisir la bonne stack.',
      },
      {
        label: 'Comment intégrer l\'IA dans votre site web',
        href: '/blog/integrer-ia-site-web-2025',
        desc: 'Chatbots, recommandations, personnalisation — les cas d\'usage concrets.',
      },
    ],
    services: [
      {
        label: 'Intégration IA',
        href: '/integration-ia',
        desc: 'Chatbot RAG, agents IA, personnalisation — branchez l\'IA sur votre site.',
      },
      {
        label: 'Automatisation',
        href: '/automatisation',
        desc: 'n8n, Make, Zapier — automatisez vos process et gagnez du temps.',
      },
    ],
    articleTag: 'Article',
    serviceTag: 'Service',
  },
  en: {
    title: 'Go further',
    subtitle: 'Articles and services that complement your web project.',
    articles: [
      {
        label: 'Next.js vs WordPress: which choice in 2025?',
        href: '/blog/nextjs-vs-wordpress-2025',
        desc: 'Technical and business comparison to choose the right stack.',
      },
      {
        label: 'How to integrate AI into your website',
        href: '/blog/integrer-ia-site-web-2025',
        desc: 'Chatbots, recommendations, personalisation — concrete use cases.',
      },
    ],
    services: [
      {
        label: 'AI Integration',
        href: '/integration-ia',
        desc: 'RAG chatbot, AI agents, personalisation — plug AI into your site.',
      },
      {
        label: 'Automation',
        href: '/automatisation',
        desc: 'n8n, Make, Zapier — automate your processes and save time.',
      },
    ],
    articleTag: 'Article',
    serviceTag: 'Service',
  },
  es: {
    title: 'Para ir más lejos',
    subtitle: 'Artículos y servicios complementarios a tu proyecto web.',
    articles: [
      {
        label: 'Next.js vs WordPress: ¿qué elegir en 2025?',
        href: '/blog/nextjs-vs-wordpress-2025',
        desc: 'Comparativa técnica y de negocio para elegir el stack correcto.',
      },
      {
        label: 'Cómo integrar IA en tu sitio web',
        href: '/blog/integrer-ia-site-web-2025',
        desc: 'Chatbots, recomendaciones, personalización — casos de uso concretos.',
      },
    ],
    services: [
      {
        label: 'Integración IA',
        href: '/integration-ia',
        desc: 'Chatbot RAG, agentes IA, personalización — conecta IA a tu web.',
      },
      {
        label: 'Automatización',
        href: '/automatisation',
        desc: 'n8n, Make, Zapier — automatiza tus procesos y ahorra tiempo.',
      },
    ],
    articleTag: 'Artículo',
    serviceTag: 'Servicio',
  },
};

export function ServicesRelatedLinks({ language = 'fr' }: ServicesRelatedLinksProps) {
  const c = CONTENT[language] ?? CONTENT.fr;

  return (
    <section className="relative py-20 px-6 bg-[#050510] border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{c.title}</h2>
          <p className="text-white/50 text-base max-w-xl mx-auto">{c.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Articles */}
          {c.articles.map((item, i) => (
            <LocalizedLink
              key={`article-${i}`}
              href={item.href}
              className="group flex flex-col gap-3 p-5 rounded-2xl bg-[#0e1b3d]/60 border border-white/10 hover:border-[#22d3ee]/40 hover:bg-[#0e1b3d] transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#22d3ee]/10 border border-[#22d3ee]/20 text-[#22d3ee]">
                  <BookOpen className="w-3 h-3" />
                  {c.articleTag}
                </span>
              </div>
              <p className="text-white font-semibold text-sm leading-snug group-hover:text-[#22d3ee] transition-colors">
                {item.label}
              </p>
              <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
              <div className="flex items-center gap-1.5 text-[#22d3ee] text-xs font-medium mt-auto">
                <span>{language === 'fr' ? 'Lire l\'article' : language === 'es' ? 'Leer el artículo' : 'Read the article'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </LocalizedLink>
          ))}

          {/* Services complémentaires */}
          {c.services.map((item, i) => (
            <LocalizedLink
              key={`service-${i}`}
              href={item.href}
              className="group flex flex-col gap-3 p-5 rounded-2xl bg-[#0e1b3d]/60 border border-white/10 hover:border-[#5db8f0]/40 hover:bg-[#0e1b3d] transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#5db8f0]/10 border border-[#5db8f0]/20 text-[#5db8f0]">
                  {i === 0 ? <Bot className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                  {c.serviceTag}
                </span>
              </div>
              <p className="text-white font-semibold text-sm leading-snug group-hover:text-[#5db8f0] transition-colors">
                {item.label}
              </p>
              <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
              <div className="flex items-center gap-1.5 text-[#5db8f0] text-xs font-medium mt-auto">
                <span>{language === 'fr' ? 'Découvrir' : language === 'es' ? 'Descubrir' : 'Discover'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </LocalizedLink>
          ))}
        </div>
      </div>
    </section>
  );
}
