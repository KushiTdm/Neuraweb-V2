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

const FROM_EMAIL = process.env.FROM_EMAIL || 'contact@neuraweb.fr';
const TO_EMAIL = process.env.TO_EMAIL || 'contact@neuraweb.fr';

/**
 * Envoie un email de notification pour le formulaire de contact
 */
export async function sendContactEmail(data: ContactEmailData) {
  // Vérifier si Resend est configuré
  if (!resend) {
    console.warn('Resend API key not configured, skipping email');
    return { success: false, error: 'Resend API key not configured' };
  }

  const { name, email, subject, budget, message, language = 'fr' } = data;

  const emailSubject = language === 'en' 
    ? `New contact request from ${name}`
    : language === 'es'
    ? `Nueva solicitud de contacto de ${name}`
    : `Nouvelle demande de contact de ${name}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #667eea; }
        .value { background: white; padding: 10px; border-radius: 4px; margin-top: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${language === 'en' ? 'New Contact Request' : language === 'es' ? 'Nueva Solicitud de Contacto' : 'Nouvelle Demande de Contact'}</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">${language === 'en' ? 'Name' : language === 'es' ? 'Nombre' : 'Nom'}</div>
            <div class="value">${name}</div>
          </div>
          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${email}">${email}</a></div>
          </div>
          ${subject ? `
          <div class="field">
            <div class="label">${language === 'en' ? 'Subject' : language === 'es' ? 'Asunto' : 'Sujet'}</div>
            <div class="value">${subject}</div>
          </div>
          ` : ''}
          ${budget ? `
          <div class="field">
            <div class="label">${language === 'en' ? 'Budget' : language === 'es' ? 'Presupuesto' : 'Budget'}</div>
            <div class="value">${budget}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="label">${language === 'en' ? 'Message' : language === 'es' ? 'Mensaje' : 'Message'}</div>
            <div class="value">${message.replace(/\n/g, '<br>')}</div>
          </div>
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
  // Vérifier si Resend est configuré
  if (!resend) {
    console.warn('Resend API key not configured, skipping email');
    return { success: false, error: 'Resend API key not configured' };
  }

  const { name, email, phone, service, date, time, message, language = 'fr' } = data;

  const subject = language === 'en' 
    ? `Booking Confirmed - ${date} at ${time}`
    : language === 'es'
    ? `Reserva Confirmada - ${date} a las ${time}`
    : `Réservation Confirmée - ${date} à ${time}`;

  const confirmationText = language === 'en'
    ? 'Your booking has been confirmed'
    : language === 'es'
    ? 'Su reserva ha sido confirmada'
    : 'Votre réservation a été confirmée';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #667eea; }
        .value { background: white; padding: 10px; border-radius: 4px; margin-top: 5px; }
        .highlight { background: #667eea; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Neuraweb</h1>
          <p>${confirmationText}</p>
        </div>
        <div class="content">
          <p>${language === 'en' ? `Hello ${name},` : language === 'es' ? `Hola ${name},` : `Bonjour ${name},`}</p>
          <p>${language === 'en' ? 'Thank you for your booking. Here are the details:' : language === 'es' ? 'Gracias por su reserva. Aquí están los detalles:' : 'Merci pour votre réservation. Voici les détails :'}</p>
          
          <div class="highlight">
            <strong>${language === 'en' ? 'Date' : language === 'es' ? 'Fecha' : 'Date'}:</strong> ${date}<br>
            <strong>${language === 'en' ? 'Time' : language === 'es' ? 'Hora' : 'Heure'}:</strong> ${time}
          </div>

          ${service ? `
          <div class="field">
            <div class="label">${language === 'en' ? 'Service' : language === 'es' ? 'Servicio' : 'Service'}</div>
            <div class="value">${service}</div>
          </div>
          ` : ''}

          ${phone ? `
          <div class="field">
            <div class="label">${language === 'en' ? 'Phone' : language === 'es' ? 'Teléfono' : 'Téléphone'}</div>
            <div class="value">${phone}</div>
          </div>
          ` : ''}

          ${message ? `
          <div class="field">
            <div class="label">${language === 'en' ? 'Additional message' : language === 'es' ? 'Mensaje adicional' : 'Message additionnel'}</div>
            <div class="value">${message.replace(/\n/g, '<br>')}</div>
          </div>
          ` : ''}

          <p>${language === 'en' ? 'We will contact you shortly to confirm the details.' : language === 'es' ? 'Le contactaremos pronto para confirmar los detalles.' : 'Nous vous contacterons prochainement pour confirmer les détails.'}</p>
          
          <p>${language === 'en' ? 'See you soon,' : language === 'es' ? 'Hasta pronto,' : 'À bientôt,'}<br>L'équipe Neuraweb</p>
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
  // Vérifier si Resend est configuré
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

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #667eea; }
        .value { background: white; padding: 10px; border-radius: 4px; margin-top: 5px; }
        .highlight { background: #667eea; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📅 ${language === 'en' ? 'New Booking' : language === 'es' ? 'Nueva Reserva' : 'Nouvelle Réservation'}</h1>
        </div>
        <div class="content">
          <div class="highlight">
            <strong>${language === 'en' ? 'Date' : language === 'es' ? 'Fecha' : 'Date'}:</strong> ${date}<br>
            <strong>${language === 'en' ? 'Time' : language === 'es' ? 'Hora' : 'Heure'}:</strong> ${time}
          </div>

          <div class="field">
            <div class="label">${language === 'en' ? 'Name' : language === 'es' ? 'Nombre' : 'Nom'}</div>
            <div class="value">${name}</div>
          </div>

          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${email}">${email}</a></div>
          </div>

          ${phone ? `
          <div class="field">
            <div class="label">${language === 'en' ? 'Phone' : language === 'es' ? 'Teléfono' : 'Téléphone'}</div>
            <div class="value">${phone}</div>
          </div>
          ` : ''}

          ${service ? `
          <div class="field">
            <div class="label">${language === 'en' ? 'Service' : language === 'es' ? 'Servicio' : 'Service'}</div>
            <div class="value">${service}</div>
          </div>
          ` : ''}

          ${message ? `
          <div class="field">
            <div class="label">${language === 'en' ? 'Message' : language === 'es' ? 'Mensaje' : 'Message'}</div>
            <div class="value">${message.replace(/\n/g, '<br>')}</div>
          </div>
          ` : ''}
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
