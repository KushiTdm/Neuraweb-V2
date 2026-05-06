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
    title: 'Conditions Générales d\'Utilisation',
    description: 'Conditions générales d\'utilisation du site NeuraWeb et des services proposés.',
    backToHome: 'Retour à l\'accueil',
    lastUpdate: 'Dernière mise à jour : Avril 2026',
    sections: [
      {
        title: '1. Objet',
        content: `Les présentes Conditions Générales d'Utilisation (CGU) définissent les modalités d'accès et d'utilisation du site https://neuraweb.tech (ci-après "le Site") édité par NeuraWeb.

En accédant au Site, vous acceptez sans réserve les présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le Site.`,
      },
      {
        title: '2. Accès au site',
        content: `Le Site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet.

NeuraWeb met tout en œuvre pour assurer un accès permanent au Site. Toutefois, l'accès peut être interrompu pour maintenance, mise à jour ou pour toute autre raison technique.

NeuraWeb ne saurait être tenu responsable des dommages résultant de l'indisponibilité du Site.`,
      },
      {
        title: '3. Services proposés',
        content: `NeuraWeb propose via son Site :

- **Informations** sur ses services de développement web, intégration IA et automatisation
- **Formulaire de contact** pour les demandes de devis et renseignements
- **Chat en ligne** pour une assistance en temps réel
- **Blog** avec des articles sur le développement web et l'intelligence artificielle
- **Chatbot IA** pour répondre aux questions fréquentes

Ces services sont fournis à titre informatif et ne constituent pas un engagement contractuel.`,
      },
      {
        title: '4. Propriété intellectuelle',
        content: `L'ensemble des éléments du Site (textes, images, logos, icônes, code source, etc.) est protégé par les lois relatives à la propriété intellectuelle.

Ces éléments sont la propriété exclusive de NeuraWeb sauf mention contraire.

Toute reproduction, modification, distribution ou exploitation sans autorisation préalable est interdite et passible de poursuites judiciaires.

**Vous pouvez :**
- Consulter le Site pour un usage personnel
- Partager les liens vers nos pages

**Vous ne pouvez pas :**
- Copier le contenu à des fins commerciales
- Modifier ou adapter le code source
- Utiliser notre logo sans autorisation`,
      },
      {
        title: '5. Responsabilités de l\'utilisateur',
        content: `En utilisant le Site, vous vous engagez à :

- Fournir des informations exactes et complètes dans les formulaires
- Ne pas usurper l'identité d'un tiers
- Ne pas diffuser de contenu illicite, diffamatoire ou offensant
- Ne pas tenter de perturber le fonctionnement du Site
- Ne pas utiliser le chatbot de manière abusive
- Respecter les droits de propriété intellectuelle

Toute violation de ces engagements peut entraîner la suspension de l'accès au Site.`,
      },
      {
        title: '6. Limitation de responsabilité',
        content: `NeuraWeb s'efforce de fournir des informations exactes et à jour. Toutefois, NeuraWeb ne garantit pas l'exactitude, l'exhaustivité ou l'actualité des informations diffusées sur le Site.

**NeuraWeb ne saurait être tenu responsable :**
- Des erreurs ou omissions dans le contenu du Site
- Des dommages résultant de l'utilisation du Site
- Du contenu des sites tiers accessibles via des liens
- Des interruptions ou dysfonctionnements du Site
- Des réponses fournies par le chatbot IA

L'utilisation du Site se fait sous votre entière responsabilité.`,
      },
      {
        title: '7. Liens hypertextes',
        content: `Le Site peut contenir des liens vers des sites tiers. NeuraWeb n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.

La présence de ces liens ne signifie pas que NeuraWeb approuve ou recommande ces sites.

Vous êtes libre de créer un lien vers notre Site, à condition que ce lien ne porte pas atteinte à notre image ou réputation.`,
      },
      {
        title: '8. Données personnelles',
        content: `La collecte et le traitement de vos données personnelles sont régis par notre Politique de Confidentialité, accessible à l'adresse : /fr/confidentialite

En utilisant le Site, vous consentez à la collecte et au traitement de vos données conformément à cette politique.`,
      },
      {
        title: '9. Cookies',
        content: `Le Site utilise des cookies pour améliorer votre expérience de navigation et analyser le trafic.

Pour plus d'informations sur les cookies utilisés, consultez notre Politique de Confidentialité.

Vous pouvez configurer votre navigateur pour refuser les cookies, mais certaines fonctionnalités du Site pourraient ne plus fonctionner correctement.`,
      },
      {
        title: '10. Modification des CGU',
        content: `NeuraWeb se réserve le droit de modifier les présentes CGU à tout moment.

Les modifications entrent en vigueur dès leur publication sur le Site. Nous vous encourageons à consulter régulièrement cette page.

Votre utilisation du Site après modification vaut acceptation des nouvelles CGU.`,
      },
      {
        title: '11. Droit applicable et juridiction',
        content: `Les présentes CGU sont régies par le droit français.

En cas de litige, et après tentative de résolution amiable, les tribunaux français seront seuls compétents.

Pour toute réclamation, vous pouvez nous contacter à : contact@neuraweb.tech`,
      },
      {
        title: '12. Contact',
        content: `Pour toute question relative aux présentes CGU :

**NeuraWeb**
Email : contact@neuraweb.tech
Téléphone : +33 7 49 77 56 54

Nous nous efforçons de répondre dans un délai de 48 heures ouvrées.`,
      },
    ],
  },
  en: {
    title: 'Terms of Use',
    description: 'Terms of use for the NeuraWeb website and services offered.',
    backToHome: 'Back to home',
    lastUpdate: 'Last updated: April 2026',
    sections: [
      {
        title: '1. Purpose',
        content: `These Terms of Use define the terms and conditions for accessing and using the website https://neuraweb.tech (hereinafter "the Site") published by NeuraWeb.

By accessing the Site, you accept these Terms without reservation. If you do not accept these terms, please do not use the Site.`,
      },
      {
        title: '2. Site Access',
        content: `The Site is freely accessible to any user with Internet access.

NeuraWeb makes every effort to ensure permanent access to the Site. However, access may be interrupted for maintenance, updates, or any other technical reason.

NeuraWeb cannot be held responsible for damages resulting from the unavailability of the Site.`,
      },
      {
        title: '3. Services Offered',
        content: `NeuraWeb offers through its Site:

- **Information** about its web development, AI integration, and automation services
- **Contact form** for quote requests and inquiries
- **Live chat** for real-time assistance
- **Blog** with articles about web development and artificial intelligence
- **AI Chatbot** to answer frequently asked questions

These services are provided for informational purposes and do not constitute a contractual commitment.`,
      },
      {
        title: '4. Intellectual Property',
        content: `All elements of the Site (texts, images, logos, icons, source code, etc.) are protected by intellectual property laws.

These elements are the exclusive property of NeuraWeb unless otherwise stated.

Any reproduction, modification, distribution, or exploitation without prior authorization is prohibited and may result in legal action.

**You may:**
- Browse the Site for personal use
- Share links to our pages

**You may not:**
- Copy content for commercial purposes
- Modify or adapt the source code
- Use our logo without authorization`,
      },
      {
        title: '5. User Responsibilities',
        content: `By using the Site, you agree to:

- Provide accurate and complete information in forms
- Not impersonate a third party
- Not distribute illegal, defamatory, or offensive content
- Not attempt to disrupt the operation of the Site
- Not abuse the chatbot
- Respect intellectual property rights

Any violation of these commitments may result in suspension of access to the Site.`,
      },
      {
        title: '6. Limitation of Liability',
        content: `NeuraWeb strives to provide accurate and up-to-date information. However, NeuraWeb does not guarantee the accuracy, completeness, or timeliness of information on the Site.

**NeuraWeb cannot be held responsible for:**
- Errors or omissions in Site content
- Damages resulting from use of the Site
- Content of third-party sites accessible via links
- Interruptions or malfunctions of the Site
- Responses provided by the AI chatbot

Use of the Site is at your own risk.`,
      },
      {
        title: '7. Hyperlinks',
        content: `The Site may contain links to third-party sites. NeuraWeb has no control over these sites and disclaims any responsibility for their content.

The presence of these links does not mean that NeuraWeb approves or recommends these sites.

You are free to create a link to our Site, provided that it does not damage our image or reputation.`,
      },
      {
        title: '8. Personal Data',
        content: `The collection and processing of your personal data are governed by our Privacy Policy, available at: /en/confidentialite

By using the Site, you consent to the collection and processing of your data in accordance with this policy.`,
      },
      {
        title: '9. Cookies',
        content: `The Site uses cookies to improve your browsing experience and analyze traffic.

For more information about cookies used, see our Privacy Policy.

You can configure your browser to refuse cookies, but some features of the Site may no longer work properly.`,
      },
      {
        title: '10. Modification of Terms',
        content: `NeuraWeb reserves the right to modify these Terms at any time.

Changes take effect upon publication on the Site. We encourage you to regularly review this page.

Your use of the Site after modification constitutes acceptance of the new Terms.`,
      },
      {
        title: '11. Applicable Law and Jurisdiction',
        content: `These Terms are governed by French law.

In case of dispute, and after an attempt at amicable resolution, French courts shall have sole jurisdiction.

For any complaints, you can contact us at: contact@neuraweb.tech`,
      },
      {
        title: '12. Contact',
        content: `For any questions regarding these Terms:

**NeuraWeb**
Email: contact@neuraweb.tech
Phone: +33 7 49 77 56 54

We strive to respond within 48 business hours.`,
      },
    ],
  },
  es: {
    title: 'Condiciones de Uso',
    description: 'Condiciones de uso del sitio web NeuraWeb y servicios ofrecidos.',
    backToHome: 'Volver al inicio',
    lastUpdate: 'Última actualización: Abril 2026',
    sections: [
      {
        title: '1. Objeto',
        content: `Estas Condiciones de Uso definen los términos y condiciones de acceso y uso del sitio web https://neuraweb.tech (en adelante "el Sitio") publicado por NeuraWeb.

Al acceder al Sitio, acepta estas Condiciones sin reservas. Si no acepta estas condiciones, por favor no utilice el Sitio.`,
      },
      {
        title: '2. Acceso al sitio',
        content: `El Sitio es accesible gratuitamente para cualquier usuario con acceso a Internet.

NeuraWeb hace todo lo posible para garantizar un acceso permanente al Sitio. Sin embargo, el acceso puede interrumpirse por mantenimiento, actualizaciones o cualquier otra razón técnica.

NeuraWeb no será responsable de los daños resultantes de la indisponibilidad del Sitio.`,
      },
      {
        title: '3. Servicios ofrecidos',
        content: `NeuraWeb ofrece a través de su Sitio:

- **Información** sobre sus servicios de desarrollo web, integración de IA y automatización
- **Formulario de contacto** para solicitudes de presupuesto y consultas
- **Chat en vivo** para asistencia en tiempo real
- **Blog** con artículos sobre desarrollo web e inteligencia artificial
- **Chatbot IA** para responder preguntas frecuentes

Estos servicios se proporcionan con fines informativos y no constituyen un compromiso contractual.`,
      },
      {
        title: '4. Propiedad intelectual',
        content: `Todos los elementos del Sitio (textos, imágenes, logotipos, iconos, código fuente, etc.) están protegidos por las leyes de propiedad intelectual.

Estos elementos son propiedad exclusiva de NeuraWeb, salvo indicación contraria.

Cualquier reproducción, modificación, distribución o explotación sin autorización previa está prohibida y puede dar lugar a acciones legales.

**Puede:**
- Navegar por el Sitio para uso personal
- Compartir enlaces a nuestras páginas

**No puede:**
- Copiar contenido con fines comerciales
- Modificar o adaptar el código fuente
- Usar nuestro logotipo sin autorización`,
      },
      {
        title: '5. Responsabilidades del usuario',
        content: `Al usar el Sitio, se compromete a:

- Proporcionar información exacta y completa en los formularios
- No suplantar la identidad de un tercero
- No difundir contenido ilegal, difamatorio u ofensivo
- No intentar perturbar el funcionamiento del Sitio
- No abusar del chatbot
- Respetar los derechos de propiedad intelectual

Cualquier violación de estos compromisos puede resultar en la suspensión del acceso al Sitio.`,
      },
      {
        title: '6. Limitación de responsabilidad',
        content: `NeuraWeb se esfuerza por proporcionar información exacta y actualizada. Sin embargo, NeuraWeb no garantiza la exactitud, integridad o actualidad de la información del Sitio.

**NeuraWeb no será responsable de:**
- Errores u omisiones en el contenido del Sitio
- Daños resultantes del uso del Sitio
- Contenido de sitios de terceros accesibles mediante enlaces
- Interrupciones o mal funcionamiento del Sitio
- Respuestas proporcionadas por el chatbot IA

El uso del Sitio es bajo su propio riesgo.`,
      },
      {
        title: '7. Enlaces',
        content: `El Sitio puede contener enlaces a sitios de terceros. NeuraWeb no tiene control sobre estos sitios y declina cualquier responsabilidad por su contenido.

La presencia de estos enlaces no significa que NeuraWeb apruebe o recomiende estos sitios.

Es libre de crear un enlace a nuestro Sitio, siempre que no dañe nuestra imagen o reputación.`,
      },
      {
        title: '8. Datos personales',
        content: `La recopilación y el tratamiento de sus datos personales se rigen por nuestra Política de Privacidad, disponible en: /es/confidentialite

Al usar el Sitio, consiente la recopilación y el tratamiento de sus datos de acuerdo con esta política.`,
      },
      {
        title: '9. Cookies',
        content: `El Sitio utiliza cookies para mejorar su experiencia de navegación y analizar el tráfico.

Para más información sobre las cookies utilizadas, consulte nuestra Política de Privacidad.

Puede configurar su navegador para rechazar las cookies, pero algunas funcionalidades del Sitio podrían dejar de funcionar correctamente.`,
      },
      {
        title: '10. Modificación de las condiciones',
        content: `NeuraWeb se reserva el derecho de modificar estas Condiciones en cualquier momento.

Los cambios entran en vigor desde su publicación en el Sitio. Le animamos a consultar regularmente esta página.

Su uso del Sitio después de la modificación constituye la aceptación de las nuevas Condiciones.`,
      },
      {
        title: '11. Derecho aplicable y jurisdicción',
        content: `Estas Condiciones se rigen por el derecho francés.

En caso de litigio, y tras un intento de resolución amistosa, los tribunales franceses serán los únicos competentes.

Para cualquier reclamación, puede contactarnos en: contact@neuraweb.tech`,
      },
      {
        title: '12. Contacto',
        content: `Para cualquier pregunta sobre estas Condiciones:

**NeuraWeb**
Email: contact@neuraweb.tech
Teléfono: +33 7 49 77 56 54

Nos esforzamos por responder en un plazo de 48 horas hábiles.`,
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
      canonical: `${baseUrl}/${lang}/conditions-utilisation`,
      languages: {
        fr: `${baseUrl}/fr/conditions-utilisation`,
        en: `${baseUrl}/en/conditions-utilisation`,
        es: `${baseUrl}/es/conditions-utilisation`,
        'x-default': `${baseUrl}/fr/conditions-utilisation`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ConditionsUtilisationPage({
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
    { name: content.title, url: `/${lang}/conditions-utilisation` },
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
