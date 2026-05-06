import { Metadata } from 'next';
import { SUPPORTED_LANGUAGES } from '@/proxy';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { JsonLd } from '@/components/json-ld';
import { LocalizedLink } from '@/components/localized-link';
import { ArrowLeft } from 'lucide-react';
import { generateBreadcrumbSchema } from '@/lib/structured-data';

export const revalidate = 3600;

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

const CONTENT = {
  fr: {
    title: 'Politique de Confidentialité',
    description: 'Politique de confidentialité et protection des données personnelles de NeuraWeb.',
    backToHome: 'Retour à l\'accueil',
    lastUpdate: 'Dernière mise à jour : Avril 2026',
    sections: [
      {
        title: '1. Introduction',
        content: `NeuraWeb (ci-après "nous", "notre" ou "NeuraWeb") s'engage à protéger la vie privée des utilisateurs de son site web https://neuraweb.tech.

Cette politique de confidentialité décrit comment nous collectons, utilisons, stockons et protégeons vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.`,
      },
      {
        title: '2. Responsable du traitement',
        content: `Le responsable du traitement des données est :

**NeuraWeb**
SIRET : 991 296 047 00020
Email : contact@neuraweb.tech
Téléphone : +33 7 49 77 56 54`,
      },
      {
        title: '3. Données collectées',
        content: `Nous collectons les données suivantes :

**Données fournies volontairement :**
- Nom et prénom
- Adresse email
- Numéro de téléphone
- Nom de l'entreprise
- Message de contact

**Données collectées automatiquement :**
- Adresse IP (anonymisée)
- Type de navigateur et appareil
- Pages visitées et durée de visite
- Source de trafic (via Google Analytics)`,
      },
      {
        title: '4. Finalités du traitement',
        content: `Vos données sont traitées pour :

- **Répondre à vos demandes** : traitement des formulaires de contact et demandes de devis
- **Améliorer nos services** : analyse anonymisée de l'utilisation du site
- **Communication commerciale** : uniquement avec votre consentement explicite
- **Obligations légales** : conservation des données de facturation`,
      },
      {
        title: '5. Base légale du traitement',
        content: `Le traitement de vos données repose sur :

- **Votre consentement** : pour les cookies non essentiels et la newsletter
- **L'exécution d'un contrat** : pour la gestion des projets clients
- **L'intérêt légitime** : pour l'amélioration de nos services
- **Les obligations légales** : pour la conservation des données comptables`,
      },
      {
        title: '6. Durée de conservation',
        content: `Vos données sont conservées :

- **Données de contact** : 3 ans après le dernier contact
- **Données clients** : 10 ans (obligations comptables)
- **Données d'analyse** : 26 mois (Google Analytics)
- **Cookies** : 13 mois maximum`,
      },
      {
        title: '7. Destinataires des données',
        content: `Vos données peuvent être partagées avec :

- **Vercel Inc.** : hébergement du site (États-Unis, Privacy Shield)
- **Google LLC** : analytics (États-Unis, Privacy Shield)
- **Crisp IM** : chat en ligne (France)
- **Resend** : envoi d'emails transactionnels

Nous ne vendons jamais vos données à des tiers.`,
      },
      {
        title: '8. Transferts internationaux',
        content: `Certaines données peuvent être transférées vers les États-Unis (Vercel, Google). Ces transferts sont encadrés par :

- Les clauses contractuelles types de la Commission européenne
- Le Data Privacy Framework UE-États-Unis

Nous veillons à ce que vos données bénéficient d'un niveau de protection équivalent au RGPD.`,
      },
      {
        title: '9. Vos droits',
        content: `Conformément au RGPD, vous disposez des droits suivants :

- **Droit d'accès** : obtenir une copie de vos données
- **Droit de rectification** : corriger des données inexactes
- **Droit à l'effacement** : supprimer vos données
- **Droit à la limitation** : restreindre le traitement
- **Droit à la portabilité** : recevoir vos données dans un format structuré
- **Droit d'opposition** : vous opposer au traitement
- **Droit de retirer votre consentement** : à tout moment

Pour exercer ces droits, contactez-nous à : **contact@neuraweb.tech**

Vous pouvez également introduire une réclamation auprès de la CNIL : https://www.cnil.fr`,
      },
      {
        title: '10. Cookies',
        content: `Notre site utilise des cookies :

**Cookies essentiels (toujours actifs) :**
- Préférences de langue
- Thème (clair/sombre)
- Session utilisateur

**Cookies d'analyse (avec consentement) :**
- Google Analytics : mesure d'audience anonymisée

**Cookies tiers :**
- Crisp : chat en ligne

Vous pouvez gérer vos préférences de cookies à tout moment via les paramètres de votre navigateur.`,
      },
      {
        title: '11. Sécurité',
        content: `Nous mettons en œuvre des mesures de sécurité appropriées :

- Chiffrement HTTPS (TLS 1.3)
- Headers de sécurité (CSP, HSTS, X-Frame-Options)
- Accès restreint aux données
- Sauvegardes régulières
- Surveillance des accès`,
      },
      {
        title: '12. Modifications',
        content: `Cette politique peut être mise à jour. Nous vous informerons de tout changement significatif par email ou via une notification sur le site.

La date de dernière mise à jour est indiquée en haut de cette page.`,
      },
      {
        title: '13. Contact',
        content: `Pour toute question concernant cette politique ou vos données personnelles :

**Email** : contact@neuraweb.tech
**Téléphone** : +33 7 49 77 56 54

Nous nous engageons à répondre dans un délai de 30 jours.`,
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    description: 'Privacy policy and personal data protection for NeuraWeb.',
    backToHome: 'Back to home',
    lastUpdate: 'Last updated: April 2026',
    sections: [
      {
        title: '1. Introduction',
        content: `NeuraWeb (hereinafter "we", "our" or "NeuraWeb") is committed to protecting the privacy of users of its website https://neuraweb.tech.

This privacy policy describes how we collect, use, store, and protect your personal data in accordance with the General Data Protection Regulation (GDPR).`,
      },
      {
        title: '2. Data Controller',
        content: `The data controller is:

**NeuraWeb**
SIRET: 991 296 047 00020
Email: contact@neuraweb.tech
Phone: +33 7 49 77 56 54`,
      },
      {
        title: '3. Data Collected',
        content: `We collect the following data:

**Data provided voluntarily:**
- First and last name
- Email address
- Phone number
- Company name
- Contact message

**Data collected automatically:**
- IP address (anonymized)
- Browser and device type
- Pages visited and duration
- Traffic source (via Google Analytics)`,
      },
      {
        title: '4. Processing Purposes',
        content: `Your data is processed to:

- **Respond to your requests**: processing contact forms and quote requests
- **Improve our services**: anonymous analysis of site usage
- **Commercial communication**: only with your explicit consent
- **Legal obligations**: retention of billing data`,
      },
      {
        title: '5. Legal Basis',
        content: `The processing of your data is based on:

- **Your consent**: for non-essential cookies and newsletter
- **Contract execution**: for client project management
- **Legitimate interest**: for improving our services
- **Legal obligations**: for accounting data retention`,
      },
      {
        title: '6. Retention Period',
        content: `Your data is retained for:

- **Contact data**: 3 years after last contact
- **Client data**: 10 years (accounting obligations)
- **Analytics data**: 26 months (Google Analytics)
- **Cookies**: 13 months maximum`,
      },
      {
        title: '7. Data Recipients',
        content: `Your data may be shared with:

- **Vercel Inc.**: website hosting (United States)
- **Google LLC**: analytics (United States)
- **Crisp IM**: online chat (France)
- **Resend**: transactional emails

We never sell your data to third parties.`,
      },
      {
        title: '8. International Transfers',
        content: `Some data may be transferred to the United States (Vercel, Google). These transfers are governed by:

- Standard contractual clauses of the European Commission
- EU-US Data Privacy Framework

We ensure your data receives a level of protection equivalent to GDPR.`,
      },
      {
        title: '9. Your Rights',
        content: `Under GDPR, you have the following rights:

- **Right of access**: obtain a copy of your data
- **Right to rectification**: correct inaccurate data
- **Right to erasure**: delete your data
- **Right to restriction**: restrict processing
- **Right to portability**: receive your data in a structured format
- **Right to object**: object to processing
- **Right to withdraw consent**: at any time

To exercise these rights, contact us at: **contact@neuraweb.tech**

You can also file a complaint with the French data protection authority (CNIL): https://www.cnil.fr`,
      },
      {
        title: '10. Cookies',
        content: `Our site uses cookies:

**Essential cookies (always active):**
- Language preferences
- Theme (light/dark)
- User session

**Analytics cookies (with consent):**
- Google Analytics: anonymous audience measurement

**Third-party cookies:**
- Crisp: online chat

You can manage your cookie preferences at any time through your browser settings.`,
      },
      {
        title: '11. Security',
        content: `We implement appropriate security measures:

- HTTPS encryption (TLS 1.3)
- Security headers (CSP, HSTS, X-Frame-Options)
- Restricted data access
- Regular backups
- Access monitoring`,
      },
      {
        title: '12. Changes',
        content: `This policy may be updated. We will inform you of any significant changes by email or via a notification on the site.

The last update date is indicated at the top of this page.`,
      },
      {
        title: '13. Contact',
        content: `For any questions regarding this policy or your personal data:

**Email**: contact@neuraweb.tech
**Phone**: +33 7 49 77 56 54

We commit to responding within 30 days.`,
      },
    ],
  },
  es: {
    title: 'Política de Privacidad',
    description: 'Política de privacidad y protección de datos personales de NeuraWeb.',
    backToHome: 'Volver al inicio',
    lastUpdate: 'Última actualización: Abril 2026',
    sections: [
      {
        title: '1. Introducción',
        content: `NeuraWeb (en adelante "nosotros", "nuestro" o "NeuraWeb") se compromete a proteger la privacidad de los usuarios de su sitio web https://neuraweb.tech.

Esta política de privacidad describe cómo recopilamos, usamos, almacenamos y protegemos sus datos personales de acuerdo con el Reglamento General de Protección de Datos (RGPD).`,
      },
      {
        title: '2. Responsable del tratamiento',
        content: `El responsable del tratamiento de datos es:

**NeuraWeb**
SIRET: 991 296 047 00020
Email: contact@neuraweb.tech
Teléfono: +33 7 49 77 56 54`,
      },
      {
        title: '3. Datos recopilados',
        content: `Recopilamos los siguientes datos:

**Datos proporcionados voluntariamente:**
- Nombre y apellido
- Dirección de email
- Número de teléfono
- Nombre de la empresa
- Mensaje de contacto

**Datos recopilados automáticamente:**
- Dirección IP (anonimizada)
- Tipo de navegador y dispositivo
- Páginas visitadas y duración
- Fuente de tráfico (via Google Analytics)`,
      },
      {
        title: '4. Finalidades del tratamiento',
        content: `Sus datos se procesan para:

- **Responder a sus solicitudes**: procesamiento de formularios de contacto y solicitudes de presupuesto
- **Mejorar nuestros servicios**: análisis anónimo del uso del sitio
- **Comunicación comercial**: solo con su consentimiento explícito
- **Obligaciones legales**: conservación de datos de facturación`,
      },
      {
        title: '5. Base legal',
        content: `El tratamiento de sus datos se basa en:

- **Su consentimiento**: para cookies no esenciales y newsletter
- **Ejecución de contrato**: para la gestión de proyectos de clientes
- **Interés legítimo**: para mejorar nuestros servicios
- **Obligaciones legales**: para la conservación de datos contables`,
      },
      {
        title: '6. Período de conservación',
        content: `Sus datos se conservan durante:

- **Datos de contacto**: 3 años después del último contacto
- **Datos de clientes**: 10 años (obligaciones contables)
- **Datos de análisis**: 26 meses (Google Analytics)
- **Cookies**: 13 meses máximo`,
      },
      {
        title: '7. Destinatarios de los datos',
        content: `Sus datos pueden compartirse con:

- **Vercel Inc.**: alojamiento del sitio (Estados Unidos)
- **Google LLC**: analytics (Estados Unidos)
- **Crisp IM**: chat en línea (Francia)
- **Resend**: emails transaccionales

Nunca vendemos sus datos a terceros.`,
      },
      {
        title: '8. Transferencias internacionales',
        content: `Algunos datos pueden transferirse a Estados Unidos (Vercel, Google). Estas transferencias están regidas por:

- Cláusulas contractuales tipo de la Comisión Europea
- Marco de Privacidad de Datos UE-EE.UU.

Nos aseguramos de que sus datos reciban un nivel de protección equivalente al RGPD.`,
      },
      {
        title: '9. Sus derechos',
        content: `Según el RGPD, usted tiene los siguientes derechos:

- **Derecho de acceso**: obtener una copia de sus datos
- **Derecho de rectificación**: corregir datos inexactos
- **Derecho de supresión**: eliminar sus datos
- **Derecho de limitación**: restringir el tratamiento
- **Derecho de portabilidad**: recibir sus datos en formato estructurado
- **Derecho de oposición**: oponerse al tratamiento
- **Derecho a retirar el consentimiento**: en cualquier momento

Para ejercer estos derechos, contáctenos en: **contact@neuraweb.tech**`,
      },
      {
        title: '10. Cookies',
        content: `Nuestro sitio utiliza cookies:

**Cookies esenciales (siempre activas):**
- Preferencias de idioma
- Tema (claro/oscuro)
- Sesión de usuario

**Cookies de análisis (con consentimiento):**
- Google Analytics: medición de audiencia anónima

**Cookies de terceros:**
- Crisp: chat en línea

Puede gestionar sus preferencias de cookies en cualquier momento a través de la configuración de su navegador.`,
      },
      {
        title: '11. Seguridad',
        content: `Implementamos medidas de seguridad apropiadas:

- Cifrado HTTPS (TLS 1.3)
- Headers de seguridad (CSP, HSTS, X-Frame-Options)
- Acceso restringido a datos
- Copias de seguridad regulares
- Monitoreo de accesos`,
      },
      {
        title: '12. Modificaciones',
        content: `Esta política puede actualizarse. Le informaremos de cualquier cambio significativo por email o mediante una notificación en el sitio.

La fecha de última actualización se indica en la parte superior de esta página.`,
      },
      {
        title: '13. Contacto',
        content: `Para cualquier pregunta sobre esta política o sus datos personales:

**Email**: contact@neuraweb.tech
**Teléfono**: +33 7 49 77 56 54

Nos comprometemos a responder en un plazo de 30 días.`,
      },
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const language = (lang as 'fr' | 'en' | 'es') || 'fr';
  const baseUrl = 'https://neuraweb.tech';
  const content = CONTENT[language] || CONTENT.fr;

  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/confidentialite`,
      languages: {
        fr: `${baseUrl}/fr/confidentialite`,
        en: `${baseUrl}/en/confidentialite`,
        es: `${baseUrl}/es/confidentialite`,
        'x-default': `${baseUrl}/fr/confidentialite`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ConfidentialitePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const language = (lang as 'fr' | 'en' | 'es') || 'fr';
  const content = CONTENT[language] || CONTENT.fr;

  // Breadcrumb pour navigation SERP
  const breadcrumbData = generateBreadcrumbSchema([
    { name: language === 'fr' ? 'Accueil' : language === 'es' ? 'Inicio' : 'Home', url: `/${lang}` },
    { name: content.title, url: `/${lang}/confidentialite` },
  ]);

  return (
    <>
      <JsonLd id="breadcrumb-schema" data={breadcrumbData} />
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Back link */}
          <LocalizedLink
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {content.backToHome}
          </LocalizedLink>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent">
            {content.title}
          </h1>

          {/* Last update */}
          <p className="text-sm text-muted-foreground mb-8">
            {content.lastUpdate}
          </p>

          {/* Content */}
          <div className="space-y-6">
            {content.sections.map((section, index) => (
              <section key={index} className="bg-card rounded-2xl p-6 border border-border/50">
                <h2 className="text-xl font-semibold mb-4 text-foreground">
                  {section.title}
                </h2>
                <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
