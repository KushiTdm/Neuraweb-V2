import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { generateBreadcrumbSchema } from '@/lib/structured-data';

// ── Metadata SEO ────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Notre Équipe | NeuraWeb — Développeurs & Experts IA',
  description: 'Rencontrez les développeurs et experts IA derrière NeuraWeb. Une équipe passionnée qui construit le futur avec l\'intelligence artificielle.',
  keywords: [
    'équipe NeuraWeb',
    'développeurs IA',
    'experts automatisation',
    'agence web équipe',
    'développeur React Next.js',
  ],
  openGraph: {
    title: 'Notre Équipe | NeuraWeb — Développeurs & Experts IA',
    description: 'Rencontrez les développeurs et experts IA derrière NeuraWeb.',
    url: 'https://neuraweb.tech/equipe',
    siteName: 'NeuraWeb',
    images: [
      {
        url: '/og-image.jpeg',
        width: 1200,
        height: 630,
        alt: 'Équipe NeuraWeb',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://neuraweb.tech/equipe',
  },
};

// ── Team Data ───────────────────────────────────────────────────────────────
const team = [
  {
    name: 'Nacer',
    role: 'Fondateur & Lead Developer',
    bio: 'Full-stack developer avec 11 ans d\'expérience. Spécialiste React/Next.js et intégration LLM. Passionné par l\'automatisation et l\'IA pour aider les startups à scaler.',
    stack: ['React', 'Next.js', 'OpenAI', 'n8n', 'Python', 'TypeScript'],
    certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
    photo: '/assets/neuraweb&brain.webp',
  },
  {
    name: 'Sandra',
    role: 'Communication & Marketing',
    bio: 'Experte en communication digitale et stratégie marketing. Elle transforme les idées en campagnes impactantes et développe la présence de marque de nos clients.',
    stack: ['Social Media', 'SEO', 'Content Marketing', 'Branding', 'Analytics'],
    certifications: ['Google Ads Certified', 'HubSpot Marketing'],
    photo: '/assets/neuraweb&brain.webp',
  },
  {
    name: 'Arthur',
    role: 'Développeur IA & Automatisation',
    bio: 'Ingénieur spécialisé en intelligence artificielle et automatisation. Il conçoit des solutions IA innovantes et des workflows automatisés sur mesure.',
    stack: ['Python', 'LangChain', 'n8n', 'OpenAI', 'Machine Learning', 'API'],
    certifications: ['TensorFlow Developer', 'n8n Certified'],
    photo: '/assets/neuraweb&brain.webp',
  },
];

// ── Breadcrumb Schema ───────────────────────────────────────────────────────
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Accueil', url: 'https://neuraweb.tech' },
  { name: 'Équipe', url: 'https://neuraweb.tech/equipe' },
]);

// ── Page Component ──────────────────────────────────────────────────────────
export default function EquipePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header />

      <main id="main-content" className="min-h-screen bg-white dark:bg-[#050510] pt-24">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              L'équipe derrière{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                NeuraWeb
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Des développeurs passionnés qui construisent le futur avec l'IA.
              On code, l'IA amplifie, vous scalez.
            </p>
          </div>
        </section>

        {/* Team Members */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
              {team.map((member) => (
                <article
                  key={member.name}
                  itemScope
                  itemType="https://schema.org/Person"
                  className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 transition-colors"
                >
                  {/* Photo & Basic Info */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        {/* Placeholder avatar since actual photo may not exist */}
                        <span className="text-4xl text-white font-bold">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div 
                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"
                        title="Disponible"
                      />
                    </div>
                    
                    <div className="text-center sm:text-left">
                      <h2 
                        className="text-2xl font-bold text-gray-900 dark:text-white"
                        itemProp="name"
                      >
                        {member.name}
                      </h2>
                      <p 
                        className="text-blue-600 dark:text-blue-400 font-medium"
                        itemProp="jobTitle"
                      >
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p 
                    className="text-gray-600 dark:text-gray-300 mb-6"
                    itemProp="description"
                  >
                    {member.bio}
                  </p>

                  {/* Stack */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                      Stack technique
                    </h3>
                    <div className="flex flex-wrap gap-2" aria-label="Stack technique">
                      {member.stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                      Certifications
                    </h3>
                    <div className="flex flex-wrap gap-2" aria-label="Certifications">
                      {member.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
              Nos valeurs
            </h2>
            
            <div className="grid sm:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Rapidité
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Des MVPs en 4-6 semaines. On ne traîne pas, on livre.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Qualité
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Code propre, tests automatisés, documentation complète.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Proximité
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  On travaille avec vous, pas pour vous. Communication directe.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Prêt à construire ensemble ?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Discutons de votre projet et voyons comment l'IA peut accélérer votre croissance.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Démarrer un projet
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}