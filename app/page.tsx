import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code2, Sparkles, Cog, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Home() {
  const services = [
    {
      icon: Code2,
      title: 'Web Development',
      description: 'Custom websites and web applications built with modern technologies like Next.js, React, and TypeScript.',
    },
    {
      icon: Sparkles,
      title: 'AI Integration',
      description: 'Integrate cutting-edge AI solutions into your business processes to enhance efficiency and decision-making.',
    },
    {
      icon: Cog,
      title: 'Automation Services',
      description: 'Streamline your operations with intelligent automation solutions that save time and reduce costs.',
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Optimize your digital presence for speed, SEO, and user experience to maximize conversions.',
    },
  ];

  const benefits = [
    'Fast turnaround times',
    'SEO-optimized solutions',
    'Mobile-first responsive design',
    'Scalable architecture',
    'Ongoing support and maintenance',
    'Competitive pricing',
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Professional Web Development & AI Integration
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Transform your business with stunning websites and intelligent automation solutions.
                We create digital experiences that drive results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/contact">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/services">View Services</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Services
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive solutions tailored to your business needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <service.icon className="h-12 w-12 text-blue-600 mb-4" />
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{service.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Why Choose NeuraWeb?
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  We combine technical expertise with creative innovation to deliver
                  exceptional digital solutions. Our team specializes in building
                  high-performance, scalable applications that grow with your business.
                </p>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-gray-600 mb-6">
                  Let's discuss how we can help transform your business with
                  professional web development and AI integration services.
                </p>
                <Button size="lg" className="w-full" asChild>
                  <Link href="/contact">Contact Us Today</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Let's Build Something Amazing Together
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Whether you need a new website, AI integration, or automation solutions,
              we're here to help bring your vision to life.
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">
                Start Your Project <ArrowRight className="ml-2 h-5 w-5" />
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
            '@type': 'Organization',
            name: 'NeuraWeb',
            url: 'https://neuraweb.tech',
            logo: 'https://neuraweb.tech/logo.png',
            description: 'Professional web development, AI integration, and automation services.',
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'GB',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'contact@neuraweb.tech',
              contactType: 'Customer Service',
            },
          }),
        }}
      />
    </>
  );
}
