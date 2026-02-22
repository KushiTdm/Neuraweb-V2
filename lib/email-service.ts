// lib/email-service.ts
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Initialiser Resend seulement si la clé API est configurée
const resend = RESEND_API_KEY && RESEND_API_KEY !== 're_xxx_your_api_key_here' 
  ? new Resend(RESEND_API_KEY) 
  : null;

interface ContactEmailData {
  name: string;
  email: string;
  subject?: string;
  budget?: string;
  message: string;
  language?: string;
}

interface BookingEmailData {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  date: string;
  time: string;
  message?: string;
  language?: string;
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'contact@neuraweb.tech';
const TO_EMAIL = process.env.TO_EMAIL || 'contact@neuraweb.tech';

// ─────────────────────────────────────────────────────────────
// COULEURS DE LA MARQUE NEURAWEB
// ─────────────────────────────────────────────────────────────
const COLORS = {
  primary: '#6366f1',      // Indigo
  secondary: '#8b5cf6',    // Violet
  accent: '#22d3ee',       // Cyan
  rose: '#f43f5e',         // Rose
  dark: '#050510',         // Dark background
  darkCard: '#0f0f1a',     // Dark card
  light: '#f8fafc',        // Light background
  text: '#e5e7eb',         // Text light (pour fond sombre)
  textMuted: '#9ca3af',    // Text muted
  white: '#ffffff',
  border: 'rgba(255, 255, 255, 0.05)',
};

// Gradient principal NeuraWeb
const GRADIENT_BRAND = `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 50%, #a78bfa 100%)`;
const GRADIENT_LINE = `linear-gradient(90deg, transparent, ${COLORS.primary}, ${COLORS.secondary}, ${COLORS.accent}, transparent)`;

/**
 * Template de base pour tous les emails avec fond noir
 */
function getBaseStyles(): string {
  return `
    /* Reset */
    body, html { margin: 0; padding: 0; }
    
    /* Typography */
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: ${COLORS.text};
      background-color: ${COLORS.dark};
    }
    
    /* Container */
    .email-wrapper {
      width: 100%;
      padding: 40px 20px;
      background-color: ${COLORS.dark};
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: ${COLORS.darkCard};
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid ${COLORS.border};
      box-shadow: 0 0 40px rgba(99, 102, 241, 0.1);
    }
    
    /* Header */
    .email-header {
      background: ${GRADIENT_BRAND};
      padding: 50px 30px;
      text-align: center;
      position: relative;
    }
    
    .email-logo {
      font-size: 32px;
      font-weight: 800;
      color: ${COLORS.white};
      margin: 0;
      letter-spacing: -0.02em;
    }
    
    .email-tagline {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);
      margin: 8px 0 0 0;
      letter-spacing: 0.05em;
    }
    
    .email-title {
      font-size: 24px;
      font-weight: 700;
      color: ${COLORS.white};
      margin: 24px 0 0 0;
    }
    
    /* Content */
    .email-content {
      padding: 40px 30px;
      background-color: ${COLORS.darkCard};
    }
    
    .email-greeting {
      font-size: 18px;
      font-weight: 600;
      color: ${COLORS.white};
      margin: 0 0 20px 0;
    }
    
    .email-text {
      font-size: 15px;
      color: ${COLORS.textMuted};
      margin: 0 0 24px 0;
      line-height: 1.7;
    }
    
    /* Highlight Box */
    .highlight-box {
      background: ${GRADIENT_BRAND};
      border-radius: 12px;
      padding: 28px;
      text-align: center;
      margin: 28px 0;
    }
    
    .highlight-box .highlight-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: rgba(255, 255, 255, 0.8);
      margin: 0 0 8px 0;
    }
    
    .highlight-box .highlight-value {
      font-size: 22px;
      font-weight: 700;
      color: ${COLORS.white};
      margin: 0;
    }
    
    .highlight-row {
      display: inline-block;
      margin: 0 20px;
      vertical-align: top;
    }
    
    /* Fields */
    .field-group {
      margin: 24px 0;
    }
    
    .field-item {
      background-color: rgba(255, 255, 255, 0.03);
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 12px;
      border-left: 3px solid ${COLORS.primary};
    }
    
    .field-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: ${COLORS.primary};
      margin: 0 0 6px 0;
    }
    
    .field-value {
      font-size: 15px;
      font-weight: 500;
      color: ${COLORS.text};
      margin: 0;
    }
    
    .field-value a {
      color: ${COLORS.primary};
      text-decoration: none;
    }
    
    .field-value a:hover {
      text-decoration: underline;
    }
    
    /* Message Box */
    .message-box {
      background-color: rgba(255, 255, 255, 0.03);
      border-radius: 10px;
      padding: 20px;
      margin: 16px 0;
      border: 1px solid ${COLORS.border};
    }
    
    .message-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: ${COLORS.primary};
      margin: 0 0 10px 0;
    }
    
    .message-content {
      font-size: 15px;
      color: ${COLORS.text};
      margin: 0;
      white-space: pre-wrap;
    }
    
    /* Divider */
    .divider {
      height: 1px;
      background: ${GRADIENT_LINE};
      margin: 32px 0;
    }
    
    /* Footer - Style site web */
    .email-footer {
      background-color: ${COLORS.dark};
      padding: 40px 30px;
      text-align: center;
      border-top: 1px solid ${COLORS.border};
      position: relative;
    }
    
    .footer-glow {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80%;
      height: 1px;
      background: ${GRADIENT_LINE};
    }
    
    .footer-logo {
      font-size: 24px;
      font-weight: 800;
      background: ${GRADIENT_BRAND};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 16px 0;
    }
    
    .footer-description {
      font-size: 14px;
      color: ${COLORS.textMuted};
      margin: 0 0 24px 0;
      max-width: 280px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.6;
    }
    
    .footer-email {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: ${COLORS.textMuted};
      font-size: 14px;
      text-decoration: none;
      margin-bottom: 32px;
    }
    
    .footer-email-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid ${COLORS.border};
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    
    .footer-services {
      margin-bottom: 32px;
    }
    
    .footer-services-title {
      font-size: 13px;
      font-weight: 600;
      color: ${COLORS.white};
      margin: 0 0 16px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .footer-services-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .footer-services-list li {
      display: inline-block;
      margin: 0 8px;
    }
    
    .footer-service-link {
      font-size: 13px;
      color: ${COLORS.textMuted};
      text-decoration: none;
      transition: color 0.2s;
    }
    
    .footer-service-link:hover {
      color: ${COLORS.white};
    }
    
    .footer-links {
      margin-bottom: 32px;
    }
    
    .footer-link {
      display: inline-block;
      color: ${COLORS.primary};
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      margin: 0 12px;
      transition: color 0.2s;
    }
    
    .footer-link:hover {
      color: ${COLORS.white};
    }
    
    .footer-copyright {
      font-size: 12px;
      color: #4b5563;
      margin: 0 0 8px 0;
    }
    
    .footer-crafted {
      font-size: 12px;
      color: #4b5563;
      margin: 0;
    }
    
    .footer-heart {
      color: ${COLORS.primary};
    }
    
    /* Badge */
    .badge {
      display: inline-block;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
      color: ${COLORS.primary};
      font-size: 12px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 20px;
      border: 1px solid rgba(99, 102, 241, 0.3);
    }
  `;
}

/**
 * Footer HTML complet style site web
 */
function getFooterHTML(language: string = 'fr'): string {
  const description = language === 'en' 
    ? 'Premium agency specializing in custom web development, AI integration and automation.'
    : language === 'es'
    ? 'Agencia premium especializada en desarrollo web personalizado, integración de IA y automatización.'
    : 'Agence premium spécialisée en développement web sur mesure, intégration IA et automatisation.';
  
  const servicesTitle = language === 'en' ? 'Services' : language === 'es' ? 'Servicios' : 'Services';
  const services = language === 'en' 
    ? ['Web Development', 'Automation', 'AI Integration']
    : language === 'es'
    ? ['Desarrollo Web', 'Automatización', 'Integración IA']
    : ['Développement Web', 'Automatisation', 'Intégration IA'];
  
  const copyright = language === 'en'
    ? '© 2026 NeuraWeb. All rights reserved.'
    : language === 'es'
    ? '© 2026 NeuraWeb. Todos los derechos reservados.'
    : '© 2026 NeuraWeb. Tous droits réservés.';

  return `
    <div class="email-footer">
      <div class="footer-glow"></div>
      
      <!-- Logo -->
      <p class="footer-logo">NeuraWeb</p>
      
      <!-- Description -->
      <p class="footer-description">${description}</p>
      
      <!-- Email -->
      <a href="mailto:contact@neuraweb.tech" class="footer-email">
        <span class="footer-email-icon">✉</span>
        contact@neuraweb.tech
      </a>
      
      <!-- Divider -->
      <div class="divider"></div>
      
      <!-- Services -->
      <div class="footer-services">
        <p class="footer-services-title">⚡ ${servicesTitle}</p>
        <ul class="footer-services-list">
          ${services.map(s => `<li><span class="footer-service-link">• ${s}</span></li>`).join('')}
        </ul>
      </div>
      
      <!-- Links -->
      <div class="footer-links">
        <a href="https://neuraweb.tech" class="footer-link">neuraweb.tech</a>
        <a href="https://neuraweb.tech/contact" class="footer-link">${language === 'en' ? 'Contact' : language === 'es' ? 'Contacto' : 'Contact'}</a>
        <a href="https://neuraweb.tech/services" class="footer-link">${language === 'en' ? 'Services' : language === 'es' ? 'Servicios' : 'Services'}</a>
      </div>
      
      <!-- Divider -->
      <div class="divider"></div>
      
      <!-- Copyright -->
      <p class="footer-copyright">${copyright}</p>
      <p class="footer-crafted">Crafted with <span class="footer-heart">♥</span> by NeuraWeb</p>
    </div>
  `;
}

/**
 * Envoie un email de notification pour le formulaire de contact
 */
export async function sendContactEmail(data: ContactEmailData) {
  if (!resend) {
    console.warn('Resend API key not configured, skipping email');
    return { success: false, error: 'Resend API key not configured' };
  }

  const { name, email, subject, budget, message, language = 'fr' } = data;

  const emailSubject = language === 'en' 
    ? `✨ New contact request from ${name}`
    : language === 'es'
    ? `✨ Nueva solicitud de contacto de ${name}`
    : `✨ Nouvelle demande de contact de ${name}`;

  const titleText = language === 'en' 
    ? 'New Contact Request' 
    : language === 'es' 
    ? 'Nueva Solicitud de Contacto' 
    : 'Nouvelle Demande de Contact';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${emailSubject}</title>
  <style>${getBaseStyles()}</style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <!-- Header -->
      <div class="email-header">
        <h1 class="email-logo">NeuraWeb</h1>
        <p class="email-tagline">WEB · IA · AUTOMATISATION</p>
        <h2 class="email-title">${titleText}</h2>
      </div>
      
      <!-- Content -->
      <div class="email-content">
        <div class="field-group">
          <div class="field-item">
            <p class="field-label">${language === 'en' ? 'Name' : language === 'es' ? 'Nombre' : 'Nom'}</p>
            <p class="field-value">${name}</p>
          </div>
          
          <div class="field-item">
            <p class="field-label">Email</p>
            <p class="field-value"><a href="mailto:${email}">${email}</a></p>
          </div>
          
          ${subject ? `
          <div class="field-item">
            <p class="field-label">${language === 'en' ? 'Subject' : language === 'es' ? 'Asunto' : 'Sujet'}</p>
            <p class="field-value">${subject}</p>
          </div>
          ` : ''}
          
          ${budget ? `
          <div class="field-item">
            <p class="field-label">${language === 'en' ? 'Budget' : language === 'es' ? 'Presupuesto' : 'Budget'}</p>
            <p class="field-value"><span class="badge">${budget}</span></p>
          </div>
          ` : ''}
        </div>
        
        <div class="message-box">
          <p class="message-label">${language === 'en' ? 'Message' : language === 'es' ? 'Mensaje' : 'Message'}</p>
          <p class="message-content">${message.replace(/\n/g, '<br>')}</p>
        </div>
      </div>
      
      <!-- Footer -->
      ${getFooterHTML(language)}
    </div>
  </div>
</body>
</html>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: emailSubject,
      html: htmlContent,
      replyTo: email,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, id: result.data?.id };
  } catch (error: any) {
    console.error('Error sending contact email via Resend:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envoie un email de confirmation de réservation au client
 */
export async function sendBookingConfirmationEmail(data: BookingEmailData) {
  if (!resend) {
    console.warn('Resend API key not configured, skipping email');
    return { success: false, error: 'Resend API key not configured' };
  }

  const { name, email, phone, service, date, time, message, language = 'fr' } = data;

  const subject = language === 'en' 
    ? `✅ Booking Confirmed - ${date} at ${time}`
    : language === 'es'
    ? `✅ Reserva Confirmada - ${date} a las ${time}`
    : `✅ Réservation Confirmée - ${date} à ${time}`;

  const titleText = language === 'en' 
    ? 'Booking Confirmed' 
    : language === 'es' 
    ? 'Reserva Confirmada' 
    : 'Réservation Confirmée';

  const greeting = language === 'en' 
    ? `Hello ${name},` 
    : language === 'es' 
    ? `Hola ${name},` 
    : `Bonjour ${name},`;

  const introText = language === 'en' 
    ? 'Thank you for your booking. We\'re excited to discuss your project with you!' 
    : language === 'es' 
    ? '¡Gracias por su reserva! Estamos emocionados de discutir su proyecto con usted.' 
    : 'Merci pour votre réservation. Nous sommes impatients de discuter de votre projet avec vous !';

  const closingText = language === 'en' 
    ? 'We will contact you shortly to confirm the details. If you have any questions, feel free to reach out.' 
    : language === 'es' 
    ? 'Le contactaremos pronto para confirmar los detalles. Si tiene alguna pregunta, no dude en contactarnos.' 
    : 'Nous vous contacterons prochainement pour confirmer les détails. Si vous avez des questions, n\'hésitez pas à nous contacter.';

  const signOff = language === 'en' 
    ? 'See you soon,' 
    : language === 'es' 
    ? 'Hasta pronto,' 
    : 'À bientôt,';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>${getBaseStyles()}</style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <!-- Header -->
      <div class="email-header">
        <h1 class="email-logo">NeuraWeb</h1>
        <p class="email-tagline">WEB · IA · AUTOMATISATION</p>
        <h2 class="email-title">${titleText}</h2>
      </div>
      
      <!-- Content -->
      <div class="email-content">
        <p class="email-greeting">${greeting}</p>
        
        <p class="email-text">${introText}</p>
        
        <!-- Highlight Box with Date & Time -->
        <div class="highlight-box">
          <div class="highlight-row">
            <p class="highlight-label">${language === 'en' ? 'Date' : language === 'es' ? 'Fecha' : 'Date'}</p>
            <p class="highlight-value">${date}</p>
          </div>
          <div class="highlight-row">
            <p class="highlight-label">${language === 'en' ? 'Time' : language === 'es' ? 'Hora' : 'Heure'}</p>
            <p class="highlight-value">${time}</p>
          </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="field-group">
          ${service ? `
          <div class="field-item">
            <p class="field-label">${language === 'en' ? 'Service' : language === 'es' ? 'Servicio' : 'Service'}</p>
            <p class="field-value">${service}</p>
          </div>
          ` : ''}
          
          ${phone ? `
          <div class="field-item">
            <p class="field-label">${language === 'en' ? 'Phone' : language === 'es' ? 'Teléfono' : 'Téléphone'}</p>
            <p class="field-value">${phone}</p>
          </div>
          ` : ''}
        </div>
        
        ${message ? `
        <div class="message-box">
          <p class="message-label">${language === 'en' ? 'Your message' : language === 'es' ? 'Su mensaje' : 'Votre message'}</p>
          <p class="message-content">${message.replace(/\n/g, '<br>')}</p>
        </div>
        ` : ''}
        
        <p class="email-text">${closingText}</p>
        
        <p class="email-text" style="margin-bottom: 0;">
          ${signOff}<br>
          <strong style="background: ${GRADIENT_BRAND}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">L'équipe NeuraWeb</strong>
        </p>
      </div>
      
      <!-- Footer -->
      ${getFooterHTML(language)}
    </div>
  </div>
</body>
</html>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: subject,
      html: htmlContent,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, id: result.data?.id };
  } catch (error: any) {
    console.error('Error sending booking confirmation email via Resend:', error);
    return { success: false, error: error.message };
  }
}

