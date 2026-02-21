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