// Couche FAQ déterministe du chatbot : réponses statiques (zéro appel API) aux questions fréquentes.
//
// Pourquoi : le modèle (ministral-3b) mélange facilement les règles d'un très long prompt. Les faits
// contractuels ou sensibles (propriété du code, paiement, localisation, prix) sont donc servis tels
// quels, sans génération. Le modèle ne traite que le reste (questions ouvertes, conseil sur mesure).
//
// Règles de contenu (voir CLAUDE.md) : tous les prix « à partir de » ; aucun montant pour le Premium,
// le Premium Santé ni Réseau / Franchise ; pas de montant en EUR en vietnamien ; aucun bureau physique ;
// aucune promesse de résultat ; aucun nom de client ; on ne dit jamais si un projet est réel ou démo.

export type FaqLang = 'fr' | 'en' | 'es' | 'vi';
type L4 = Record<FaqLang, string>;
import { CHIP_LABELS } from './chat-chips';
export { CHIP_LABELS, DEFAULT_CHIPS } from './chat-chips';

export interface FaqResult {
  id: string;
  answer: string;
  /** Identifiants des questions de relance proposées en boutons. */
  chips: string[];
  /** 'form' : ouvre le mini-formulaire de devis ; 'button' : propose le bouton « Recevoir un devis ». */
  lead?: 'form' | 'button';
}

interface FaqEntry {
  id: string;
  /** Mots/expressions (sans accents, minuscules) — correspondance par mot entier. */
  keywords: Record<FaqLang, string[]>;
  /** Si l'un de ces mots est présent, l'entrée est ignorée (laisse la main à une entrée plus précise ou au modèle). */
  unless?: string[];
  priority: number;
  answer: L4;
  chips: string[];
  lead?: 'form' | 'button';
}