// ─────────────────────────────────────────────────────────────
// INTERFACES FORMULAIRES HÔTEL
// ─────────────────────────────────────────────────────────────

interface HotelTokenEmailData {
  token: string;
  hotelName: string;
  email: string;
  contactName?: string;
  formUrl: string;
  language?: string;
}

interface HotelFormSubmissionData {
  submissionId: string;
  hotelName: string;
  email: string;
  phone?: string;
  typeEtablissement?: string;
  pays?: string;
  nbChambresTotal?: string;
  budget?: string;
  delai?: string;
  totalOneTime?: number;
  totalMonthly?: number;
  pdfUrl?: string;
  language?: string;
}

/**
 * Envoie un email avec le lien du formulaire hôtelier
 */
export async function sendHotelTokenEmail(data: HotelTokenEmailData) {
  if (!resend) {
    console.warn('Resend API key not configured, skipping email');
    return { success: false, error: 'Resend API key not configured' };
  }

  const { token, hotelName, email, contactName, formUrl, language = 'fr' } = data;

  const subject = language === 'en' 
    ? `✨ Your personalized form — ${hotelName}`
    : language === 'es'
    ? `✨ Tu formulario personalizado — ${hotelName}`
    : `✨ Votre formulaire personnalisé — ${hotelName}`;

  const titleText = language === 'en' 
    ? 'Your Form is Ready' 
    : language === 'es' 
    ? 'Tu Formulario está Listo' 
    : 'Votre Formulaire est Prêt';

  const greeting = language === 'en' 
    ? `Hello${contactName ? ` ${contactName}` : ''},` 
    : language === 'es' 
    ? `Hola${contactName ? ` ${contactName}` : ''},` 
    : `Bonjour${contactName ? ` ${contactName}` : ''},`;

  const introText = language === 'en' 
    ? `We have prepared a personalized form for <strong>${hotelName}</strong>. Please fill it out so we can create your website.` 
    : language === 'es' 
    ? `Hemos preparado un formulario personalizado para <strong>${hotelName}</strong>. Por favor, complétalo para que podamos crear tu sitio web.`
    : `Nous avons préparé un formulaire personnalisé pour <strong>${hotelName}</strong>. Merci de le remplir pour que nous puissions créer votre site web.`;

  const ctaText = language === 'en' ? 'Fill out the form' : language === 'es' ? 'Completar el formulario' : 'Remplir le formulaire';
  const validityText = language === 'en' ? 'This link is valid for 30 days.' : language === 'es' ? 'Este enlace es válido por 30 días.' : 'Ce lien est valable 30 jours.';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>${getBaseStyles()}</style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <!-- Header -->
      <div class="email-header">
        <h1 class="email-logo">NeuraWeb</h1>
        <p class="email-tagline">WEB · IA · AUTOMATISATION</p>
        <h2 class="email-title">${titleText}</h2>
      </div>
      
      <!-- Content -->
      <div class="email-content">
        <p class="email-greeting">${greeting}</p>
        
        <p class="email-text">${introText}</p>
        
        <!-- CTA Button -->
        <div class="highlight-box">
          <a href="${formUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 40px; border-radius: 8px;">
            ✏️ ${ctaText}
          </a>
        </div>
        
        <p class="email-text" style="text-align: center; color: ${COLORS.primary};">
          🔒 ${validityText}
        </p>
      </div>
      
      <!-- Footer -->
      ${getFooterHTML(language)}
    </div>
  </div>
</body>
</html>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: subject,
      html: htmlContent,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, id: result.data?.id };
  } catch (error: any) {
    console.error('Error sending hotel token email via Resend:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envoie un email de confirmation au client après soumission du formulaire hôtel
 * Même style que les confirmations de RDV
 */
export async function sendHotelFormConfirmationEmail(data: HotelFormSubmissionData) {
  if (!resend) {
    console.warn('Resend API key not configured, skipping email');
    return { success: false, error: 'Resend API key not configured' };
  }

  const { submissionId, hotelName, email, totalOneTime, totalMonthly, language = 'fr' } = data;

  const subject = language === 'en' 
    ? `✅ Formulaire bien reçu — ${hotelName}`
    : language === 'es'
    ? `✅ Formulario recibido — ${hotelName}`
    : `✅ Formulaire bien reçu — ${hotelName}`;

  const titleText = language === 'en' 
    ? 'Form Received' 
    : language === 'es' 
    ? 'Formulario Recibido' 
    : 'Formulaire Reçu';

  const greeting = language === 'en' ? `Hello,` : language === 'es' ? `Hola,` : `Bonjour,`;

  const introText = language === 'en' 
    ? `We have received your hotel project form for <strong>${hotelName}</strong>. Our team will analyze your request and contact you within 48 hours.`
    : language === 'es' 
    ? `Hemos recibido tu formulario de proyecto hotelero para <strong>${hotelName}</strong>. Nuestro equipo analizará tu solicitud y te contactará en 48 horas.`
    : `Nous avons bien reçu votre formulaire de projet hôtelier pour <strong>${hotelName}</strong>. Notre équipe analysera votre demande et vous contactera sous 48h.`;

  const pricingTitle = language === 'en' ? 'Estimated Price' : language === 'es' ? 'Precio Estimado' : 'Prix Estimé';
  const oneTimeLabel = language === 'en' ? 'One-time' : language === 'es' ? 'Único' : 'Unique';
  const monthlyLabel = language === 'en' ? 'Monthly' : language === 'es' ? 'Mensual' : 'Mensuel';

  const nextStepsTitle = language === 'en' ? 'What happens next?' : language === 'es' ? '¿Qué sigue?' : 'La suite ?';
  const steps = language === 'en' 
    ? ['Our team will analyze your project carefully.', 'We will contact you within 48 hours.', 'We will prepare a personalized proposal.']
    : language === 'es'
    ? ['Nuestro equipo analizará tu proyecto cuidadosamente.', 'Te contactaremos en 48 horas.', 'Prepararemos una propuesta personalizada.']
    : ['Notre équipe analysera votre projet avec attention.', 'Nous vous contacterons sous 48h.', 'Nous préparerons une proposition personnalisée.'];

  const closingText = language === 'en' 
    ? 'If you have any questions, feel free to contact us.'
    : language === 'es' 
    ? 'Si tienes alguna pregunta, no dudes en contactarnos.'
    : 'Si vous avez des questions, n\'hésitez pas à nous contacter.';

  const signOff = language === 'en' 
    ? 'See you soon,' 
    : language === 'es' 
    ? 'Hasta pronto,' 
    : 'À bientôt,';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>${getBaseStyles()}</style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <!-- Header -->
      <div class="email-header">
        <h1 class="email-logo">NeuraWeb</h1>
        <p class="email-tagline">WEB · IA · AUTOMATISATION</p>
        <h2 class="email-title">${titleText}</h2>
      </div>
      
      <!-- Content -->
      <div class="email-content">
        <p class="email-greeting">${greeting}</p>
        
        <p class="email-text">${introText}</p>
        
        ${totalOneTime || totalMonthly ? `
        <!-- Highlight Box with Pricing like RDV confirmation -->
        <div class="highlight-box">
          <p class="highlight-label">💰 ${pricingTitle}</p>
          ${totalOneTime ? `
          <div class="highlight-row">
            <p class="highlight-label">${oneTimeLabel}</p>
            <p class="highlight-value">$${totalOneTime.toLocaleString()}</p>
          </div>
          ` : ''}
          ${totalMonthly ? `
          <div class="highlight-row">
            <p class="highlight-label">${monthlyLabel}</p>
            <p class="highlight-value">$${totalMonthly}/mois</p>
          </div>
          ` : ''}
        </div>
        ` : ''}
        
        <div class="divider"></div>
        
        <p class="message-label">🚀 ${nextStepsTitle}</p>
        ${steps.map((step, i) => `
        <div class="field-item" style="border-left-color: ${COLORS.primary};">
          <p class="field-value"><span style="color: ${COLORS.primary}; font-weight: 600;">${i + 1}.</span> ${step}</p>
        </div>
        `).join('')}
        
        <div class="divider"></div>
        
        <div class="field-group">
          <div class="field-item">
            <p class="field-label">${language === 'en' ? 'Reference' : language === 'es' ? 'Referencia' : 'Référence'}</p>
            <p class="field-value"><code style="background: rgba(99, 102, 241, 0.2); padding: 4px 8px; border-radius: 4px; font-size: 12px; color: ${COLORS.primary};">${submissionId}</code></p>
          </div>
        </div>
        
        <p class="email-text">${closingText}</p>
        
        <p class="email-text" style="margin-bottom: 0;">
          ${signOff}<br>
          <strong style="background: ${GRADIENT_BRAND}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">L'équipe NeuraWeb</strong>
        </p>
      </div>
      
      <!-- Footer -->
      ${getFooterHTML(language)}
    </div>
  </div>
</body>
</html>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: subject,
      html: htmlContent,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, id: result.data?.id };
  } catch (error: any) {
    console.error('Error sending hotel form confirmation email via Resend:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envoie une notification admin pour un nouveau formulaire hôtel
 */
export async function sendHotelFormAdminNotification(data: HotelFormSubmissionData) {
  if (!resend) {
    console.warn('Resend API key not configured, skipping email');
    return { success: false, error: 'Resend API key not configured' };
  }

  const { submissionId, hotelName, email, phone, typeEtablissement, pays, nbChambresTotal, budget, delai, totalOneTime, totalMonthly, pdfUrl, language = 'fr' } = data;

  const subject = `🏨 Nouveau formulaire hôtel - ${hotelName} (${submissionId})`;
  const titleText = 'Nouveau Formulaire Hôtel';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>${getBaseStyles()}</style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <!-- Header -->
      <div class="email-header">
        <h1 class="email-logo">NeuraWeb</h1>
        <p class="email-tagline">WEB · IA · AUTOMATISATION</p>
        <h2 class="email-title">${titleText}</h2>
      </div>
      
      <!-- Content -->
      <div class="email-content">
        <!-- Highlight Box -->
        <div class="highlight-box">
          <p class="highlight-value">${hotelName}</p>
          <p class="highlight-label">${submissionId}</p>
        </div>
        
        <div class="field-group">
          <div class="field-item">
            <p class="field-label">Email</p>
            <p class="field-value"><a href="mailto:${email}">${email}</a></p>
          </div>
          
          ${phone ? `
          <div class="field-item">
            <p class="field-label">Téléphone</p>
            <p class="field-value">${phone}</p>
          </div>
          ` : ''}
          
          ${typeEtablissement ? `
          <div class="field-item">
            <p class="field-label">Type</p>
            <p class="field-value">${typeEtablissement}</p>
          </div>
          ` : ''}
          
          ${pays ? `
          <div class="field-item">
            <p class="field-label">Pays</p>
            <p class="field-value">${pays}</p>
          </div>
          ` : ''}
          
          ${nbChambresTotal ? `
          <div class="field-item">
            <p class="field-label">Chambres</p>
            <p class="field-value">${nbChambresTotal}</p>
          </div>
          ` : ''}
          
          ${budget ? `
          <div class="field-item">
            <p class="field-label">Budget</p>
            <p class="field-value">${budget}</p>
          </div>
          ` : ''}
          
          ${delai ? `
          <div class="field-item">
            <p class="field-label">Délai</p>
            <p class="field-value">${delai}</p>
          </div>
          ` : ''}
        </div>
        
        ${totalOneTime || totalMonthly ? `
        <div class="message-box" style="border-left: 3px solid #22c55e;">
          <p class="message-label" style="color: #22c55e;">💰 Prix</p>
          ${totalOneTime ? `<p class="field-value"><strong>Unique:</strong> <span style="color: #22c55e;">$${totalOneTime.toLocaleString()}</span></p>` : ''}
          ${totalMonthly ? `<p class="field-value"><strong>Mensuel:</strong> <span style="color: #22c55e;">$${totalMonthly}/mois</span></p>` : ''}
        </div>
        ` : ''}
        
        <div class="divider"></div>
        
        <div style="text-align: center;">
          <a href="mailto:${email}?subject=Re: Votre projet - ${hotelName}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin: 4px;">
            📧 Répondre
          </a>
          ${pdfUrl ? `
          <a href="${pdfUrl}" style="display: inline-block; background: rgba(99, 102, 241, 0.1); color: ${COLORS.primary}; border: 2px solid ${COLORS.primary}; font-size: 14px; font-weight: 600; text-decoration: none; padding: 10px 24px; border-radius: 8px; margin: 4px;">
            📄 Voir PDF
          </a>
          ` : ''}
        </div>
      </div>
      
      <!-- Footer -->
      ${getFooterHTML(language)}
    </div>
  </div>
</body>
</html>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: subject,
      html: htmlContent,
      replyTo: email,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, id: result.data?.id };
  } catch (error: any) {
    console.error('Error sending hotel form admin notification via Resend:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envoie une notification de nouvelle réservation à l'équipe
 */
export async function sendBookingNotificationEmail(data: BookingEmailData) {
  if (!resend) {
    console.warn('Resend API key not configured, skipping email');
    return { success: false, error: 'Resend API key not configured' };
  }

  const { name, email, phone, service, date, time, message, language = 'fr' } = data;

  const subject = language === 'en' 
    ? `📅 New Booking: ${name} - ${date} at ${time}`
    : language === 'es'
    ? `📅 Nueva Reserva: ${name} - ${date} a las ${time}`
    : `📅 Nouvelle Réservation: ${name} - ${date} à ${time}`;

  const titleText = language === 'en' 
    ? 'New Booking' 
    : language === 'es' 
    ? 'Nueva Reserva' 
    : 'Nouvelle Réservation';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>${getBaseStyles()}</style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <!-- Header -->
      <div class="email-header">
        <h1 class="email-logo">NeuraWeb</h1>
        <p class="email-tagline">WEB · IA · AUTOMATISATION</p>
        <h2 class="email-title">${titleText}</h2>
      </div>
      
      <!-- Content -->
      <div class="email-content">
        <!-- Highlight Box with Date & Time -->
        <div class="highlight-box">
          <div class="highlight-row">
            <p class="highlight-label">${language === 'en' ? 'Date' : language === 'es' ? 'Fecha' : 'Date'}</p>
            <p class="highlight-value">${date}</p>
          </div>
          <div class="highlight-row">
            <p class="highlight-label">${language === 'en' ? 'Time' : language === 'es' ? 'Hora' : 'Heure'}</p>
            <p class="highlight-value">${time}</p>
          </div>
        </div>
        
        <div class="field-group">
          <div class="field-item">
            <p class="field-label">${language === 'en' ? 'Name' : language === 'es' ? 'Nombre' : 'Nom'}</p>
            <p class="field-value">${name}</p>
          </div>
          
          <div class="field-item">
            <p class="field-label">Email</p>
            <p class="field-value"><a href="mailto:${email}">${email}</a></p>
          </div>
          
          ${phone ? `
          <div class="field-item">
            <p class="field-label">${language === 'en' ? 'Phone' : language === 'es' ? 'Teléfono' : 'Téléphone'}</p>
            <p class="field-value">${phone}</p>
          </div>
          ` : ''}
          
          ${service ? `
          <div class="field-item">
            <p class="field-label">${language === 'en' ? 'Service' : language === 'es' ? 'Servicio' : 'Service'}</p>
            <p class="field-value">${service}</p>
          </div>
          ` : ''}
        </div>
        
        ${message ? `
        <div class="message-box">
          <p class="message-label">${language === 'en' ? 'Message' : language === 'es' ? 'Mensaje' : 'Message'}</p>
          <p class="message-content">${message.replace(/\n/g, '<br>')}</p>
        </div>
        ` : ''}
      </div>
      
      <!-- Footer -->
      ${getFooterHTML(language)}
    </div>
  </div>
</body>
</html>
  `;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: subject,
      html: htmlContent,
      replyTo: email,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, id: result.data?.id };
  } catch (error: any) {
    console.error('Error sending booking notification email via Resend:', error);
    return { success: false, error: error.message };
  }
}