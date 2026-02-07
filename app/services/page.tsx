import { Metadata } from 'next';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Code2,
  Sparkles,
  Cog,
  Zap,
  Smartphone,
  Database,
  Shield,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Comprehensive web development, AI integration, and automation services. Custom solutions for modern businesses including responsive design, performance optimization, and intelligent automation.',
  keywords: ['web development services', 'AI integration', 'automation', 'mobile development', 'SEO optimization', 'database design'],
};

export default function ServicesPage() {
  const services = [
    {
      icon: Code2,
      title: 'Custom Web Development',
      description: 'Build powerful, scalable web applications with modern frameworks and best practices.',
      features: [
        'Next.js & React applications',
        'TypeScript development',
        'RESTful API integration',
        'Progressive Web Apps (PWA)',
      ],
    },
    {
      icon: Sparkles,
      title: 'AI Integration',
      description: 'Leverage artificial intelligence to enhance your business processes and decision-making.',
      features: [
        'Machine learning implementation',
        'Natural language processing',
        'Predictive analytics',
        'Chatbot development',
      ],
    },
    {
      icon: Cog,
      title: 'Process Automation',
      description: 'Streamline operations and reduce manual work with intelligent automation solutions.',
      features: [
        'Workflow automation',
        'Data processing pipelines',
        'Email & notification systems',
        'Integration with third-party tools',
      ],
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Maximize speed, efficiency, and user experience across all digital platforms.',
      features: [
        'Core Web Vitals optimization',
        'Image & asset optimization',
        'Caching strategies',
        'CDN configuration',
      ],
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Create responsive, mobile-optimized experiences that work seamlessly on any device.',
      features: [
        'Responsive web design',
        'Touch-optimized interfaces',
        'Cross-browser compatibility',
        'Adaptive layouts',
      ],
    },
    {
      icon: Database,
      title: 'Database Solutions',
      description: 'Design and implement robust database architectures for your application needs.',
      features: [
        'SQL & NoSQL databases',
        'Data modeling',
        'Migration & optimization',
        'Backup & recovery strategies',
      ],
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'Protect your digital assets with industry-standard security practices.',
      features: [
        'Authentication & authorization',
        'Data encryption',
        'Security audits',
        'GDPR compliance',
      ],
    },
    {
      icon: TrendingUp,
      title: 'SEO & Analytics',
      description: 'Improve visibility and track performance with comprehensive SEO and analytics.',
      features: [
        'On-page SEO optimization',
        'Technical SEO audits',
        'Google Analytics setup',
        'Performance monitoring',
      ],
    },
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-16">
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Services
              </h1>
              <p className="text-xl text-gray-600">
                Comprehensive solutions designed to transform your business and drive growth.
                From concept to deployment, we handle every aspect of your digital journey.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <service.icon className="h-12 w-12 text-blue-600 mb-4" />
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Let's discuss how our services can help you achieve your business goals.
              Get in touch today for a free consultation.
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">
                Contact Us <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: 'Web Development and AI Integration',
            provider: {
              '@type': 'Organization',
              name: 'NeuraWeb',
              url: 'https://neuraweb.tech',
            },
            areaServed: 'Worldwide',
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Web Development Services',
              itemListElement: services.map((service) => ({
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: service.title,
                  description: service.description,
                },
              })),
            },
          }),
        }}
      />
    </>
  );
}
