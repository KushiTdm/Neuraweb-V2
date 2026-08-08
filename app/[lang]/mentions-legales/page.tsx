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
    title: 'Mentions Légales',
    description: 'Mentions légales et informations juridiques de NeuraWeb, agence web française spécialisée en développement Next.js, intégration IA et automatisation.',
    backToHome: 'Retour à l\'accueil',
    sections: {
      editor: {
        title: '1. Éditeur du site',
        content: `
Le site https://neuraweb.fr est édité par :

**NeuraWeb**
Micro-entreprise
SIRET : 991 296 047 00020

**Contact :**
- Email : contact@neuraweb.fr

**Directeur de la publication :** NeuraWeb
        `,
      },
      hosting: {
        title: '2. Hébergement',
        content: `
Le site est hébergé par :

**Vercel Inc.**
440 N Barranca Ave #4133
Covina, CA 91723
États-Unis

Site web : https://vercel.com
        `,
      },
      intellectual: {
        title: '3. Propriété intellectuelle',
        content: `
L'ensemble du contenu du site (textes, images, graphismes, logo, icônes, etc.) est la propriété exclusive de NeuraWeb, sauf mention contraire.

Toute reproduction, représentation, modification, publication, transmission ou dénaturation, totale ou partielle du site ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit, est interdite sans l'autorisation écrite préalable de NeuraWeb.

Toute exploitation non autorisée du site ou de son contenu serait constitutive d'une contrefaçon et sanctionnée conformément aux articles L.335-2 et suivants du Code de la Propriété Intellectuelle.
        `,
      },
      data: {
        title: '4. Données personnelles',
        content: `
Les informations recueillies via les formulaires du site font l'objet d'un traitement informatique destiné à répondre à vos demandes.

Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données.

Pour exercer ces droits ou pour toute question relative à vos données personnelles, contactez-nous à : contact@neuraweb.fr

Pour plus d'informations, consultez notre [Politique de Confidentialité](/fr/confidentialite).
        `,
      },
      cookies: {
        title: '5. Cookies',
        content: `
Le site utilise des cookies techniques nécessaires à son bon fonctionnement et des cookies d'analyse (Google Analytics) pour mesurer l'audience.

Vous pouvez configurer votre navigateur pour refuser les cookies. Cependant, certaines fonctionnalités du site pourraient ne plus être disponibles.
        `,
      },
      responsibility: {
        title: '6. Limitation de responsabilité',
        content: `
NeuraWeb s'efforce de fournir des informations aussi précises que possible. Toutefois, NeuraWeb ne pourra être tenue responsable des omissions, des inexactitudes et des carences dans la mise à jour, qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.

NeuraWeb décline toute responsabilité en cas de problèmes techniques rencontrés par l'utilisateur lors de sa navigation sur le site.
        `,
      },
      law: {
        title: '7. Droit applicable',
        content: `
Le présent site et ses mentions légales sont soumis au droit français.

En cas de litige, et après l'échec de toute tentative de recherche d'une solution amiable, les tribunaux français seront seuls compétents.
        `,
      },
      update: {
        title: '8. Mise à jour',
        content: `
Les présentes mentions légales peuvent être modifiées à tout moment. Nous vous invitons à les consulter régulièrement.

**Dernière mise à jour :** Avril 2026
        `,
      },
    },
  },
  en: {
    title: 'Legal Notice',
    description: 'Legal notice and company information for NeuraWeb, a French web agency specializing in Next.js development, AI integration and workflow automation.',
    backToHome: 'Back to home',
    sections: {
      editor: {
        title: '1. Website Publisher',
        content: `
The website https://neuraweb.fr is published by:

**NeuraWeb**
Micro-enterprise (French sole proprietorship)
SIRET: 991 296 047 00020
Address: Lille, Hauts-de-France, France

**Contact:**
- Email: contact@neuraweb.fr
- Phone: +33 7 49 77 56 54

**Publication Director:** NeuraWeb
        `,
      },
      hosting: {
        title: '2. Hosting',
        content: `
The website is hosted by:

**Vercel Inc.**
440 N Barranca Ave #4133
Covina, CA 91723
United States

Website: https://vercel.com
        `,
      },
      intellectual: {
        title: '3. Intellectual Property',
        content: `
All content on this website (texts, images, graphics, logo, icons, etc.) is the exclusive property of NeuraWeb, unless otherwise stated.

Any reproduction, representation, modification, publication, transmission, or distortion of the site or its content, whether in whole or in part, by any means and on any medium, is prohibited without prior written authorization from NeuraWeb.

Any unauthorized use of the site or its content would constitute infringement and be sanctioned in accordance with articles L.335-2 et seq. of the French Intellectual Property Code.
        `,
      },
      data: {
        title: '4. Personal Data',
        content: `
Information collected through website forms is processed to respond to your requests.

In accordance with the General Data Protection Regulation (GDPR), you have the right to access, rectify, delete, and transfer your data.

To exercise these rights or for any questions about your personal data, contact us at: contact@neuraweb.fr

For more information, see our [Privacy Policy](/en/confidentialite).
        `,
      },
      cookies: {
        title: '5. Cookies',
        content: `
This website uses technical cookies necessary for its proper functioning and analytics cookies (Google Analytics) to measure audience.

You can configure your browser to refuse cookies. However, some features of the site may no longer be available.
        `,
      },
      responsibility: {
        title: '6. Limitation of Liability',
        content: `
NeuraWeb strives to provide information as accurate as possible. However, NeuraWeb cannot be held responsible for omissions, inaccuracies, or deficiencies in updates, whether caused by itself or by third-party partners providing this information.

NeuraWeb disclaims any responsibility for technical problems encountered by users while browsing the site.
        `,
      },
      law: {
        title: '7. Applicable Law',
        content: `
This website and its legal notices are subject to French law.

In case of dispute, and after the failure of any attempt to find an amicable solution, French courts shall have sole jurisdiction.
        `,
      },
      update: {
        title: '8. Updates',
        content: `
These legal notices may be modified at any time. We invite you to consult them regularly.

**Last updated:** April 2026
        `,
      },
    },
  },
  es: {
    title: 'Aviso Legal',
    description: 'Aviso legal e información jurídica de NeuraWeb, agencia web francesa especializada en desarrollo Next.js, integración de IA y automatización de procesos.',
    backToHome: 'Volver al inicio',
    sections: {
      editor: {
        title: '1. Editor del sitio',
        content: `
El sitio https://neuraweb.fr es editado por:

**NeuraWeb**
Microempresa (autónomo francés)
SIRET: 991 296 047 00020
Dirección: Lille, Hauts-de-France, Francia

**Contacto:**
- Email: contact@neuraweb.fr
- Teléfono: +33 7 49 77 56 54

**Director de publicación:** NeuraWeb
        `,
      },
      hosting: {
        title: '2. Alojamiento',
        content: `
El sitio está alojado por:

**Vercel Inc.**
440 N Barranca Ave #4133
Covina, CA 91723
Estados Unidos

Sitio web: https://vercel.com
        `,
      },
      intellectual: {
        title: '3. Propiedad intelectual',
        content: `
Todo el contenido del sitio (textos, imágenes, gráficos, logotipo, iconos, etc.) es propiedad exclusiva de NeuraWeb, salvo indicación contraria.

Cualquier reproducción, representación, modificación, publicación, transmisión o desnaturalización del sitio o su contenido, total o parcial, por cualquier medio y en cualquier soporte, está prohibida sin la autorización escrita previa de NeuraWeb.
        `,
      },
      data: {
        title: '4. Datos personales',
        content: `
La información recopilada a través de los formularios del sitio se procesa para responder a sus solicitudes.

De acuerdo con el Reglamento General de Protección de Datos (RGPD), usted tiene derecho de acceso, rectificación, supresión y portabilidad de sus datos.

Para ejercer estos derechos o para cualquier pregunta sobre sus datos personales, contáctenos en: contact@neuraweb.fr

Para más información, consulte nuestra [Política de Privacidad](/es/confidentialite).
        `,
      },
      cookies: {
        title: '5. Cookies',
        content: `
Este sitio utiliza cookies técnicas necesarias para su correcto funcionamiento y cookies de análisis (Google Analytics) para medir la audiencia.

Puede configurar su navegador para rechazar las cookies. Sin embargo, algunas funcionalidades del sitio podrían dejar de estar disponibles.
        `,
      },
      responsibility: {
        title: '6. Limitación de responsabilidad',
        content: `
NeuraWeb se esfuerza por proporcionar información lo más precisa posible. Sin embargo, NeuraWeb no será responsable de omisiones, inexactitudes o deficiencias en las actualizaciones.

NeuraWeb declina toda responsabilidad por problemas técnicos encontrados por el usuario durante su navegación en el sitio.
        `,
      },
      law: {
        title: '7. Derecho aplicable',
        content: `
Este sitio y sus avisos legales están sujetos al derecho francés.

En caso de litigio, y tras el fracaso de cualquier intento de encontrar una solución amistosa, los tribunales franceses serán los únicos competentes.
        `,
      },
      update: {
        title: '8. Actualización',
        content: `
Estos avisos legales pueden ser modificados en cualquier momento. Le invitamos a consultarlos regularmente.

**Última actualización:** Abril 2026
        `,
      },
    },
  },
  vi: {
    title: 'Thông tin pháp lý',
    description: 'Thông tin pháp lý và thông tin doanh nghiệp của NeuraWeb — công ty Pháp chuyên thiết kế website Next.js, tích hợp AI và tự động hóa quy trình.',
    backToHome: 'Về trang chủ',
    sections: {
      editor: {
        title: '1. Đơn vị vận hành website',
        content: `
Website https://neuraweb.fr được vận hành bởi:

**NeuraWeb**
Micro-entreprise (doanh nghiệp cá thể theo pháp luật Pháp)
SIRET : 991 296 047 00020

**Liên hệ:**
- Email: contact@neuraweb.fr

**Người chịu trách nhiệm nội dung:** NeuraWeb
        `,
      },
      hosting: {
        title: '2. Đơn vị lưu trữ (hosting)',
        content: `
Website được lưu trữ tại:

**Vercel Inc.**
440 N Barranca Ave #4133
Covina, CA 91723
Hoa Kỳ

Website: https://vercel.com
        `,
      },
      intellectual: {
        title: '3. Quyền sở hữu trí tuệ',
        content: `
Toàn bộ nội dung của website (văn bản, hình ảnh, đồ họa, logo, biểu tượng...) thuộc quyền sở hữu độc quyền của NeuraWeb, trừ khi có ghi chú khác.

Mọi hành vi sao chép, trình bày lại, chỉnh sửa, xuất bản, truyền tải hoặc làm sai lệch một phần hay toàn bộ website và nội dung của website, bằng bất kỳ phương thức và trên bất kỳ phương tiện nào, đều bị nghiêm cấm nếu chưa có sự đồng ý trước bằng văn bản của NeuraWeb.

Việc khai thác website hoặc nội dung website mà không được phép sẽ bị coi là hành vi xâm phạm quyền sở hữu trí tuệ và bị xử lý theo Điều L.335-2 và các điều tiếp theo của Bộ luật Sở hữu trí tuệ Pháp.
        `,
      },
      data: {
        title: '4. Dữ liệu cá nhân',
        content: `
Thông tin bạn cung cấp qua các biểu mẫu trên website được xử lý nhằm mục đích phản hồi yêu cầu của bạn.

Theo Quy định chung về bảo vệ dữ liệu của châu Âu (GDPR — tại Pháp gọi là RGPD) và Luật Tin học và Quyền tự do của Pháp, bạn có quyền truy cập, chỉnh sửa, xóa và di chuyển dữ liệu cá nhân của mình.

Nếu bạn ở Việt Nam, chúng tôi cũng tham chiếu tinh thần của Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân: dữ liệu chỉ được thu thập trong phạm vi cần thiết, được thông báo rõ mục đích và không bị chia sẻ ngoài phạm vi bạn đồng ý.

Để thực hiện các quyền trên hoặc với bất kỳ câu hỏi nào liên quan đến dữ liệu cá nhân, vui lòng liên hệ: contact@neuraweb.fr

Thông tin chi tiết có trong [Chính sách bảo mật](/vi/confidentialite) của chúng tôi.
        `,
      },
      cookies: {
        title: '5. Cookie',
        content: `
Website sử dụng cookie kỹ thuật cần thiết cho hoạt động của trang và cookie phân tích (Google Analytics) để đo lường lượng truy cập.

Bạn có thể thiết lập trình duyệt để từ chối cookie. Tuy nhiên, khi đó một số tính năng của website có thể không hoạt động đầy đủ.
        `,
      },
      responsibility: {
        title: '6. Giới hạn trách nhiệm',
        content: `
NeuraWeb luôn cố gắng cung cấp thông tin chính xác nhất có thể. Tuy nhiên, NeuraWeb không chịu trách nhiệm đối với các thiếu sót, sai lệch hoặc chậm cập nhật thông tin, dù xuất phát từ NeuraWeb hay từ các đối tác cung cấp thông tin đó.

NeuraWeb cũng không chịu trách nhiệm về các sự cố kỹ thuật mà người dùng có thể gặp phải trong quá trình truy cập website.
        `,
      },
      law: {
        title: '7. Luật áp dụng',
        content: `
Website này và các thông tin pháp lý nêu trên chịu sự điều chỉnh của pháp luật Pháp, do NeuraWeb là doanh nghiệp được thành lập theo pháp luật Pháp.

Trong trường hợp phát sinh tranh chấp, sau khi các bên đã nỗ lực thương lượng nhưng không đạt được thỏa thuận, tòa án Pháp sẽ là cơ quan có thẩm quyền giải quyết.
        `,
      },
      update: {
        title: '8. Cập nhật',
        content: `
Các thông tin pháp lý này có thể được sửa đổi bất cứ lúc nào. Chúng tôi khuyến khích bạn xem lại định kỳ.

**Cập nhật lần cuối:** Tháng 4 năm 2026
        `,
      },
    },
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const language = (lang as 'fr' | 'en' | 'es' | 'vi') || 'fr';
  const baseUrl = 'https://neuraweb.fr';
  const content = CONTENT[language] || CONTENT.fr;

  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/mentions-legales`,
      languages: {
        fr: `${baseUrl}/fr/mentions-legales`,
        en: `${baseUrl}/en/mentions-legales`,
        es: `${baseUrl}/es/mentions-legales`,
        vi: `${baseUrl}/vi/mentions-legales`,
        'x-default': `${baseUrl}/fr/mentions-legales`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function MentionsLegalesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const language = (lang as 'fr' | 'en' | 'es' | 'vi') || 'fr';
  const content = CONTENT[language] || CONTENT.fr;

  // Breadcrumb pour navigation SERP
  const breadcrumbData = generateBreadcrumbSchema([
    { name: language === 'fr' ? 'Accueil' : language === 'es' ? 'Inicio' : 'Home', url: `/${lang}` },
    { name: content.title, url: `/${lang}/mentions-legales` },
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
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent">
            {content.title}
          </h1>

          {/* Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            {Object.values(content.sections).map((section, index) => (
              <section key={index} className="bg-card rounded-2xl p-6 border border-border/50">
                <h2 className="text-xl font-semibold mb-4 text-foreground">
                  {section.title}
                </h2>
                <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {section.content.split(/\[([^\]]+)\]\(([^)]+)\)/).map((part, i) => {
                    if (i % 3 === 1) {
                      // Link text
                      return null;
                    } else if (i % 3 === 2) {
                      // Link URL - render previous text as link
                      const linkText = section.content.split(/\[([^\]]+)\]\(([^)]+)\)/)[i - 1];
                      return (
                        <LocalizedLink
                          key={i}
                          href={part}
                          className="text-primary hover:underline"
                        >
                          {linkText}
                        </LocalizedLink>
                      );
                    }
                    return part;
                  })}
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
