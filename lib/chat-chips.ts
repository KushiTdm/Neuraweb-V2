// Boutons de relance du chatbot (libellés par langue). Module léger : importé aussi côté client.
// Chaque libellé est une vraie question qui déclenche l'entrée FAQ du même identifiant (lib/chat-faq.ts).
export type ChipLang = 'fr' | 'en' | 'es' | 'vi';
type L4 = Record<ChipLang, string>;

export const CHIP_LABELS: Record<string, L4> = {
  pricing: { fr: 'Combien coûte un site ?', en: 'How much does a website cost?', es: '¿Cuánto cuesta un sitio web?', vi: 'Làm website giá bao nhiêu?' },
  quote: { fr: 'Demander un devis', en: 'Request a quote', es: 'Pedir un presupuesto', vi: 'Yêu cầu báo giá' },
  delays: { fr: 'Quels sont les délais ?', en: 'How long does it take?', es: '¿Cuáles son los plazos?', vi: 'Thời gian thực hiện bao lâu?' },
  ownership: { fr: 'À qui appartient le code ?', en: 'Who owns the code?', es: '¿Quién es el propietario del código?', vi: 'Ai sở hữu mã nguồn?' },
  payment: { fr: 'Comment se passe le paiement ?', en: 'How does payment work?', es: '¿Cómo es el pago?', vi: 'Thanh toán như thế nào?' },
  where: { fr: 'Où êtes-vous basés ?', en: 'Where are you based?', es: '¿Dónde están ubicados?', vi: 'Bạn đặt trụ sở ở đâu?' },
  demo: { fr: 'Voir une démo', en: 'See a demo', es: 'Ver una demo', vi: 'Xem bản demo' },
  subcontracting: { fr: 'Je suis une agence', en: 'I run an agency', es: 'Soy una agencia', vi: 'Tôi là một agency' },
  maintenance: { fr: 'Et la maintenance ?', en: 'What about maintenance?', es: '¿Y el mantenimiento?', vi: 'Còn bảo trì thì sao?' },
  reviews: { fr: 'Avez-vous des avis clients ?', en: 'Do you have client reviews?', es: '¿Tienen opiniones de clientes?', vi: 'Bạn có đánh giá của khách hàng không?' },
  wordpress: { fr: 'Next.js ou WordPress ?', en: 'Next.js or WordPress?', es: '¿Next.js o WordPress?', vi: 'Next.js hay WordPress?' },
  team: { fr: 'Qui êtes-vous ?', en: 'Who are you?', es: '¿Quiénes son?', vi: 'Các bạn là ai?' },
  services: { fr: 'Que proposez-vous ?', en: 'What do you offer?', es: '¿Qué ofrecen?', vi: 'Bạn cung cấp dịch vụ gì?' },
  restaurant: { fr: 'Je suis restaurateur', en: 'I run a restaurant', es: 'Soy restaurador', vi: 'Tôi có nhà hàng' },
  sante: { fr: 'Je suis professionnel de santé', en: 'I am a healthcare professional', es: 'Soy profesional sanitario', vi: 'Tôi làm trong ngành y tế' },
  collectivite: { fr: 'Je représente une mairie', en: 'I represent a local authority', es: 'Represento a un ayuntamiento', vi: 'Tôi đại diện một cơ quan địa phương' },
};

/** Boutons proposés à l'ouverture du chat et après une réponse libre du modèle. */
export const DEFAULT_CHIPS = ['pricing', 'delays', 'ownership', 'where', 'demo', 'subcontracting'];