export const normalizeFaq = (s: string): string =>
  s
    .toLowerCase()
    .replace(/đ/g, 'd')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’`]/g, ' ');

const esc = (kw: string) => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const hasWord = (msg: string, kw: string) => new RegExp(`(^|[^a-z0-9])${esc(kw)}($|[^a-z0-9])`).test(msg);

// ─────────────────────────────────────────────────────────────────────────────
// Entrées
// ─────────────────────────────────────────────────────────────────────────────
const SECTOR_WORDS = [
  'restaurant', 'restaurants', 'resto', 'brasserie', 'traiteur', 'sante', 'kine', 'osteo', 'medecin', 'infirmier', 'paramedical',
  'dentiste', 'mairie', 'commune', 'collectivite', 'collectivites', 'mobile', 'application', 'appli', 'app', 'chatbot', 'automatisation',
  'n8n', 'ia', 'saas', 'hds', 'ecommerce', 'e-commerce', 'boutique', 'maintenance', 'hotel',
  'healthcare', 'doctor', 'council', 'automation', 'ai', 'shop', 'store', 'salud', 'ayuntamiento', 'tienda', 'automatizacion',
  'y te', 'nha hang', 'khach san', 'ung dung', 'tu dong hoa',
];

const FAQ: FaqEntry[] = [
  // ── Prix (vue d'ensemble) ───────────────────────────────────────────────
  {
    id: 'pricing',
    priority: 3,
    keywords: {
      fr: ['prix', 'tarif', 'tarifs', 'combien', 'cout', 'couts', 'coute', 'coutent', 'budget', 'packs', 'pack', 'grille tarifaire'],
      en: ['price', 'prices', 'pricing', 'cost', 'costs', 'how much', 'budget', 'packs', 'pack', 'rates'],
      es: ['precio', 'precios', 'tarifa', 'tarifas', 'cuanto', 'cuesta', 'coste', 'costo', 'presupuesto orientativo', 'packs', 'pack'],
      // vi : le modèle gère (offre d'entrée « Landing Page Express » propre au marché vietnamien, voir le prompt)
      vi: [],
    },
    unless: [...SECTOR_WORDS, 'horaire', 'horaires', 'heure', 'hourly', 'hora'],
    answer: {
      fr: `Nos prix sont affichés et toujours « à partir de » (HT, TVA non applicable) :\n- **Starter** à partir de 1 490 € : site statique sur maquettes prédéfinies, jusqu'à 8 pages\n- **Business** à partir de 3 990 € : site avec backend + CMS, jusqu'à 20 pages\n- **Premium** : architecture sur mesure, prix défini à part sur devis gratuit\nLe paiement se fait en 3 temps (40 % / 30 % / 30 %). Voulez-vous un devis gratuit sous 48 h ouvrées ?`,
      en: `Our prices are posted and always "from" prices (excl. VAT, VAT not applicable):\n- **Starter** from €1,490: static site on predefined mockups, up to 8 pages\n- **Business** from €3,990: site with backend + CMS, up to 20 pages\n- **Premium**: tailor-made architecture, priced separately on a free quote\nPayment is in 3 steps (40% / 30% / 30%). Would you like a free quote within 48 business hours?`,
      es: `Nuestros precios son visibles y siempre «desde» (sin IVA, IVA no aplicable):\n- **Starter** desde 1 490 €: sitio estático sobre maquetas predefinidas, hasta 8 páginas\n- **Business** desde 3 990 €: sitio con backend + CMS, hasta 20 páginas\n- **Premium**: arquitectura a medida, precio definido aparte con presupuesto gratuito\nEl pago es en 3 tiempos (40 % / 30 % / 30 %). ¿Quiere un presupuesto gratuito en 48 h hábiles?`,
      vi: `Bảng giá của NeuraWeb được công khai và luôn tính theo mức « từ ». Có ba gói website: **Starter** (website tĩnh trên mẫu thiết kế có sẵn, tối đa 8 trang), **Business** (website có backend + CMS, tối đa 20 trang) và **Premium** (kiến trúc theo yêu cầu, báo giá riêng). Bạn có muốn nhận báo giá miễn phí trong vòng 48 giờ làm việc không?`,
    },
    chips: ['delays', 'quote', 'maintenance'],
    lead: 'button',
  },
  // ── Devis ───────────────────────────────────────────────────────────────
  {
    id: 'quote',
    priority: 2,
    keywords: {
      fr: ['devis', 'estimation', 'proposition commerciale', 'chiffrage', 'chiffrer'],
      en: ['quote', 'quotation', 'estimate', 'proposal'],
      es: ['presupuesto', 'cotizacion', 'estimacion', 'propuesta'],
      vi: ['bao gia', 'du toan', 'bao gia mien phi'],
    },
    answer: {
      fr: `Le devis est **gratuit et sans engagement**, avec une réponse **sous 48 h ouvrées**. Laissez votre e-mail et une ligne sur votre projet ci-dessous, ou passez par le formulaire : https://neuraweb.fr/fr/booking`,
      en: `The quote is **free and non-binding**, with an answer **within 48 business hours**. Leave your email and a line about your project below, or use the form: https://neuraweb.fr/en/booking`,
      es: `El presupuesto es **gratuito y sin compromiso**, con respuesta **en 48 horas hábiles**. Deje su correo y una línea sobre su proyecto abajo, o use el formulario: https://neuraweb.fr/es/booking`,
      vi: `Báo giá **miễn phí và không ràng buộc**, phản hồi **trong vòng 48 giờ làm việc**. Bạn để lại email và một dòng mô tả dự án bên dưới, hoặc dùng biểu mẫu: https://neuraweb.fr/vi/booking`,
    },
    chips: ['pricing', 'delays', 'demo'],
    lead: 'form',
  },
  // ── Délais ──────────────────────────────────────────────────────────────
  {
    id: 'delays',
    priority: 2,
    keywords: {
      fr: ['delai', 'delais', 'combien de temps', 'duree', 'livraison', 'livrer', 'semaines', 'en combien de temps', 'urgent', 'rapidement'],
      en: ['delay', 'delays', 'how long', 'timeline', 'delivery', 'lead time', 'weeks', 'urgent', 'how fast'],
      es: ['plazo', 'plazos', 'cuanto tiempo', 'duracion', 'entrega', 'semanas', 'urgente'],
      vi: ['thoi gian', 'bao lau', 'tien do', 'giao hang', 'tuan', 'gap'],
    },
    unless: ['devis', 'quote', 'presupuesto', 'bao gia'],
    answer: {
      fr: `Délais indicatifs (à confirmer au cadrage) :\n- Landing page : environ 1 semaine\n- **Starter** : 2-3 semaines\n- **Business** : 4-6 semaines\n- **Premium** (sur mesure) : à partir de 6 semaines\n- Automatisation : de 1 à 10 semaines selon le nombre de workflows\n- Application mobile : à partir de 3 semaines\nLe planning exact est fixé après un échange gratuit. Un devis vous est envoyé sous 48 h ouvrées.`,
      en: `Indicative timelines (confirmed at scoping):\n- Landing page: about 1 week\n- **Starter**: 2-3 weeks\n- **Business**: 4-6 weeks\n- **Premium** (tailor-made): from 6 weeks\n- Automation: 1 to 10 weeks depending on the number of workflows\n- Mobile app: from 3 weeks\nThe exact schedule is set after a free call. A quote is sent within 48 business hours.`,
      es: `Plazos indicativos (a confirmar en el alcance):\n- Landing page: aproximadamente 1 semana\n- **Starter**: 2-3 semanas\n- **Business**: 4-6 semanas\n- **Premium** (a medida): desde 6 semanas\n- Automatización: de 1 a 10 semanas según el número de workflows\n- App móvil: desde 3 semanas\nEl calendario exacto se fija tras una llamada gratuita. El presupuesto se envía en 48 h hábiles.`,
      vi: `Thời gian tham khảo (xác nhận khi chốt phạm vi): landing page khoảng 1 tuần; **Starter** 2-3 tuần; **Business** 4-6 tuần; **Premium** (theo yêu cầu) từ 6 tuần; tự động hóa 1 đến 10 tuần tùy số workflow; ứng dụng di động từ 3 tuần. Lịch cụ thể được chốt sau buổi trao đổi miễn phí, báo giá được gửi trong 48 giờ làm việc.`,
    },
    chips: ['quote', 'pricing', 'payment'],
    lead: 'button',
  },
  // ── Propriété du code ──────────────────────────────────────────────────
  {
    id: 'ownership',
    priority: 3,
    keywords: {
      fr: ['propriete', 'proprietaire', 'code source', 'droits', 'droit d auteur', 'cession', 'appartient', 'appartenir', 'licence', 'depot git', 'garder le code', 'recuperer le code'],
      en: ['ownership', 'owner', 'owns', 'who owns', 'own the code', 'own it', 'source code', 'copyright', 'rights', 'licence', 'license', 'belongs', 'git repo'],
      es: ['propiedad', 'propietario', 'codigo fuente', 'derechos', 'cesion', 'licencia', 'pertenece'],
      vi: ['quyen so huu', 'so huu', 'ma nguon', 'ban quyen', 'giay phep'],
    },
    answer: {
      fr: `Le code spécifique de votre projet **vous appartient à la réception du solde**, avec une cession écrite dans le contrat. NeuraWeb conserve ses composants génériques réutilisables, que vous pouvez continuer à utiliser (licence non exclusive), et les bibliothèques open source gardent leur licence. Les accès et le dépôt Git vous sont remis à la livraison. Une question sur votre cas précis ? Écrivez-nous : contact@neuraweb.fr`,
      en: `The project-specific code **becomes yours once the final payment is received**, with a written assignment in the contract. NeuraWeb keeps its generic reusable components, which you may keep using (non-exclusive licence), and open-source libraries keep their own licences. Access and the Git repository are handed over at delivery. A question about your case? Email us: contact@neuraweb.fr`,
      es: `El código específico de su proyecto **pasa a ser suyo al recibir el pago final**, con una cesión por escrito en el contrato. NeuraWeb conserva sus componentes genéricos reutilizables, que usted puede seguir usando (licencia no exclusiva), y las bibliotecas de código abierto mantienen su licencia. Los accesos y el repositorio Git se entregan al finalizar. ¿Una duda sobre su caso? Escriba a contact@neuraweb.fr`,
      vi: `Mã nguồn riêng của dự án **thuộc về bạn khi thanh toán xong khoản cuối**, có văn bản chuyển nhượng trong hợp đồng. NeuraWeb giữ lại các thành phần chung có thể tái sử dụng (bạn vẫn được dùng, giấy phép không độc quyền); thư viện mã nguồn mở giữ giấy phép riêng. Quyền truy cập và kho Git được bàn giao khi hoàn thành. Cần hỏi về trường hợp cụ thể? Email: contact@neuraweb.fr`,
    },
    chips: ['payment', 'quote', 'maintenance'],
  },
  // ── Paiement ────────────────────────────────────────────────────────────
  {
    id: 'payment',
    priority: 3,
    keywords: {
      fr: ['paiement', 'payer', 'acompte', 'echelonne', 'echelonner', 'modalites de paiement', 'virement', 'regler', 'reglement'],
      en: ['payment', 'pay', 'deposit', 'instalments', 'installments', 'payment terms', 'bank transfer'],
      es: ['pago', 'pagar', 'anticipo', 'señal', 'plazos de pago', 'transferencia'],
      vi: ['thanh toan', 'tra tien', 'dat coc', 'chuyen khoan', 'tra gop'],
    },
    answer: {
      fr: `La création se règle en 3 temps : **40 % à la commande**, **30 % à la validation des maquettes** et **30 % à la mise en ligne**. Les prix sont en HT, TVA non applicable (art. 293 B du CGI). Un abonnement de maintenance, si vous le souhaitez, se facture à part, chaque mois.`,
      en: `The build is paid in 3 steps: **40% at order**, **30% when the mockups are approved** and **30% at launch**. Prices are excl. VAT, VAT not applicable (art. 293 B of the French tax code). A maintenance subscription, if you want one, is billed separately each month.`,
      es: `La creación se paga en 3 tiempos: **40 % al encargar**, **30 % al validar las maquetas** y **30 % al publicar**. Precios sin IVA, IVA no aplicable (art. 293 B del CGI francés). Una suscripción de mantenimiento, si la desea, se factura aparte cada mes.`,
      vi: `Phí xây dựng được thanh toán 3 đợt: **40 % khi đặt hàng**, **30 % khi duyệt mẫu thiết kế** và **30 % khi đưa website lên mạng**. Giá chưa gồm thuế, không áp dụng VAT (điều 293 B luật thuế Pháp). Gói bảo trì (nếu bạn muốn) được thanh toán riêng hằng tháng.`,
    },
    chips: ['ownership', 'quote', 'maintenance'],
  },
  // ── Contrat / facture ──────────────────────────────────────────────────
  {
    id: 'contract',
    priority: 2,
    keywords: {
      fr: ['contrat', 'tva', 'siret', 'facture', 'factures', 'cgv', 'conditions generales', 'mentions legales'],
      en: ['contract', 'vat', 'siret', 'invoice', 'invoices', 'terms', 'legal'],
      es: ['contrato', 'iva', 'siret', 'factura', 'facturas', 'condiciones'],
      vi: ['hop dong', 'vat', 'siret', 'hoa don'],
    },
    unless: ['n8n', 'automatisation', 'automation', 'automatizacion', 'relance', 'relances', 'chatbot', 'workflow', 'workflows', 'ia', 'ai'],
    answer: {
      fr: `NeuraWeb est une agence française (SIRET 991 296 047 00020, micro-entreprise immatriculée à Lille). Le **contrat et la facture sont français**, TVA non applicable (art. 293 B du CGI). Conditions d'utilisation : https://neuraweb.fr/fr/conditions-utilisation`,
      en: `NeuraWeb is a French agency (SIRET 991 296 047 00020, micro-business registered in Lille). The **contract and invoice are French**, VAT not applicable (art. 293 B of the French tax code). Terms of use: https://neuraweb.fr/en/conditions-utilisation`,
      es: `NeuraWeb es una agencia francesa (SIRET 991 296 047 00020, microempresa registrada en Lille). El **contrato y la factura son franceses**, IVA no aplicable (art. 293 B del CGI francés). Condiciones de uso: https://neuraweb.fr/es/conditions-utilisation`,
      vi: `NeuraWeb là agency của Pháp (SIRET 991 296 047 00020, doanh nghiệp siêu nhỏ đăng ký tại Lille). **Hợp đồng và hóa đơn theo chuẩn Pháp**, không áp dụng VAT (điều 293 B). Điều khoản sử dụng: https://neuraweb.fr/vi/conditions-utilisation`,
    },
    chips: ['payment', 'ownership', 'quote'],
  },
  // ── Localisation / travail à distance ──────────────────────────────────
  {
    id: 'where',
    priority: 3,
    keywords: {
      fr: ['bureau', 'bureaux', 'adresse', 'ou etes vous', 'ou se trouve', 'localisation', 'locaux', 'presentiel', 'physiquement', 'siege', 'hanoi', 'vietnam', 'decalage', 'fuseau', 'a distance', 'remote', 'teletravail', 'visioconference', 'visio'],
      en: ['office', 'offices', 'address', 'where are you', 'location', 'in person', 'hanoi', 'vietnam', 'time difference', 'timezone', 'time zone', 'remote', 'remotely', 'video call'],
      es: ['oficina', 'oficinas', 'direccion', 'donde estan', 'ubicados', 'ubicacion', 'presencial', 'hanoi', 'vietnam', 'diferencia horaria', 'remoto', 'a distancia', 'videollamada'],
      vi: ['van phong', 'dia chi', 'o dau', 'tru so', 'ha noi', 'hanoi', 'viet nam', 'mui gio', 'tu xa', 'remote', 'truc tuyen'],
    },
    answer: {
      fr: `NeuraWeb est une agence **immatriculée à Lille** (contrat, facture et TVA français), **100 % à distance** : pas de bureau ouvert au public, ni à Lille, ni à Paris. L'équipe de trois personnes travaille actuellement depuis **Hanoï** (5 à 6 h de décalage avec la France) et accompagne des clients en France et à l'international. Tout se passe en visioconférence et sur des outils partagés ; les points se fixent à vos horaires, le plus souvent le matin en France.`,
      en: `NeuraWeb is an agency **registered in Lille**, France (French contract, invoice and VAT), **100% remote**: no office open to the public, in Lille or Paris. The team of three currently works from **Hanoi** (5 to 6 hours ahead of France) and serves clients in France and abroad. Everything happens by video call and on shared tools; meetings are set at times that suit you, most often in the French morning.`,
      es: `NeuraWeb es una agencia **registrada en Lille** (Francia; contrato, factura e IVA franceses), **100 % remota**: sin oficina abierta al público, ni en Lille ni en París. El equipo de tres personas trabaja actualmente desde **Hanói** (5 a 6 horas de diferencia con Francia) y atiende a clientes en Francia y en el extranjero. Todo se hace por videollamada y con herramientas compartidas; las reuniones se fijan en su horario, normalmente por la mañana en Francia.`,
      vi: `NeuraWeb là agency **đăng ký tại Lille** (Pháp; hợp đồng, hóa đơn và thuế theo chuẩn Pháp), **làm việc 100 % từ xa**: không có văn phòng đón khách, cả ở Lille lẫn Paris. Đội ngũ ba người hiện làm việc từ **Hà Nội** (lệch múi giờ 5-6 giờ so với Pháp) và hỗ trợ khách hàng tại Pháp cũng như quốc tế. Mọi thứ diễn ra qua họp trực tuyến và công cụ chia sẻ; lịch họp sắp xếp theo giờ thuận tiện cho bạn.`,
    },
    chips: ['team', 'quote', 'demo'],
  },
  // ── Maintenance ─────────────────────────────────────────────────────────
  {
    id: 'maintenance',
    priority: 2,
    keywords: {
      fr: ['maintenance', 'mise a jour', 'mises a jour', 'apres la mise en ligne', 'suivi apres', 'support', 'abonnement'],
      en: ['maintenance', 'updates', 'after launch', 'after go live', 'support', 'subscription'],
      es: ['mantenimiento', 'actualizaciones', 'despues del lanzamiento', 'soporte', 'suscripcion'],
      vi: ['bao tri', 'cap nhat', 'ho tro sau', 'goi bao tri'],
    },
    answer: {
      fr: `La maintenance est mensuelle (HT) et dépend du temps alloué et de la complexité, toujours « à partir de » :\n- site statique : à partir de 59 € (≈ 0,5 h)\n- backend + CMS : à partir de 89 € (≈ 1 h)\n- comptes, accès privé ou paiement : à partir de 119 € (≈ 1,5 h)\nAu-delà du temps alloué : 85 € HT/h, toujours après devis écrit. Seul le **Pack Premium** offre 12 mois de maintenance offerts (puis sur devis).`,
      en: `Maintenance is monthly (excl. VAT) and depends on allocated time and complexity, always "from":\n- static site: from €59 (≈ 0.5 h)\n- backend + CMS: from €89 (≈ 1 h)\n- accounts, private access or payment: from €119 (≈ 1.5 h)\nBeyond the allocated time: €85/h excl. VAT, always after a written quote. Only the **Premium pack** includes 12 free months of maintenance (then on quote).`,
      es: `El mantenimiento es mensual (sin IVA) y depende del tiempo asignado y de la complejidad, siempre «desde»:\n- sitio estático: desde 59 € (≈ 0,5 h)\n- backend + CMS: desde 89 € (≈ 1 h)\n- cuentas, acceso privado o pago: desde 119 € (≈ 1,5 h)\nMás allá del tiempo asignado: 85 €/h sin IVA, siempre con presupuesto escrito. Solo el **Pack Premium** incluye 12 meses de mantenimiento gratis (luego a presupuesto).`,
      vi: `Bảo trì được tính theo tháng và phụ thuộc vào thời gian dành cho dự án và độ phức tạp (website tĩnh, có backend + CMS, hoặc có tài khoản/thanh toán). Chỉ **gói Premium** được tặng 12 tháng bảo trì đầu tiên (sau đó báo giá riêng). Để biết mức giá phù hợp, bạn vui lòng yêu cầu báo giá miễn phí.`,
    },
    chips: ['pricing', 'quote', 'ownership'],
    lead: 'button',
  },
  // ── Démo / exemples ────────────────────────────────────────────────────
  {
    id: 'demo',
    priority: 2,
    keywords: {
      fr: ['demo', 'demonstration', 'exemple', 'exemples', 'realisation', 'realisations', 'portfolio', 'voir un site', 'references', 'maquette', 'maquettes', 'tester'],
      en: ['demo', 'demonstration', 'example', 'examples', 'portfolio', 'references', 'mockup', 'mockups', 'try'],
      es: ['demo', 'demostracion', 'ejemplo', 'ejemplos', 'portfolio', 'trabajos', 'referencias', 'maqueta', 'maquetas', 'probar'],
      vi: ['demo', 'ban demo', 'vi du', 'san pham', 'du an', 'portfolio', 'mau', 'dung thu'],
    },
    answer: {
      fr: `Testez notre **démo interactive** (données fictives) : un back-office web et une application mobile ou un site client synchronisés en temps réel, pour un hôtel, un restaurant ou une mairie → https://demo.neuraweb.fr\nVous pouvez aussi voir nos offres par secteur : https://neuraweb.fr/fr/secteurs\nUn projet comparable en tête ? Je peux vous orienter vers le bon pack.`,
      en: `Try our **interactive demo** (fictional data): a web back-office and a mobile app or client website synced in real time, for a hotel, a restaurant or a town hall → https://demo.neuraweb.fr\nYou can also browse our offers by industry: https://neuraweb.fr/en/secteurs\nHave a similar project in mind? I can point you to the right pack.`,
      es: `Pruebe nuestra **demo interactiva** (datos ficticios): un back-office web y una app móvil o sitio de cliente sincronizados en tiempo real, para un hotel, un restaurante o un ayuntamiento → https://demo.neuraweb.fr\nTambién puede ver nuestras ofertas por sector: https://neuraweb.fr/es/secteurs\n¿Tiene un proyecto parecido? Puedo orientarle hacia el pack adecuado.`,
      vi: `Bạn có thể dùng thử **bản demo tương tác** (dữ liệu giả lập): trang quản trị web và ứng dụng di động (hoặc website khách hàng) đồng bộ theo thời gian thực, dành cho khách sạn, nhà hàng hoặc cơ quan địa phương → https://demo.neuraweb.fr\nXem thêm các giải pháp theo lĩnh vực: https://neuraweb.fr/vi/secteurs\nBạn có dự án tương tự? Mình sẽ giúp bạn chọn gói phù hợp.`,
    },
    chips: ['pricing', 'quote', 'where'],
    lead: 'button',
  },
  // ── Sous-traitance ─────────────────────────────────────────────────────
  {
    id: 'subcontracting',
    priority: 4,
    keywords: {
      fr: ['sous traitance', 'sous-traitance', 'sous traiter', 'marque blanche', 'white label', 'freelance', 'freelances', 'je suis une agence', 'nous sommes une agence', 'notre agence', 'pour mon agence', 'revendre', 'revendeur'],
      en: ['subcontracting', 'subcontract', 'white label', 'white-label', 'freelance', 'freelancer', 'i run an agency', 'we are an agency', 'our agency', 'my agency', 'resell'],
      es: ['subcontratacion', 'subcontratar', 'marca blanca', 'freelance', 'soy una agencia', 'somos una agencia', 'mi agencia', 'nuestra agencia', 'revender'],
      vi: ['thau phu', 'white label', 'nhan hieu rieng', 'freelance', 'toi la mot agency', 'chung toi la agency', 'agency cua toi', 'ban lai'],
    },
    answer: {
      fr: `Oui, NeuraWeb travaille en **marque blanche** pour les agences, studios et freelances : développement Next.js, applications mobiles et intégration IA, livrés sous votre marque, **NDA signé avant tout échange de détail**, aucun contact avec votre client final, code livré sur votre dépôt. Les projets démarrent à partir de 1 490 € HT, devis sous 48 h ouvrées. Détails : https://neuraweb.fr/fr/sous-traitance-web`,
      en: `Yes, NeuraWeb works **white-label** for agencies, studios and freelancers: Next.js development, mobile apps and AI integration delivered under your brand, **NDA signed before any detailed exchange**, no contact with your end client, code delivered to your repository. Projects start from €1,490 excl. VAT, quote within 48 business hours. Details (in French): https://neuraweb.fr/fr/sous-traitance-web`,
      es: `Sí, NeuraWeb trabaja en **marca blanca** para agencias, estudios y freelancers: desarrollo Next.js, apps móviles e integración de IA entregados bajo su marca, **NDA firmado antes de cualquier intercambio detallado**, sin contacto con su cliente final, código entregado en su repositorio. Los proyectos empiezan desde 1 490 € sin IVA, presupuesto en 48 h hábiles. Detalles (en francés): https://neuraweb.fr/fr/sous-traitance-web`,
      vi: `Có, NeuraWeb làm việc theo hình thức **white-label** cho agency, studio và freelancer: phát triển Next.js, ứng dụng di động và tích hợp AI, bàn giao dưới thương hiệu của bạn, **ký NDA trước khi trao đổi chi tiết**, không liên hệ khách hàng cuối, mã nguồn bàn giao vào kho của bạn. Báo giá trong 48 giờ làm việc. Chi tiết (tiếng Pháp): https://neuraweb.fr/fr/sous-traitance-web`,
    },
    chips: ['quote', 'ownership', 'where'],
    lead: 'button',
  },
  // ── Avis ────────────────────────────────────────────────────────────────
  {
    id: 'reviews',
    priority: 2,
    keywords: {
      fr: ['avis', 'temoignage', 'temoignages', 'etoiles', 'satisfaction', 'clients satisfaits', 'fiable', 'serieux'],
      en: ['reviews', 'review', 'testimonials', 'testimonial', 'stars', 'satisfaction', 'reliable', 'trustworthy'],
      es: ['opiniones', 'resenas', 'testimonios', 'estrellas', 'satisfaccion', 'fiable'],
      vi: ['danh gia', 'nhan xet', 'cam nhan', 'sao', 'uy tin'],
    },
    answer: {
      fr: `Nos clients nous notent **5/5 sur Google** : vous pouvez lire leurs avis en recherchant « NeuraWeb » sur Google. Pour des raisons de confidentialité, nous ne citons pas de noms de clients. Vous pouvez en revanche tester notre démo interactive (https://demo.neuraweb.fr) et échanger directement avec l'équipe avant de vous engager.`,
      en: `Our clients rate us **5/5 on Google**: you can read their reviews by searching "NeuraWeb" on Google. For confidentiality reasons we do not name clients. You can, however, try our interactive demo (https://demo.neuraweb.fr) and talk directly with the team before committing.`,
      es: `Nuestros clientes nos valoran con **5/5 en Google**: puede leer sus opiniones buscando «NeuraWeb» en Google. Por confidencialidad no citamos nombres de clientes. Sí puede probar nuestra demo interactiva (https://demo.neuraweb.fr) y hablar directamente con el equipo antes de comprometerse.`,
      vi: `Khách hàng đánh giá NeuraWeb **5/5 trên Google**: bạn có thể xem đánh giá bằng cách tìm « NeuraWeb » trên Google. Vì lý do bảo mật, chúng tôi không nêu tên khách hàng. Bạn có thể dùng thử bản demo tương tác (https://demo.neuraweb.fr) và trao đổi trực tiếp với đội ngũ trước khi quyết định.`,
    },
    chips: ['demo', 'quote', 'team'],
  },
  // ── Next.js / WordPress ────────────────────────────────────────────────
  {
    id: 'wordpress',
    priority: 3,
    keywords: {
      fr: ['wordpress', 'wix', 'webflow', 'next.js', 'nextjs', 'react', 'framework', 'technologie', 'technologies', 'stack', 'cms'],
      en: ['wordpress', 'wix', 'webflow', 'next.js', 'nextjs', 'react', 'framework', 'technology', 'technologies', 'stack', 'cms'],
      es: ['wordpress', 'wix', 'webflow', 'next.js', 'nextjs', 'react', 'framework', 'tecnologia', 'tecnologias', 'stack', 'cms'],
      vi: ['wordpress', 'wix', 'webflow', 'next.js', 'nextjs', 'react', 'framework', 'cong nghe', 'stack', 'cms'],
    },
    answer: {
      fr: `Nous développons surtout en **Next.js (React)** : les pages sont rendues côté serveur, donc lisibles par Google et par les moteurs d'IA, et plus faciles à garder rapides qu'un WordPress chargé de plugins. Si vous avez besoin de modifier vous-même vos contenus, nous ajoutons un CMS. Comparatif détaillé : https://neuraweb.fr/fr/blog/nextjs-vs-wordpress-2026 · Notre expertise : https://neuraweb.fr/fr/agence-nextjs`,
      en: `We mostly build with **Next.js (React)**: pages are rendered on the server, so they are readable by Google and AI engines, and easier to keep fast than a plugin-heavy WordPress. If you need to edit content yourself, we add a CMS. Detailed comparison: https://neuraweb.fr/en/blog/nextjs-vs-wordpress-2026`,
      es: `Desarrollamos sobre todo con **Next.js (React)**: las páginas se renderizan en el servidor, por lo que las leen Google y los motores de IA, y es más fácil mantenerlas rápidas que un WordPress cargado de plugins. Si necesita editar usted mismo los contenidos, añadimos un CMS. Comparativa detallada: https://neuraweb.fr/es/blog/nextjs-vs-wordpress-2026`,
      vi: `Chúng tôi chủ yếu phát triển bằng **Next.js (React)**: trang được dựng phía máy chủ nên Google và các công cụ AI đọc được dễ dàng, và dễ giữ tốc độ nhanh hơn một WordPress nhiều plugin. Nếu bạn cần tự sửa nội dung, chúng tôi bổ sung CMS. So sánh chi tiết: https://neuraweb.fr/vi/blog/nextjs-vs-wordpress-2026`,
    },
    chips: ['pricing', 'demo', 'quote'],
  },
  // ── Équipe ──────────────────────────────────────────────────────────────
  {
    id: 'team',
    priority: 2,
    keywords: {
      fr: ['equipe', 'fondateur', 'qui etes vous', 'qui est derriere', 'qui es tu', 'nacer', 'sandra', 'arthur', 'ceo', 'qui sommes'],
      en: ['team', 'founder', 'who are you', 'who is behind', 'nacer', 'sandra', 'arthur', 'ceo', 'about you', 'about us'],
      es: ['equipo', 'fundador', 'quienes son', 'quien esta detras', 'nacer', 'sandra', 'arthur', 'ceo', 'sobre ustedes'],
      vi: ['doi ngu', 'nguoi sang lap', 'cac ban la ai', 'ai dung sau', 'nacer', 'sandra', 'arthur', 'ceo', 've chung toi'],
    },
    answer: {
      fr: `NeuraWeb, c'est une équipe de **trois personnes** : **Nacer** (fondateur, développement full-stack React/Next.js et intégration de modèles d'IA), **Sandra** (communication et marketing) et **Arthur** (IA et automatisation, workflows n8n). Vous parlez directement à ceux qui font le travail. Présentation : https://neuraweb.fr/fr/equipe`,
      en: `NeuraWeb is a team of **three**: **Nacer** (founder, full-stack React/Next.js development and AI model integration), **Sandra** (communication and marketing) and **Arthur** (AI and automation, n8n workflows). You talk directly to the people doing the work. About the team: https://neuraweb.fr/en/equipe`,
      es: `NeuraWeb es un equipo de **tres personas**: **Nacer** (fundador, desarrollo full-stack React/Next.js e integración de modelos de IA), **Sandra** (comunicación y marketing) y **Arthur** (IA y automatización, workflows n8n). Habla directamente con quienes hacen el trabajo. Presentación: https://neuraweb.fr/es/equipe`,
      vi: `NeuraWeb là đội ngũ **ba người**: **Nacer** (người sáng lập, phát triển full-stack React/Next.js và tích hợp mô hình AI), **Sandra** (truyền thông và marketing) và **Arthur** (AI và tự động hóa, workflow n8n). Bạn làm việc trực tiếp với những người thực hiện dự án. Giới thiệu: https://neuraweb.fr/vi/equipe`,
    },
    chips: ['where', 'demo', 'quote'],
  },
  // ── Offre générale ─────────────────────────────────────────────────────
  {
    id: 'services',
    priority: 1,
    keywords: {
      fr: ['que faites vous', 'que proposez', 'vous proposez', 'vos services', 'prestations', 'vos offres', 'que faites-vous', 'expertise'],
      en: ['what do you do', 'what do you offer', 'your services', 'services', 'offers', 'what you offer'],
      es: ['que hacen', 'que ofrecen', 'sus servicios', 'servicios', 'ofertas'],
      vi: ['cac ban lam gi', 'dich vu', 'cung cap gi', 'cac goi'],
    },
    answer: {
      fr: `NeuraWeb réalise, pour les PME, hôtels, restaurants, cabinets de santé et collectivités :\n- **Sites web** (Next.js) : à partir de 1 490 €\n- **Applications mobiles** iOS/Android : à partir de 8 900 €\n- **Automatisation** (n8n, Make, Zapier) : à partir de 999 € + 29 €/mois\n- **Intégration IA** (chatbots, agents) : à partir de 1 499 € + 39 €/mois\nPrix HT, toujours « à partir de ». Quel est votre projet ?`,
      en: `NeuraWeb builds, for SMBs, hotels, restaurants, healthcare practices and local authorities:\n- **Websites** (Next.js): from €1,490\n- **Mobile apps** iOS/Android: from €8,900\n- **Automation** (n8n, Make, Zapier): from €999 + €29/month\n- **AI integration** (chatbots, agents): from €1,499 + €39/month\nPrices excl. VAT, always "from". What is your project?`,
      es: `NeuraWeb realiza, para pymes, hoteles, restaurantes, consultas sanitarias y administraciones locales:\n- **Sitios web** (Next.js): desde 1 490 €\n- **Apps móviles** iOS/Android: desde 8 900 €\n- **Automatización** (n8n, Make, Zapier): desde 999 € + 29 €/mes\n- **Integración de IA** (chatbots, agentes): desde 1 499 € + 39 €/mes\nPrecios sin IVA, siempre «desde». ¿Cuál es su proyecto?`,
      vi: `NeuraWeb thực hiện cho doanh nghiệp vừa và nhỏ, khách sạn, nhà hàng, phòng khám và cơ quan địa phương: **website** (Next.js), **ứng dụng di động** iOS/Android, **tự động hóa** (n8n, Make, Zapier) và **tích hợp AI** (chatbot, agent). Báo giá riêng theo từng dự án. Dự án của bạn là gì?`,
    },
    chips: ['pricing', 'demo', 'quote'],
  },
  // ── Secteurs ────────────────────────────────────────────────────────────
  {
    id: 'restaurant',
    priority: 20,
    keywords: {
      fr: ['restaurant', 'restaurants', 'restaurateur', 'resto', 'brasserie', 'traiteur', 'uber eats', 'deliveroo', 'click and collect', 'commande en ligne'],
      en: ['restaurant', 'restaurants', 'restaurateur', 'bistro', 'caterer', 'uber eats', 'deliveroo', 'click and collect', 'online ordering'],
      es: ['restaurante', 'restaurantes', 'restaurador', 'bar', 'catering', 'uber eats', 'deliveroo', 'pedidos en linea'],
      vi: ['nha hang', 'quan an', 'uber eats', 'deliveroo', 'dat mon'],
    },
    answer: {
      fr: `Pour les restaurants, nos offres (HT, « à partir de », sur maquettes prédéfinies) :\n- **Vitrine** à partir de 990 € : menu, horaires, réservation de table\n- **Vitrine Pro** à partir de 1 490 € : design soigné, avis clients\n- **Click & Collect + paiement** à partir de 2 990 € : commande en ligne, zéro commission\n- **Fidélité + compte client** à partir de 4 990 €\n- **Réseau / Franchise** : sur mesure, uniquement sur devis\nUber Eats ou Deliveroo prélèvent 20 à 30 % par commande, contre environ 1,4 % de frais de paiement en direct. Souhaitez-vous plutôt une vitrine avec réservation, ou la commande en ligne ? Page dédiée : https://neuraweb.fr/fr/secteurs/restaurants-hotels`,
      en: `For restaurants, our offers (excl. VAT, "from", on predefined mockups):\n- **Showcase** from €990: menu, hours, table booking\n- **Showcase Pro** from €1,490: polished design, client reviews\n- **Click & Collect + payment** from €2,990: online ordering, zero commission\n- **Loyalty + client account** from €4,990\n- **Network / Franchise**: tailor-made, on quote only\nUber Eats or Deliveroo take 20-30% per order, versus about 1.4% payment fees when selling direct. Do you need a showcase with booking, or online ordering? Dedicated page: https://neuraweb.fr/en/secteurs/restaurants-hotels`,
      es: `Para restaurantes, nuestras ofertas (sin IVA, «desde», sobre maquetas predefinidas):\n- **Vitrina** desde 990 €: carta, horarios, reserva de mesa\n- **Vitrina Pro** desde 1 490 €: diseño cuidado, opiniones de clientes\n- **Click & Collect + pago** desde 2 990 €: pedidos en línea, cero comisión\n- **Fidelidad + cuenta de cliente** desde 4 990 €\n- **Red / Franquicia**: a medida, solo con presupuesto\nUber Eats o Deliveroo cobran del 20 al 30 % por pedido, frente a cerca de un 1,4 % de comisión de pago en directo. ¿Prefiere una vitrina con reserva o pedidos en línea? Página dedicada: https://neuraweb.fr/es/secteurs/restaurants-hotels`,
      vi: `Với nhà hàng, NeuraWeb có các gói: website giới thiệu kèm đặt bàn, bản Pro với thiết kế chăm chút và đánh giá khách hàng, gói đặt món và thanh toán trực tuyến (không hoa hồng), gói tích điểm/tài khoản khách hàng, và giải pháp theo yêu cầu cho chuỗi/nhượng quyền (chỉ báo giá riêng). Uber Eats hay Deliveroo thu khoảng 20-30 % mỗi đơn, trong khi bán trực tiếp chỉ mất phí thanh toán khoảng 1,4 %. Bạn cần website giới thiệu có đặt bàn hay đặt món trực tuyến? https://neuraweb.fr/vi/secteurs/restaurants-hotels`,
    },
    chips: ['quote', 'demo', 'delays'],
    lead: 'button',
  },
  {
    id: 'sante',
    priority: 20,
    keywords: {
      fr: ['sante', 'kine', 'kinesitherapeute', 'osteo', 'osteopathe', 'medecin', 'infirmier', 'infirmiere', 'paramedical', 'dentiste', 'psychologue', 'sage femme', 'podologue', 'cabinet medical', 'hds', 'doctolib', 'patients'],
      en: ['healthcare', 'health', 'physio', 'physiotherapist', 'osteopath', 'doctor', 'nurse', 'dentist', 'psychologist', 'medical practice', 'hds', 'patients'],
      es: ['salud', 'fisioterapeuta', 'osteopata', 'medico', 'enfermero', 'dentista', 'psicologo', 'consulta medica', 'hds', 'pacientes'],
      vi: ['y te', 'suc khoe', 'bac si', 'phong kham', 'nha si', 'vat ly tri lieu', 'benh nhan', 'hds'],
    },
    answer: {
      fr: `Pour les professionnels de santé et du paramédical (HT, « à partir de », sur maquettes prédéfinies) :\n- **Vitrine Santé** à partir de 990 € (site statique) + à partir de 59 €/mois\n- **Vitrine Pro + Blog** à partir de 1 490 € (backend + CMS) + à partir de 89 €/mois\n- **Pro Santé** à partir de 4 490 € : réservation, espace patient, **hébergement HDS inclus**, + à partir de 349 €/mois\n- **Premium Santé** : architecture sur mesure, uniquement sur devis\nL'hébergement HDS n'est obligatoire que si vous stockez des données patients. Stockez-vous (ou voulez-vous stocker) des données patients sur le site ? Page dédiée : https://neuraweb.fr/fr/secteurs/sante`,
      en: `For healthcare and allied-health professionals (excl. VAT, "from", on predefined mockups):\n- **Health Showcase** from €990 (static site) + from €59/month\n- **Showcase Pro + Blog** from €1,490 (backend + CMS) + from €89/month\n- **Pro Santé** from €4,490: booking, patient area, **HDS hosting included**, + from €349/month\n- **Premium Santé**: tailor-made architecture, on quote only\nHDS (certified health-data hosting) is only mandatory if you store patient data. Do you (or will you) store patient data on the site? Dedicated page: https://neuraweb.fr/en/secteurs/sante`,
      es: `Para profesionales de la salud y paramédicos (sin IVA, «desde», sobre maquetas predefinidas):\n- **Vitrina Salud** desde 990 € (sitio estático) + desde 59 €/mes\n- **Vitrina Pro + Blog** desde 1 490 € (backend + CMS) + desde 89 €/mes\n- **Pro Santé** desde 4 490 €: reserva, área de paciente, **alojamiento HDS incluido**, + desde 349 €/mes\n- **Premium Santé**: arquitectura a medida, solo con presupuesto\nEl alojamiento HDS (datos de salud certificado) solo es obligatorio si almacena datos de pacientes. ¿Almacena (o quiere almacenar) datos de pacientes en el sitio? Página dedicada: https://neuraweb.fr/es/secteurs/sante`,
      vi: `Với chuyên gia y tế và phụ trợ y tế, NeuraWeb có bốn mức: website giới thiệu (tĩnh), bản Pro kèm blog (backend + CMS), **Pro Santé** (đặt lịch, khu vực bệnh nhân, **đã gồm hosting HDS**) và **Premium Santé** (kiến trúc theo yêu cầu, chỉ báo giá riêng). Hosting HDS (dữ liệu y tế được chứng nhận) chỉ bắt buộc khi bạn lưu dữ liệu bệnh nhân. Bạn có lưu (hoặc dự định lưu) dữ liệu bệnh nhân trên website không? https://neuraweb.fr/vi/secteurs/sante`,
    },
    chips: ['quote', 'maintenance', 'delays'],
    lead: 'button',
  },
  {
    id: 'collectivite',
    priority: 20,
    keywords: {
      fr: ['mairie', 'mairies', 'commune', 'collectivite', 'collectivites', 'epci', 'metropole', 'ccas', 'commande publique', 'secteur public', 'rgaa', 'accessibilite', 'office de tourisme', 'mediatheque', 'marche public'],
      en: ['town hall', 'council', 'local authority', 'local authorities', 'municipality', 'public sector', 'public procurement', 'accessibility'],
      es: ['ayuntamiento', 'municipio', 'administracion local', 'sector publico', 'contratacion publica', 'accesibilidad'],
      vi: ['uy ban', 'xa phuong', 'co quan dia phuong', 'khu vuc cong', 'dau thau', 'kha nang tiep can'],
    },
    answer: {
      fr: `Pour les collectivités, l'offre est **modulaire et sur devis** (pas de prix public) : site conforme (accessibilité RGAA, RGPD), démarches en ligne, chatbot IA avec transparence, application citoyenne, visibilité des commerces locaux. Depuis le 1er avril 2026, un marché de services peut être conclu **sans mise en concurrence sous 60 000 € HT**, ce qui couvre la plupart des projets web d'une commune. Le premier pas est un **audit d'accessibilité gracieux**, sans engagement. Votre priorité : la conformité du site, de nouveaux services en ligne, ou la visibilité des commerçants ? https://neuraweb.fr/fr/secteurs/collectivites`,
      en: `For local authorities, the offer is **modular and on quote** (no public price): compliant website (RGAA accessibility, GDPR), online procedures, transparent AI chatbot, citizen app, visibility for local shops. Since 1 April 2026 a services contract can be awarded **without competitive tendering below €60,000 excl. VAT**, which covers most municipal web projects. The first step is a **free accessibility audit**, no commitment. Your priority: site compliance, new online services, or local-shop visibility? https://neuraweb.fr/en/secteurs/collectivites`,
      es: `Para administraciones locales, la oferta es **modular y a presupuesto** (sin precio público): sitio conforme (accesibilidad RGAA, RGPD), trámites en línea, chatbot de IA transparente, app ciudadana, visibilidad del comercio local. Desde el 1 de abril de 2026 un contrato de servicios puede adjudicarse **sin concurrencia por debajo de 60 000 € sin IVA**, lo que cubre la mayoría de proyectos web municipales. El primer paso es una **auditoría de accesibilidad gratuita**, sin compromiso. ¿Su prioridad: conformidad del sitio, nuevos servicios en línea o visibilidad del comercio local? https://neuraweb.fr/es/secteurs/collectivites`,
      vi: `Với cơ quan địa phương, giải pháp theo **mô-đun và báo giá riêng** (không có giá công khai): website tuân thủ (khả năng tiếp cận RGAA, RGPD), dịch vụ hành chính trực tuyến, chatbot AI minh bạch, ứng dụng công dân, quảng bá cửa hàng địa phương. Bước đầu là **kiểm tra khả năng tiếp cận miễn phí**, không ràng buộc. Ưu tiên của bạn là gì? https://neuraweb.fr/vi/secteurs/collectivites`,
    },
    chips: ['quote', 'delays', 'demo'],
    lead: 'button',
  },
  // ── Contact ─────────────────────────────────────────────────────────────
  {
    id: 'contact',
    priority: 1,
    keywords: {
      fr: ['email', 'e mail', 'mail', 'joindre', 'contacter', 'contact', 'coordonnees', 'adresse mail'],
      en: ['email', 'e-mail', 'mail', 'reach you', 'contact', 'contact details', 'get in touch'],
      es: ['email', 'correo', 'contactar', 'contacto', 'datos de contacto', 'escribirles'],
      vi: ['email', 'lien he', 'lien lac', 'thong tin lien he', 'gui mail'],
    },
    answer: {
      fr: `Vous pouvez nous écrire à **contact@neuraweb.fr** ou passer par le formulaire : https://neuraweb.fr/fr/contact. Pour un devis gratuit avec réponse sous 48 h ouvrées : https://neuraweb.fr/fr/booking`,
      en: `You can email us at **contact@neuraweb.fr** or use the form: https://neuraweb.fr/en/contact. For a free quote with an answer within 48 business hours: https://neuraweb.fr/en/booking`,
      es: `Puede escribirnos a **contact@neuraweb.fr** o usar el formulario: https://neuraweb.fr/es/contact. Para un presupuesto gratuito con respuesta en 48 h hábiles: https://neuraweb.fr/es/booking`,
      vi: `Bạn có thể gửi email tới **contact@neuraweb.fr** hoặc dùng biểu mẫu: https://neuraweb.fr/vi/contact. Để nhận báo giá miễn phí, phản hồi trong 48 giờ làm việc: https://neuraweb.fr/vi/booking`,
    },
    chips: ['quote', 'where', 'demo'],
    lead: 'button',
  },
  // ── Remerciements ───────────────────────────────────────────────────────
  {
    id: 'thanks',
    priority: 0,
    keywords: {
      fr: ['merci', 'super merci', 'parfait merci', 'top merci'],
      en: ['thanks', 'thank you', 'thx'],
      es: ['gracias', 'muchas gracias'],
      vi: ['cam on', 'cảm ơn', 'thanks'],
    },
    answer: {
      fr: `Avec plaisir ! 😊 Si vous souhaitez avancer, le plus simple est de demander un **devis gratuit** (réponse sous 48 h ouvrées) ou de tester notre démo : https://demo.neuraweb.fr`,
      en: `My pleasure! 😊 To move forward, the simplest is to request a **free quote** (answer within 48 business hours) or try our demo: https://demo.neuraweb.fr`,
      es: `¡Con gusto! 😊 Para avanzar, lo más sencillo es pedir un **presupuesto gratuito** (respuesta en 48 h hábiles) o probar nuestra demo: https://demo.neuraweb.fr`,
      vi: `Rất vui được hỗ trợ! 😊 Để tiến hành, đơn giản nhất là yêu cầu **báo giá miễn phí** (phản hồi trong 48 giờ làm việc) hoặc dùng thử bản demo: https://demo.neuraweb.fr`,
    },
    chips: ['quote', 'demo'],
    lead: 'button',
  },
];

