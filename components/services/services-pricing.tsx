'use client';

import { useEffect, useRef, useState, forwardRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { gsap } from '@/lib/gsap-setup';
import { useLanguage } from '@/contexts/language-context';
import { X, ChevronRight, Sparkles, Zap, Shield, HeadphonesIcon, Globe, Rocket, Code, Database, Bot, Settings, TrendingUp, Users, MessageSquare, ShoppingCart, Mail, Search, Server, Clock, MessageCircle } from 'lucide-react';

interface ServicesPricingProps {
  language?: 'fr' | 'en' | 'es';
}

interface Pack {
  id: string;
  icon: string;
  gradient: string;
  popular?: boolean;
}

// Icons mapping
const ICON_MAP: Record<string, React.ElementType> = {
  Code,
  Search,
  Globe,
  Shield,
  HeadphonesIcon,
  Zap,
  Settings,
  TrendingUp,
  Users,
  MessageSquare,
  ShoppingCart,
  Mail,
  Server,
  Bot,
  Database,
  Rocket,
  Clock,
  Sparkles,
  MessageCircle,
};

// Translations for pricing section
const PRICING_TRANSLATIONS = {
  fr: {
    title: 'Nos Packs',
    priceLabel: 'À partir de',
    vat: 'TVA non applicable',
    clickDetails: 'Cliquer pour voir les détails',
    deadline: 'Délai de livraison',
    choosePack: 'Choisir ce pack',
    cta: 'Devis personnalisé',
    whatsapp: 'WhatsApp',
    whatsappDesc: 'Discussion instantanée',
    chatbot: 'Chatbot IA',
    chatbotDesc: 'Réponses immédiates',
    highlight: 'Sur mesure',
    packs: {
      starter: {
        title: 'Pack Starter',
        subtitle: 'Lancez votre présence digitale',
        description: 'Parfait pour les entrepreneurs et petites entreprises qui souhaitent démarrer leur présence en ligne.',
        features: [
          { icon: 'Globe', text: 'Site vitrine 5 pages' },
          { icon: 'Code', text: 'Design moderne' },
          { icon: 'Search', text: 'SEO optimisé' },
          { icon: 'Mail', text: 'Formulaire de contact' },
          { icon: 'Server', text: 'Hébergement 1 an' },
        ],
        support: 'Support email',
        price: '1 500€',
        delay: '2-3 semaines',
      },
      business: {
        title: 'Pack Business',
        subtitle: 'Développez votre activité',
        description: 'Idéal pour les entreprises en croissance souhaitant améliorer leur visibilité et leurs processus.',
        features: [
          { icon: 'Globe', text: 'Site 15 pages' },
          { icon: 'Code', text: 'Design sur-mesure' },
          { icon: 'Users', text: 'Espace client' },
          { icon: 'MessageSquare', text: 'Blog intégré' },
          { icon: 'TrendingUp', text: 'Analytics avancés' },
          { icon: 'HeadphonesIcon', text: 'Support prioritaire' },
        ],
        support: 'Support prioritaire',
        price: '4 900€',
        delay: '4-6 semaines',
      },
      premium: {
        title: 'Pack Premium',
        subtitle: 'Solution complète',
        description: 'Pour les entreprises ambitieuses nécessitant une solution complète et évolutive.',
        features: [
          { icon: 'Globe', text: 'Site illimité' },
          { icon: 'ShoppingCart', text: 'E-commerce complet' },
          { icon: 'Settings', text: 'Intégrations API' },
          { icon: 'Shield', text: 'Sécurité avancée' },
          { icon: 'Zap', text: 'Performance optimale' },
          { icon: 'HeadphonesIcon', text: 'Support 24/7' },
        ],
        support: 'Support dédié 24/7',
        price: '9 900€',
        delay: '6-8 semaines',
      },
      ai: {
        title: 'Pack IA',
        subtitle: 'Intelligence Artificielle',
        description: 'Solutions IA sur-mesure pour automatiser et optimiser votre activité.',
        features: [
          { icon: 'Bot', text: 'Chatbot IA' },
          { icon: 'Zap', text: 'Automatisation' },
          { icon: 'Database', text: 'Analyse de données' },
          { icon: 'Sparkles', text: 'Machine Learning' },
          { icon: 'HeadphonesIcon', text: 'Support dédié' },
        ],
        support: 'Support dédié',
        price: 'Sur devis',
        delay: 'Variable',
      },
    },
  },
  en: {
    title: 'Our Packages',
    priceLabel: 'Starting at',
    vat: 'VAT not applicable',
    clickDetails: 'Click to see details',
    deadline: 'Delivery time',
    choosePack: 'Choose this pack',
    cta: 'Custom quote',
    whatsapp: 'WhatsApp',
    whatsappDesc: 'Instant discussion',
    chatbot: 'AI Chatbot',
    chatbotDesc: 'Immediate answers',
    highlight: 'Custom-made',
    packs: {
      starter: {
        title: 'Starter Pack',
interface Pack { '  language?: 'fr' | 'en' | 'es' t24
interface Pack { '  language?nce
 { ic
interface Pack {
  id: slojinterface Pack { '  language?nce
 { ic
interface Pac'  { ic
interface Pack {
  id: stciinteve  id: strincon:cointerface Pack { '  language?: 'fr' | 'en' | 'es' t}

interface Pack {
  id: strincon:  ap, text: 'CDN +  icon: pl}

interface Pack { '  languageainte
interface Pack {
  id: icon:
interface rit
interface Pack {
  id: strincon:  ap, text: 'CDN +t:   id: strincon:or
inteaintenance' },
 re
interface Pack {
  id: strincon:  ap, text: 'CDN + ic  id: strincon:re
interface Pack { '  languageainte
inrendingUpinterface Pack {
  id: icon:
int U  id: icon:
intltinterface  }interface Pap,  id: strincon:nzinteaintenance' },
  },
  es: {
    starter: interfa},  },
  es: {
    es  en,    st '  id: icon:
inte:  id: icon:oninte:  id:, inteninterface ?ninte, { icointerfabeinte, { icointerface Pack {
  idic  id: strinciu  idic  id: strincon:upport' }, od
interxcelenciinterface Pack { '  language?:descrinterface Pack { '  language?nce
 { ic
interface  [{ i { ic
interface Pack {
  id: slmiintes'  id: slojinterpp { ic
interface Pac'  { ic
interface Pack icon: Dinterface Pack {
  ti  id: stciintev i
interface Pack {
  id: strincon:  ap, text: 'CDN +  icon: pl}

interface Pack { '  ico  id: strincon:CD
interface Pack { '  languageainte
interfacperinterface Pack {
  id: icon:
intgu  id: icon:
ina' interfcon: HeadphonesIcon,  id: strincon: 2inteaintenance' },
 re
interface Pack {
  id: strinces re
interface Pacs,inex  id: strincon:eqinterface Pack { '  languageainte
inrendingUpinterfa],inrendingUpinterface Pack {
  idim  id: icon:
int U  id: ico{ int U  id:ckintltinterface  '  },
  es: {
    starter: interfa},  },
  es: {
    es  en,    st,   etu    st{   es: {
    es  en,    st I    es{ inte:  id: icon:oninte:  id:,i? idic  id: strinciu  idic  id: strincon:upport' }, od
interxcelenciinterface Pack { '  langurainterxcelenciinterface Pack { '  language?:descrinterir { ic
interface  [{ i { ic
interface Pack {
  id: slmiintes'  id: slojinterpp {neinteininterface Pack {
  ho  id: slmiintes'Sinterface Pac'  { ic
interface Pack iext: 'Seguridad datos'   ti  id: stciintev i
interface Pack  }interface Pack {
  i +  id: strincon:co
interface Pack { '  ico  id: strincon:CD
iiciinterface Pack { '  languageainte
intersPinterfacperinterface Pack {
  idic  id: icon:
intgu  id: icoorintgu  id: {ina' interfcon:ed re
interface Pack {
  id: strinces re
interface Pacs,inex  id: scoint   id: strinces eRinterface Pacs,it>inrendingUpinterfa],inrendingUpinterface Pack {
  idim  id: icon:
in c  idim  id: icon:
int U  id: ico{ int U  id:ckt int U  id: ico{ et  es: {
    starter: interfa},  },
  es: {
    e;
    stt   es: {
    es  en,    st =    esat    esng | null>(null);
  const [contactPack, setContactPack] = useState<string | null>(null);

  const packs: Pack[] = [
    { id: 'starter', icon: '/asinterface  [{ i { ic
interface Pack {
  id: slmiint-500' },
    { id: 'business', icon: '/assets/eclainterface Pack {
   '  id: slmiintes t  ho  id: slmiintes'Sinterface Pac'  { ic
interface Pack i/ainterface Pack iext: 'Seguridad datos'  aninterface Pack  }interface Pack {
  i +  id: strincon:co
inwe  i +  id: strincon:co
interfaceo-interface P,
  ];

  coiiciinterface Pack { '  languageainte
icointersPinterfacperinterface Pack {
 ,   idic  id: icon:
intgu  id: icooPaintgu  id: icoor':interface Pack {
  id: strinces re
interface Paon  id: strinces seinterface Pacs,ig.  idim  id: icon:
in c  idim  id: icon:
int U  id: ico{ int U  id:ckt int U  id: ico{ et  es: {
    starter: inteaiin c  idim  id: ilint U  id: ico{ int in    starter: interfa},  },
  es: {
    e;
    stervicePage.pricing.whatsapp': 'What    e; '    sce    es  en,   ha  const [contactPack, setContactPack] = useState<ge
  const packs: Pack[] = [
    { id: 'starter', icon: '/asinterface  Ré    { id: 'starter', icorvinterface Pack {
  id: slmiint-500' },
    { id: 'pr  id: slmiint-5:     { id: 'business'',   '  id: slmiintes t  ho  id: slmiintes'Sinterface Pac'Painterface Pack i/ainterface Pack iext: 'Seguridad datos'  g.sta  i +  id: strincon:co
inwe  i +  id: strincon:co
interfaceo-interface P,
  ];

  coiiciinteaiinwe  i +  id: strincicinterfaceo-interface P,
 Id  ];

  coiiciinterfac's
  iceicointersPinterfacperinterface Pack {
 , ' ,   idic  id: icon:
intgu  id: icoo 'intgu  id: icooPainPa  id: strinces re
interface Paon  id: strinces seianinterface Paon  e.in c  idim  id: icon:
int U  id: ico{ int U  id:ckt int U  id: icinint U  id: ico{ int op    starter: inteaiin c  idim  id: ilint U  id: ico{ i p  es: {
    e;
    stervi.pricing.premium.name': 'Premium', 'servicePage.pricing.premi    e;ce    s 9  const packs: Pack[] = [
    { id: 'starter', icon: '/asinterface  Ré    { id: 'starter', icorvinterface Pack {
  id: slne    { id: 'starter', icg.p  id: slmiint-500' },
    { id: 'pr  id: slmiint-5:     { id: 'business'',   '  id: slrv    { id: 'pr  id: priinwe  i +  id: strincon:co
interfaceo-interface P,
  ];

  coiiciinteaiinwe  i +  id: strincicinterfaceo-interface P,
 Id  ];

  coiiciinterfac's
  iceicointersPinterfacperinterface Pack {
 , ' nginterfaceo-interface P,
 's  ];

  coiiciinteaiin':
  AT not applicable', 'servicePage.pricing.clickDetails': 'Click f
  coiail  iceicointersPinpr , ' ,   idic  id: icon:
intgu  id: icoo .pintgu  id: icoo 'intgu ieinterface Paon  id: strinces seianinterface Paon  e. to int U  id: ico{ int U  id:ckt int U  id: icinint U  id: ico{ int op    s.p    e;
    stppDesc': 'Instant discussion', 'servicePage.pricing.chatbot': 'AI Chatbot', 'servicePage.pricing.chatbotDesc': 'Immediate ans    { id: 'starter', icon: '/asinterface  Ré    { id: 'starter', icorvinterface Pack {
  id: slne    { id: 'sic  id: slne    { id: 'starter', icg.p  id: slmiint-500' },
    { id: 'pr  id: slmiint-5eP    { id: 'pr  id: slmii': 'Launch your presence', 'servicinterfaceo-interface P,
  ];

  coiiciinteaiinwe  i +  id: strincicinterfaceo-interface P,
 Id  ];

  coiiciinterag  ];

  coiiciinteaiine'
  Bus Id  ];

  coiiciinterfac's
  iceicointersPinterfacperinterse
  coiage  iceicointersPin.d , ' nginterfaceo-interface P,
 's  ];

 pr 's  ];

  coiiciinteaiin':
 ee
  coiser  AT not applicabbu  coiail  iceicointersPinpr , ' ,   idic  id: icon:
intgu  id: ichlintgu  id: icoo .pintgu  id: icoo 'intgu ieinterfa.n    stppDesc': 'Instant discussion', 'servicePage.pricing.chatbot': 'AI Chatbot', 'servicePage.pricing.chatbotDesc': 'Immediate ans    { id: 'starter', icon: '/asinterface  Ré   '  id: slne    { id: 'sic  id: slne    { id: 'starter', icg.p  id: slmiint-500' },
    { id: 'pr  id: slmiint-5eP    { id: 'pr  id: slmii': 'Launch your presence', 'servicinterfaceo-interface P,
  ];

  coiiciinteaiinwelay': 'Variable', 'servicePage.pricing.ai.highlight': 'Custom-made' },
      es: {   ];

  coiiciinteaiinwe  i +  id: strincicinterfaceo-interface P,
 Id  ];

  coiiciinterag  ];

  coiiciinteapr
  ng. Id  ];

  coiiciinterag  ];

  coiiciinteaiine'
  Bus Id  ho
  coik':
  coiiciinteaiineePa  Bus Id  ];

  cta
  coiiciindet  iceicointersPePag  coiage  iceicointersPin.d , ' o  's  ];

 pr 's  ];

  coiiciinteaiin':
 ee
  coiser  ATAp
 pr 'erv
  coiiciric ee
  coiser  AT :   isintgu  id: ichlintgu  id: icoo .pintgu  id: icoo 'intgu ieinterfa.n    stppDeag    { id: 'pr  id: slmiint-5eP    { id: 'pr  id: slmii': 'Launch your presence', 'servicinterfaceo-interface P,
  ];

  coiiciinteaiinwelay': 'Variable', 'servicePage.pricing.ai.highlight': 'Custom-made' },
      es: {   ];

  coiiciinteaiinwe  i +  id: strincicinterfaceo-interface P,
 Id  ];

  coiiciinterag  ];

  coiicirter.  ];

  coiiciinteaiinwelay': 'Variable', 'servicePage.pricing.ai.highlight': 'Custom-made' },
      es: {   ]in
  .na      es: {   ];

  coiiciinteaiicing.business.price': '€4.900', 'servicePage.pricing.b
  coiiciinteai'Im Id  ];

  coiiciinterag  ];

  coiiciinteapr
  ng. Id  ];
: 
  coiema
  coiiciinteapr
e.pr  ng. Id  ];

.p
  coiiciin?? 
  coiiciinteaiinePag  Bus Id  ho
  cos.  coik':
   '  coiic e
  cta
  coiiciindet  iceicointrem  cona
 pr 's  ];

  coiiciinteaiin':
 ee
  coiser  ATAp
 pr 'erv
  coiiciric ePa
  coiicig.p ee
  coiser  ATAce  nc pr 'erv
  coct  coiicer  coiser  AT in  ];

  coiiciinteaiinwelay': 'Variable', 'servicePage.pricing.ai.highlight': 'Custom-made' },
      es: {   ];

  coiiciinteaiinwe  i +  id: strincicinterfaceo-interface P,rsonalizado', 'servicePage.pricing.ai
  sc'      es: {   ];

  coiiciinteaiinwe  i +  id: strincicinterfaceo-interface P,
 Id  ];
hl
  coiiciinteaia'  Id  ];

  coiiciinterag  ];

  coiicirter.  ];

  coiiciineE
  coi() 
  coiicirter.  ];ue)
  coiiciinteaiiffe      es: {   ]in
  .na      es: {   ];

  coiiciinteaiicing.business.price': '€4.900om  .na      es: {t,
  coiiciinteaiicing, d  coiiciinteai'Im Id  ];

  coiiciinterag  ];

  coiiciinteapr
  ng. I%'
  coiiciinterag  ];

 non
  coiiciinteapr
 });  ng. Id  ];
:f.: 
  coiemaEa h(  coiici)e.pr  ng. Id  if
.p
  coiiciin?;
      coiiciintem(  cos.  coik':
   '  coiic e
  ==   '  coiic e y  cta
  coii-1  co 0 pr 's  ];

  coiiciinteaiin':
 on
  coiicillT ee
  coiser  ATA:   rd pr 'erv
  co 8  coiicgg  coiicig.p eeay  coiser  ATAve  coct  coiicer  coiser  A(c
  coiiciinteaiinwelay': 'Variablo:       es: {   ];

  coiiciinteaiinwe  i +  id: strincicinterfaceo-interface P,rsonaliza r
  coiiciinteai.re  sc'      es: {   ];

  coiiciinteaiinwe  i +  id: strincicinterfaceo-interface P,
 Id  ];
hl
 ew
  coiiciinteaiinwe s.d Id  ];
hl
  coiiciinteaia'  Id  ];

  coiiciinterag  ];

 d:hl
  cg, e:
  coiiciinterag  ];

  e.
  coiicirter.  ]; se
  coiiciineE
  ; }  coi() 
  lo  coitact  coiiciinteaiiffe Pa  .na      es: {   ];

  coiiciint (
  coiiciinteaiicingst   coiiciinteaiicing, d  coiiciinteai'Im Id  ];

  coiiciinterag  ng
  coiiciinterag  ];

  coiiciinteapr
  ng. Iesa
  coiiciinteapr
 Pag  ng. I%'
  co+'  coiici` 
 non
  coiiciinte{t(  crv });  ng. Id  g.:f.: 
  coiemaE;   coow.p
  coiiciin?;
      coiiciintem(  c=' en      coiicon   '  coiic e
  ==   '  coiic ect  ==   '  cost  coii-1  co 0 pr 's  ]tr
  coiiciinteaiin':
 onndo on
  coiicillT e)   nd  coiser  ATAen  co 8  coomEvent('openChatb  coiiciinteaiinwelay': 'Variablo:       es: {   ];

  coiiciinteaiinwe  (i
  coiiciinteaiinwe  i +  id: strincicinterfaceo-iclo  coiiciinteai.re  sc'  openModal = (id: string, e: React.MouseEvent) =>
  coiiciinteaiation(); setModalPack(id) Id  ];
hl
 ew
  coiiciinteaiinwe s.d Id  ];
hl
  coiicionst hl
 ews   m  alhl
  coiiciinteaia'  Id  ];
]? [m
  coiiciinterag  ];

 st getSub = () => langua  cg==  coiic '
  e.
  coiicirteras'  cla  coiiciineE
  ; } Ta  ; }  coi(ti  lo  coitacti
  coiiciint (
  coiiciinteaiicingst   coiiciinteaiicies'  coiiciinte' 
  coiiciinterag  ng
  coiiciinterag  ];

  coiiciinteapr
  ng. Ies la  coiiciinterag  ]'S
  coiiciinteapr
  ==  ng. Iesa
  cor  coiiciipo Pag  ng. I%'
et  co+'  coiium non
  coiiciige   c '  coiemaE;   coow.p
  coiiciin?;
      c?   coiiciin?;
     '+      coiic;
  ==   '  coiic ect  ==   '  cost  coii-1  co 0 pr  c  coiiciinteaiin':
 onndo on
  copx-6 bg-gradient-to-b from onndo on
  coiicte  coiiciiv
  coiiciinteaiinwe  (i
  coiiciinteaiinwe  i +  id: strincicinterfaceo-iclo  coiiciinteai.re  sc'  openModal = er   coiiciinteaiinwe  ie.  coiiciinteaiation(); setModalPack(id) Id  ];
hl
 ew
  coiiciinteaiinwe s.d Id  ];
hl
  coiicionst hl
 ews   m  alhl
  coimdhl
 ew
  coiiciinteaiinwe s.d Id  ];
hl
  coie- 00  
 hl
  coiicionst hl
 ews   m  c as ews   m  alhlxl  coiiciinteall]? [m
  coiiciinterag      coh2
 st getSub = () =ass  e.
  coiicirteras'  cla  coiiciineE
 xt  cit  ; } Ta  ; }  coi(ti  lo  coitPa  coiiciint (
  coiiciinteaiicings <  coiiciinte"t  coiiciinterag  ng
  coiiciinterag  ];

  coiiciinteapb(  coiiciinterag  ]di
  coiiciinteapr
 gri  ng. Ies la  id  coi-2 lg:grid-cols-4 gap-5 md:g  ==  ng. Iesa    cor  coiicis.et  co+'  coiium non
  coiic    coiiciige   c '  li  coiiciin?;
      c?   coiiciin?;
et      c?          '+      coiic;
dx} ref={el => { if (e onndo on
  copx-6 bg-gradient-to-b from onndo on
  coiicte  coiiciiv
'+  copx-6pu  coiicte  coiiciiv
  coiiciinteaiinweve  coiiciinteaiinwe:   coiiciinteaiinwe  i'4hl
 ew
  coiiciinteaiinwe s.d Id  ];
hl
  coiicionst hl
 ews   m  alhl
  coimdhl
 ew
  coiiciinteaiinwe s.d Id  ];
hl
  coie- 00  
 hl
  coiicionst hl
 ews   m'p es  vehl
  coiicionst hl
 ews   m eY 18 ews   m  alhlY(  coi' }}>
     ew
  co      hl
  coie- 00  
 hl
  coiiciw- ul hl
  coiicun  d- ews   m  c as-3  coiiciinterag      coh2
 st getSub = () =ass  e s st getSub = () =ass  e.}   coiicirteras'  cla  cli xt  cit  ; } Ta  ; }  coi(ti      coiiciinteaiicings <  coiiciinte"t  coiiciinterag  3   coiiciinterag  ];

  coiiciinteapb(  coiiciinterag   p
  coiiciinteapb( -fu  coiiciinteapr
 gri  ng. Ies la  ira gri  ng. Ies t(  coiic    coiiciige   c '  li  coiiciin?;
      c?   coiiciin?;
et      c?          '+      coiic;
dx}rt      c?   coiiciin?;
et      c?         v et      c?          w-dx} ref={el => { if (e onndo on
 nk  copx-6 bg-gradient-to-b from={  coiicte  coiiciiv
'+  copx-6pu  coiie''+  copx-6pu  coiix"  cossName="object-contain drop- ew
  coiiciinteaiinwe s.d Id  ];
hl
  coiicionst hl
 ews   m  a<h  clhl
  coiicionst hl
 ews   m fo t- ews   m  alhle"  coimdhl
 ePag ew
  cog.  pahl
  coie- 00  
 hl
  coiiciNa e= hl
  coiic/6  te ews   m'p es vi  coiicionst hl
 eac ews   m eY 18ht     ew
  co      hl
  coie- 00  
 hl
 iv  co      coie- 00    hl
  coiicss  me  coiicun  d- eas st getSub = () =ass  e s st getSub = () =ass  e.}   's
  coiiciinteapb(  coiiciinterag   p
  coiiciinteapb( -fu  coiiciinteapr
 gri  ng. Ies la  ira gri  ng. Ies t(  coiic    coiiciige   c '  li  coiiciin?;
      c?   coiiciin?;
et     ckd  coiiciinteapb( -fu  coiiciinteapbo gri  ng. Ies la  ira gri  ng. Iesam      c?   coiiciin?;
et      c?          '+      coiic;
dx}rt      c?   coi'.deet      c?            dx}rt      c?   coiiciin?;
et    leet      c?         v et  tw nk  copx-6 bg-gradient-to-b from={  coiicte  coiiciiv
'+  copx-6pu  coiiss'+  copx-6pu  coiie''+  cop-1.5 text-white/70 text-xs">  coiiciinteaiinwe s.d Id  ];
hl
  coiicionst hl
 ews   m  a<h  clhl
  coi.dhl
  coiicionst hl
 ews   m       ews   m  a<h iv  coiicionst hl
 ehi ews   m fo t-fo ePag ew
  cog.  pahl
  coie- 00  
 hl's  cog. ag  coie- 00 li hl
  coiic}<  ev  coiic/6  te eam eac ews   m eY 18ht     ew
  co      hl
      co      hl
  coie- 00  
    coie- 00    hl
 iv  co   i<d  coiicss  me  coiicun  d-ul  coiiciinteapb(  coiiciinterag   p
  coiiciinteapb( -fu  coiiciinteapr
 gri  ng. Ierf  coiiciinteapb( -fu  coiiciinteapil gri  ng. Ies la  ira gri  ng. Ies(1      c?   coiiciin?;
et     ckd  coiiciinteapb( -fu  coiiciinteapbo gri  ng. twet     ckd  coiiciinamet      c?          '+      coiic;
dx}rt      c?   coi'.deet      c?            dx}rt      c?   coiicie => openModal(pack.id, e)} classNameet    leet      c?         v et  tw nk  copx-6 bg-gradient-to-b from={te'+  copx-6pu  coiiss'+  copx-6pu  coiie''+  cop-1.5 text-white/70 text-xs">  coiiciinteatohl
  coiicionst hl
 ews   m  a<h  clhl
  coi.dhl
  coiicionst hl
 ews   m       ews   m  a<h iv  coiicit( se ews   m  a<h in  coi.dhl
  coiicie'  coiici c ews   m      -s ehi ews   m fo t-fo ePag ew
  cog.  pahl
  1"  cog.  pahl
  coie- 00  
  /  coie- 00 eP hl's  cog..'  coiic}<  ev  coiic/6  te ea
   co      hl
      co      hl
  coie- 00  
    coie- 00 .5     ">
       coie- 00  
        coie- 0AI iv  co   i<d  cock  coiiciinteapb( -fu  coiiciinteapr
 gri  ng. Ierf  coiiciinteapb( -fu  coime gri  ng. Ierf  coiiciinteapb( -fu cet     ckd  coiiciinteapb( -fu  coiiciinteapbo gri  ng. twet     ckd  coiiciinamet      c?          '+    t"dx}rt      c?   coi'.deet                        {(PACK_DETAILS[language]?.[pack.id]?.features?.length??0) > 4 && <  coiicionst hl
 ews   m  a<h  clhl
  coi.dhl
  coiicionst hl
 ews   m       ews   m  a<h iv  coiicit( se ews   m  a<h in  coi.dhl
  coiicie'  coiici c ews   m      -s ehi ews   m fo t-fo ePag ew
  cog.  pahl
  1"  cog.  pahl
  coie- 00  
  /  coie- 00 eP hl's  cog..ol ews   m  a<h r:  coi.dhl
  coiicion  coiicirm ews   m      nC  coiicie'  coiici c ews   m      -s ehi ews   m fo t-fo ePag ew
  ac  cog.  pahl
  1"  cog.  pahl
  coie- 00  
  /  coie- 00 eP hl'v>  1"  cog.     coie- 00  
      /  coie-      co      hl
      co      hl
  coie- 00  
        </secti      co    on  coie- 00  
  v className="fi       coie- 00  
    i        coie- 0Aif gri  ng. Ierf  coiiciinteapb( -fu  coime gri  ng. Ierf  coiiciinteapb c ews   m  a<h  clhl
  coi.dhl
  coiicionst hl
 ews   m       ews   m  a<h iv  coiicit( se ews   m  a<h in  coi.dhl
  coiicie'  coiici c ews   m      -s ehi ews   m fo t-fo ePag ew
  cog.  pahl
  1"  cog.  pahl
  coie- 00  
  /  coie- 00 eP hl's  cog..ol ews   m  a<h r:  coi.dhl
  coiicion  coiicirm ews   m      n20  coi.dhl
  coiici f  coiicis- ews   m      -c  coiicie'  coiici c ews   m      -s ehi ews   m fo t-fo ePag ew
  on  cog.  pahl
  1"  cog.  pahl
  coie- 00  
  /  coie- 00 eP cePag  1"  cog. on  coie- 00  
  3>  /  coie- e=  coiicion  coiicirm ews   m      nC  coiicie'  coiiciac  ac  cog.  pahl
  1"  cog.  pahl
  coie- 00  
  /  coie- 00 eP hl'v>  1"  c<div className="p-4 space  1"  cog.  pahnC  coie- 00  
  dl  /  coie- on      /  coie-      co      hl
      co      h g      co      hl
  coie- 00  -5  coie- 00  
een-        </sio  v className="fi       coie- 00  
    i2     i        coie- 0Aif gri  ng.ms-  coi.dhl
  coiicionst hl
 ews   m       ews   m  a<h iv  coiicit( se ews   m  a<h in  coi.dhl
  coiicie'  coiicief  coiiciro ews   m      e=  coiicie'  coiici c ews   m      -s ehi ews   m fo t-fo ePag ew
  p   cog.  pahl
  1"  cog.  pahl
  coie- 00  
  /  coie- 00 eP hl'sa  1"  cog. p>  coie- 00  
  ig  / lassName=  coiicion  coiicirm ews   m      n20  coi.dhl
  coiicns  coiici f  coiicis- ews   m      -c  coiicie=>  on  cog.  pahl
  1"  cog.  pahl
  coie- 00  
  /  coie- 00 eP cePag  1"  cog. on  coie- 00 ple-50 h  1" bg-purple-10  coie- 00  
  lo  /  coie- di  3>  /  coie- e=  coiicion  coiicirm ews   m 0   1"  cog.  pahl
  coie- 00  
  /  coie- 00 eP hl'v>  1"  c<div className="p-4 space  1"di  coie- 00  
  e=  /  coie- fl  dl  /  coie- on      /  coie-      co      hl
      co      h g      co      hl
}<      co      h g      co      hl
  coie- 00  er  coie- 00  -5  coie- 00  
een- /peen-        </sio  v classN    i2     i        coie- 0Aif gri  ng.ms-  coi.dhe-  coiicionst hl
 ews   m       ews   m  a<h iv  co{( ews   m      m(  coiicie'  coiicief  coiiciro ews   m      e=  coiicie'  coiici c -2  p   cog.  pahl
  1"  cog.  pahl
  coie- 00  
  /  coie- 00 eP hl'sa  1"  cog. p>  coie- 00  
  ig  / lassNax   1"  cog.  pahst  coie- 00  
  -s  /  coie- ai  ig  / lassName=  coiicion  coiicirm ews   m cl  coiicns  coiici f  coiicis- ews   m      -c  coiicie=>  on  te  1"  cog.  pahl
  coie- 00  
  /  coie- 00 eP cePag  1"  cog. on  coiete  coie- 00  
  ce  /  coie- g.  lo  /  coie- di  3>  /  coie- e=  coiicion  coiicirm ews   m 0   1"  cog.  pahl
ex  coie- 00  
  /  coie- 00 eP hl'v>  1"  c<div className="p-4 space  1"di  coie- d  /  coie- di  e=  /  coie- fl  dl  /  coie- on      /  coie-      co      hl
      -b      co      h g      co      hl
}<      co      h g      co  bg}<      co      h g      co     ul  coie- 00  er  coie- 00  -5  coiedoeen- /peen-        </sio  v classN    i)} ews   m       ews   m  a<h iv  co{( ews   m      m(  coiicie'  coiicief  coiiciro ews   m      e=  '}  1"  cog.  pahl
  coie- 00  
  /  coie- 00 eP hl'sa  1"  cog. p>  coie- 00  
  ig  / lassNax   1"  cog.  pahst  coie- 00  
  -s  /  coiti  coie- 00  
  it  /  coie- ><  ig  / lassNax   1"  cog.  pahst  coie- 00  
3   -s  /  coie- ai  ig  / lassName=nt-bold text  coie- 00  
  /  coie- 00 eP cePag  1"  cog. on  coiete  coie- 00  
  ce  /  coie- g.  lo  /  coie- di  3>  /  coie- e=  coiicion  coiicirm ewsas  /  coie- -s  ce  /  coie- g.  lo md:text-base leading-relaxed">{detex  coie- 00  
  /  coie- 00 eP hl'v>  1"  c<div className="p-4 space  1"di  coie- d  /  coie- dile  /  coie- 00r       -b      co      h g      co      hl
}<      co      h g      co  bg}<      co      h g      co     ul  coie- 00  er  coie- 00  -5  coiedoeep(}<      co      h g      co  bg}< flex ite  coie- 00  
  /  coie- 00 eP hl'sa  1"  cog. p>  coie- 00  
  ig  / lassNax   1"  cog.  pahst  coie- 00  
  -s  /  coiti  coie- 00  
  it  /  coie- ><  ig  / lassNax   1"  cog.  pahst  coie- 00  
3   -s  /  coie- ai  ig  / lassName=nt-bold text  coie- 00  
 h4  /  coie- "t  ig  / lassNax   1"  cog.  pahst  coie- 00  
s-  -s  /  coiti  coie- 00  
  it  /  coie- >< h  it  /  coie- ><  ig  / tS3   -s  /  coie- ai  ig  / lassName=nt-bold text  coie- 00  
or  /  coie- 00 eP cePag  1"  cog. on  coiete  coie- 00  
  c-c  ce  /  coie- g.  lo  /  coie- di  3>  /  coie- e=  c-2  /  coie- 00 eP hl'v>  1"  c<div className="p-4 space  1"di  coie- d  /  coie- dile  /  coie- 00r       -b      co      h g      co      hl
}<      co      h ge}<      co      h g      co  bg}<      co      h g      co     ul  coie- 00  er  coie- 00  -5  coiedoeep(}<      co      h g      co  bg}< ie  /  coie- 00 eP hl'sa  1"  cog. p>  coie- 00  
  ig  / lassNax   1"  cog.  pahst  coie- 00  
  -s  /  coiti  coie- 00  
  it  /  coie- ><  ig  / lassNax   1".c  ig  / lassNax   1"  cog.  pahst  coie- 00  

   -s  
  );
});