/** Cherche la meilleure entrée FAQ pour un message. Retourne null si rien ne correspond (→ modèle). */
export function matchFaq(message: string, lang: string): FaqResult | null {
  const l = (['fr', 'en', 'es', 'vi'].includes(lang) ? lang : 'fr') as FaqLang;
  const msg = normalizeFaq(message).trim();
  // Les longues questions ouvertes (récits, plusieurs phrases) sont laissées au modèle.
  if (!msg || msg.length > 140) return null;

  let best: { entry: FaqEntry; score: number } | null = null;
  for (const entry of FAQ) {
    if (entry.unless?.some((w) => hasWord(msg, normalizeFaq(w)))) continue;
    let score = 0;
    for (const kw of entry.keywords[l]) {
      const k = normalizeFaq(kw).trim();
      if (k && hasWord(msg, k)) score += k.length + entry.priority;
    }
    if (score > 0 && (!best || score > best.score)) best = { entry, score };
  }
  if (!best) return null;
  const { entry } = best;
  return { id: entry.id, answer: entry.answer[l], chips: entry.chips, lead: entry.lead };
}

export function chipLabels(ids: string[], lang: string): { id: string; label: string }[] {
  const l = (['fr', 'en', 'es', 'vi'].includes(lang) ? lang : 'fr') as FaqLang;
  return ids.filter((id) => CHIP_LABELS[id]).map((id) => ({ id, label: CHIP_LABELS[id][l] }));
}

export const FAQ_IDS = FAQ.map((f) => f.id);
