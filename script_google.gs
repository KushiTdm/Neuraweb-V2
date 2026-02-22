// ============================================================
// NEURAWEB.TECH - Google Apps Script Backend
// Version complète avec templates email design
// ============================================================

const CONFIG = {
  SPREADSHEET_ID: '1kTBAhj_iqE51v5wdFXLtmTXTjf9smynT5BYIdvx-eAs',
  ADMIN_EMAIL: 'benachouba.nacer@gmail.com',
  EMAIL_ALIAS: 'contact@neuraweb.tech',
  COMPANY_NAME: 'NeurAWeb',
  WEBSITE: 'https://neuraweb.tech',
  TIMEZONE: 'Europe/Paris',
  WORKING_HOURS: { start: 9, end: 18 },
  SLOT_DURATION: 60,
  DAYS_AHEAD: 14,
  SHEETS: {
    BOOKINGS: 'Réservations',
    CONVERSATIONS: 'Conversations',
    CONTACTS: 'Contacts',
    SLOTS: 'Créneaux',
    HOTEL_TOKENS: 'Tokens Hôtel',
    HOTEL_FORMS: 'Formulaires Hôtel'
  },
  DRIVE_FOLDER_ID: '1IeJudeYibxfi3JQtypjiXuUAvNL64p9v' // ID du dossier Google Drive pour les PDFs
};

// ============================================================
// POINTS D'ENTRÉE HTTP
// ============================================================

function doGet(e) {
  const action = e.parameter.action || 'slots';
  let result;

  try {
    switch (action) {
      case 'slots':
        result = getAvailableSlots(e.parameter.date);
        break;
      case 'test':
        result = { status: 'ok', message: 'Google Apps Script opérationnel', timestamp: new Date().toISOString() };
        break;
      case 'verifyHotelToken':
        result = verifyHotelToken(e.parameter.token);
        break;
      case 'testDrive':
        result = testDriveAccess();
        break;
      default:
        result = { error: 'Action inconnue' };
    }
  } catch (err) {
    result = { error: err.message };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let data = {};

  try {
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter || {};
    }
  } catch (err) {
    data = e.parameter || {};
  }

  const action = data.action || '';
  let result;

  try {
    switch (action) {
      case 'book':
        result = saveBooking(data);
        break;
      case 'saveConversation':
        result = saveConversation(data);
        break;
      case 'saveContact':
        result = saveContact(data);
        break;
      case 'initSheets':
        result = initializeSheets();
        break;
      case 'createHotelToken':
        result = createHotelToken(data);
        break;
      case 'submitHotelForm':
        result = submitHotelForm(data);
        break;
      default:
        result = { error: 'Action inconnue: ' + action };
    }
  } catch (err) {
    Logger.log('Erreur doPost: ' + err.message);
    result = { error: err.message };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// SAUVEGARDE DES CONVERSATIONS
// ============================================================

function saveConversation(data) {
  const sessionId = data.sessionId, messages = data.messages, userInfo = data.userInfo;
  if (!sessionId || !messages || !messages.length) {
    return { success: false, error: 'Données de conversation invalides' };
  }

  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEETS.CONVERSATIONS);
  const timestamp = new Date();

  let lastUserMsg = '', lastBotMsg = '';
  for (let i = messages.length - 1; i >= 0; i--) {
    if (!lastUserMsg && messages[i].role === 'user') lastUserMsg = messages[i].content;
    if (!lastBotMsg && messages[i].role === 'assistant') lastBotMsg = messages[i].content;
    if (lastUserMsg && lastBotMsg) break;
  }

  sheet.appendRow([
    timestamp,
    sessionId,
    messages.length,
    lastUserMsg.substring(0, 500),
    lastBotMsg.substring(0, 500),
    userInfo ? (userInfo.name || '') : '',
    userInfo ? (userInfo.email || '') : '',
    userInfo ? (userInfo.service || '') : '',
    JSON.stringify(messages).substring(0, 2000)
  ]);

  return { success: true, sessionId: sessionId, savedAt: timestamp.toISOString() };
}

// ============================================================
// SAUVEGARDE DES CONTACTS
// ============================================================

function saveContact(data) {
  var name = data.name, email = data.email, phone = data.phone;
  var company = data.company, service = data.service;
  var message = data.message, source = data.source;
  var language = data.language || 'fr';

  if (!name || !email) {
    return { success: false, error: 'Nom et email obligatoires' };
  }

  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var sheet = ss.getSheetByName(CONFIG.SHEETS.CONTACTS);
  var timestamp = new Date();

  sheet.appendRow([
    timestamp, name, email, phone || '',
    company || '', service || '', message || '', source || 'contact-form'
  ]);

  // Email de confirmation au client (même style que les réservations)
  try {
    sendContactEmails({
      name: name, email: email, phone: phone,
      company: company, service: service,
      message: message, language: language, timestamp: timestamp
    });
  } catch (err) {
    Logger.log('Erreur emails contact: ' + err.message);
  }

  return { success: true, message: 'Contact enregistré avec succès' };
}

// ============================================================
// ENVOI DES EMAILS CONTACT (client + admin)
// ============================================================

function sendContactEmails(params) {
  var name = params.name, email = params.email, phone = params.phone;
  var company = params.company, service = params.service;
  var message = params.message, language = params.language;
  var timestamp = params.timestamp;

  var isEnglish = language === 'en';
  var isSpanish = language === 'es';

  // ── Email de confirmation au CLIENT ──────────────────────
  try {
    var clientSubject = isEnglish
      ? '[NeurAWeb] We received your message — We\'ll get back to you within 24h'
      : isSpanish
      ? '[NeurAWeb] Recibimos tu mensaje — Te responderemos en 24h'
      : '[NeurAWeb] Votre message a bien été reçu — Réponse sous 24h';

    sendEmail({
      to: email,
      subject: clientSubject,
      html: getContactClientTemplate({ name: name, service: service, message: message, language: language }),
      replyTo: CONFIG.EMAIL_ALIAS
    });
  } catch (err) {
    Logger.log('Erreur email client contact: ' + err.message);
  }

  // ── Email de notification à l'ADMIN ──────────────────────
  try {
    sendEmail({
      to: CONFIG.ADMIN_EMAIL,
      subject: '[NeurAWeb] Nouveau message de ' + name,
      html: getContactAdminTemplate({
        name: name, email: email, phone: phone,
        company: company, service: service,
        message: message, timestamp: timestamp
      }),
      replyTo: email
    });
  } catch (err) {
    Logger.log('Erreur email admin contact: ' + err.message);
  }
}

// ============================================================
// TEMPLATE EMAIL CLIENT — Confirmation de réception du message
// (même style sombre que getClientEmailTemplate)
// ============================================================

function getContactClientTemplate(params) {
  var name = params.name, service = params.service;
  var message = params.message, language = params.language;

  var isEnglish = language === 'en';
  var isSpanish = language === 'es';
  var year = new Date().getFullYear();
  var lang = isEnglish ? 'en' : isSpanish ? 'es' : 'fr';

  var t = isEnglish ? {
    title: 'Message Received',
    greeting: 'Hello ' + name + ',',
    subtitle: 'Thank you for contacting NeurAWeb. We have received your message and will get back to you within 24 business hours.',
    detailsTitle: 'Your Request',
    labelService: 'Subject',
    labelMessage: 'Your message',
    nextSteps: 'What happens next?',
    steps: [
      'Our team will review your request carefully.',
      'We will get back to you within 24 business hours.',
      'We will prepare a personalized proposal for your project.'
    ],
    footer: 'Questions? Reply to this email or contact us at',
    cta: 'Visit our website'
  } : isSpanish ? {
    title: 'Mensaje Recibido',
    greeting: 'Hola ' + name + ',',
    subtitle: 'Gracias por contactar a NeurAWeb. Hemos recibido tu mensaje y te responderemos en las próximas 24 horas hábiles.',
    detailsTitle: 'Tu Solicitud',
    labelService: 'Asunto',
    labelMessage: 'Tu mensaje',
    nextSteps: '¿Qué sigue?',
    steps: [
      'Nuestro equipo revisará tu solicitud con atención.',
      'Te responderemos en las próximas 24 horas hábiles.',
      'Prepararemos una propuesta personalizada para tu proyecto.'
    ],
    footer: '¿Preguntas? Responde a este email o contáctanos en',
    cta: 'Visitar nuestro sitio'
  } : {
    title: 'Message Reçu',
    greeting: 'Bonjour ' + name + ',',
    subtitle: 'Merci de nous avoir contactés. Nous avons bien reçu votre message et vous répondrons dans les 24 heures ouvrées.',
    detailsTitle: 'Votre Demande',
    labelService: 'Sujet',
    labelMessage: 'Votre message',
    nextSteps: 'La suite ?',
    steps: [
      'Notre équipe va étudier votre demande avec attention.',
      'Nous vous répondrons dans les 24 heures ouvrées.',
      'Nous préparerons une proposition personnalisée pour votre projet.'
    ],
    footer: 'Des questions ? Répondez à cet email ou contactez-nous à',
    cta: 'Visiter notre site'
  };

  var stepsHtml = t.steps.map(function(step, i) {
    return '<tr><td style="padding:8px 0;vertical-align:top;">'
      + '<table cellpadding="0" cellspacing="0"><tr>'
      + '<td style="padding-right:12px;vertical-align:middle;">'
      + '<div style="width:24px;height:24px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;text-align:center;line-height:24px;color:#fff;font-size:12px;font-weight:bold;display:inline-block;">' + (i + 1) + '</div>'
      + '</td><td><p style="color:#c0c0c0;font-size:14px;margin:3px 0;line-height:1.5;">' + step + '</p></td>'
      + '</tr></table></td></tr>';
  }).join('');

  return '<!DOCTYPE html><html lang="' + lang + '">'
    + '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>' + t.title + '</title></head>'
    + '<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Arial,sans-serif;">'
    + '<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">'
    + '<tr><td align="center">'
    + '<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">'

    // HEADER sombre
    + '<tr><td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);border-radius:16px 16px 0 0;padding:40px 40px 32px;text-align:center;">'
    + '<img src="https://neuraweb.tech/assets/neurawebW.png" alt="NeurAWeb" width="180" style="display:block;margin:0 auto 16px;height:auto;max-width:180px;" />'
    + '<div style="width:50px;height:3px;background:linear-gradient(135deg,#667eea,#764ba2);margin:0 auto 20px;border-radius:2px;"></div>'
    + '<h1 style="color:#fff;font-size:20px;font-weight:700;margin:0;">&#10003; ' + t.title + '</h1>'
    + '</td></tr>'

    // CORPS
    + '<tr><td style="background:#111;padding:40px;">'
    + '<p style="color:#e0e0e0;font-size:16px;line-height:1.6;margin:0 0 8px;">' + t.greeting + '</p>'
    + '<p style="color:#a0a0a0;font-size:15px;line-height:1.6;margin:0 0 32px;">' + t.subtitle + '</p>'

    // Carte détails
    + '<table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1a1a2e,#16213e);border:1px solid #2a2a4a;border-radius:12px;margin-bottom:32px;">'
    + '<tr><td style="padding:24px;">'
    + '<p style="color:#667eea;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 20px;">&#128203; ' + t.detailsTitle + '</p>'
    + '<table width="100%" cellpadding="0" cellspacing="0">'
    + (service ? '<tr><td style="padding:10px 0;border-bottom:1px solid #2a2a4a;color:#808080;font-size:13px;">' + t.labelService + '</td><td style="padding:10px 0;border-bottom:1px solid #2a2a4a;text-align:right;color:#fff;font-size:14px;font-weight:600;">' + service + '</td></tr>' : '')
    + (message ? '<tr><td colspan="2" style="padding:12px 0;"><p style="color:#808080;font-size:12px;margin:0 0 6px;">' + t.labelMessage + '</p><p style="color:#c0c0c0;font-size:14px;line-height:1.6;margin:0;white-space:pre-wrap;">' + message + '</p></td></tr>' : '')
    + '</table></td></tr></table>'

    // Étapes
    + '<p style="color:#667eea;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px;">&#128640; ' + t.nextSteps + '</p>'
    + '<table width="100%" cellpadding="0" cellspacing="0">' + stepsHtml + '</table>'
    + '</td></tr>'

    // CTA
    + '<tr><td style="background:#111;padding:0 40px 32px;text-align:center;">'
    + '<a href="https://neuraweb.tech" style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:8px;">&#127758; ' + t.cta + '</a>'
    + '</td></tr>'

    // FOOTER
    + '<tr><td style="background:#0d0d0d;border-top:1px solid #1a1a1a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">'
    + '<p style="color:#505050;font-size:13px;margin:0 0 8px;">' + t.footer + ' <a href="mailto:' + CONFIG.EMAIL_ALIAS + '" style="color:#667eea;text-decoration:none;">' + CONFIG.EMAIL_ALIAS + '</a></p>'
    + '<p style="color:#303030;font-size:12px;margin:0;">&#169; ' + year + ' NeurAWeb &mdash; <a href="https://neuraweb.tech" style="color:#404040;text-decoration:none;">neuraweb.tech</a></p>'
    + '</td></tr>'

    + '</table></td></tr></table></body></html>';
}

// ============================================================
// TEMPLATE EMAIL ADMIN — Nouveau message de contact
// (même style que getAdminEmailTemplate pour les réservations)
// ============================================================

function getContactAdminTemplate(params) {
  var name = params.name, email = params.email, phone = params.phone;
  var company = params.company, service = params.service;
  var message = params.message, timestamp = params.timestamp;
  var year = new Date().getFullYear();

  var rows = [
    ['Nom', '<strong>' + name + '</strong>'],
    ['Email', '<a href="mailto:' + email + '" style="color:#667eea;text-decoration:none;">' + email + '</a>'],
    ['Téléphone', phone || '<span style="color:#aaa;">Non renseigné</span>'],
    ['Entreprise', company || '<span style="color:#aaa;">Non renseignée</span>'],
    ['Sujet / Service', service || '<span style="color:#aaa;">Non spécifié</span>'],
    ['Date', timestamp ? timestamp.toLocaleString('fr-FR') : new Date().toLocaleString('fr-FR')]
  ];

  var rowsHtml = rows.map(function(row, i) {
    return '<tr style="background:' + (i % 2 === 0 ? '#fff' : '#f8f8ff') + ';">'
      + '<td style="padding:12px 16px;border-bottom:1px solid #e8e8f0;color:#888;font-size:13px;width:35%;">' + row[0] + '</td>'
      + '<td style="padding:12px 16px;border-bottom:1px solid #e8e8f0;color:#1a1a1a;font-size:14px;">' + row[1] + '</td>'
      + '</tr>';
  }).join('');

  return '<!DOCTYPE html><html lang="fr">'
    + '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Nouveau message de ' + name + '</title></head>'
    + '<body style="margin:0;padding:0;background:#f0f0f5;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Arial,sans-serif;">'
    + '<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f5;padding:40px 20px;">'
    + '<tr><td align="center">'
    + '<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">'

    // HEADER fond blanc + logo noir
    + '<tr><td style="background:#fff;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;border-bottom:3px solid #667eea;">'
    + '<img src="https://neuraweb.tech/assets/neurawebB.png" alt="NeurAWeb" width="160" style="display:block;margin:0 auto 12px;height:auto;" />'
    + '<p style="color:#667eea;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0;">&#128235; Nouveau Message de Contact</p>'
    + '</td></tr>'

    // BANDEAU violet
    + '<tr><td style="background:linear-gradient(135deg,#667eea,#764ba2);padding:16px 40px;text-align:center;">'
    + '<p style="color:#fff;font-size:16px;font-weight:600;margin:0;">Message de <strong>' + name + '</strong></p>'
    + '</td></tr>'

    // DÉTAILS
    + '<tr><td style="background:#fff;padding:32px 40px;">'
    + '<p style="color:#667eea;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 20px;">&#128100; Informations Client</p>'
    + '<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0f0;border-radius:8px;overflow:hidden;">'
    + rowsHtml
    + '</table>'

    + (message
        ? '<div style="margin-top:24px;background:#f8f8ff;border-left:4px solid #667eea;border-radius:4px;padding:16px;">'
          + '<p style="color:#667eea;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin:0 0 8px;">&#128172; Message du client</p>'
          + '<p style="color:#333;font-size:14px;line-height:1.6;margin:0;white-space:pre-wrap;">' + message + '</p>'
          + '</div>'
        : '')

    // Boutons d'action
    + '<div style="margin-top:28px;text-align:center;">'
    + '<a href="mailto:' + email + '?subject=Re:%20Votre%20message%20-%20NeurAWeb" style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:8px;margin:4px;">&#128231; Répondre au client</a>'
    + '<a href="https://docs.google.com/spreadsheets/d/' + CONFIG.SPREADSHEET_ID + '" style="display:inline-block;background:#f0f0ff;color:#667eea;border:2px solid #667eea;font-size:14px;font-weight:600;text-decoration:none;padding:10px 24px;border-radius:8px;margin:4px;">&#128202; Voir Google Sheet</a>'
    + '</div>'
    + '</td></tr>'

    // FOOTER
    + '<tr><td style="background:#f0f0f5;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;border-top:1px solid #e0e0f0;">'
    + '<p style="color:#999;font-size:12px;margin:0;">&#169; ' + year + ' NeurAWeb &mdash; Notification automatique interne</p>'
    + '</td></tr>'

    + '</table></td></tr></table></body></html>';
}

// ============================================================
// FONCTION D'ENVOI D'EMAIL (GmailApp)
// Utilisée pour les contacts et réservations classiques
// Les emails hôtel sont envoyés via Resend par l'API Next.js
// ============================================================

function sendEmail(params) {
  var to = params.to, subject = params.subject, html = params.html, replyTo = params.replyTo;

  var options = {
    htmlBody: html,
    replyTo: replyTo || CONFIG.EMAIL_ALIAS,
    name: CONFIG.COMPANY_NAME
  };

  try {
    GmailApp.sendEmail(to, subject, '', options);
    Logger.log('Email envoyé à: ' + to);
  } catch (err) {
    Logger.log('Erreur envoi email: ' + err.message);
  }
}

// ============================================================
// NOTES: Les emails hôtel sont envoyés via Resend
// par l'API Next.js (/api/hotel-form)
// ============================================================

function sendBookingEmails(params) {
  const bookingId = params.bookingId, name = params.name, email = params.email;
  const phone = params.phone, service = params.service, date = params.date;
  const time = params.time, message = params.message, language = params.language;

  const isEnglish = language === 'en';
  const isSpanish = language === 'es';
  const dateFormatted = formatDateFR(new Date(date + 'T12:00:00'));

  // Email client
  try {
    const subject = isEnglish
      ? '[NeurAWeb] Appointment confirmed - ' + dateFormatted + ' at ' + time
      : isSpanish
      ? '[NeurAWeb] Cita confirmada - ' + dateFormatted + ' a las ' + time
      : '[NeurAWeb] Rendez-vous confirmé - ' + dateFormatted + ' à ' + time;

    sendEmail({
      to: email,
      subject: subject,
      html: getClientEmailTemplate({
        bookingId: bookingId, name: name, service: service,
        date: dateFormatted, time: time, language: language
      }),
      replyTo: CONFIG.EMAIL_ALIAS
    });
  } catch (err) {
    Logger.log('Erreur email client: ' + err.message);
  }

  // Email admin
  try {
    sendEmail({
      to: CONFIG.ADMIN_EMAIL,
      subject: '[NeurAWeb] Nouvelle réservation ' + bookingId + ' - ' + name,
      html: getAdminEmailTemplate({
        bookingId: bookingId, name: name, email: email, phone: phone,
        service: service, date: dateFormatted, time: time, message: message
      }),
      replyTo: email
    });
  } catch (err) {
    Logger.log('Erreur email admin: ' + err.message);
  }
}

// ============================================================
// TEMPLATE EMAIL CLIENT — fond sombre + logo blanc
// ============================================================

function getClientEmailTemplate(params) {
  const bookingId = params.bookingId, name = params.name, service = params.service;
  const date = params.date, time = params.time, language = params.language;

  const isEnglish = language === 'en';
  const isSpanish = language === 'es';

  const t = isEnglish ? {
    title: 'Appointment Confirmed',
    greeting: 'Hello ' + name + ',',
    subtitle: 'Your appointment with NeurAWeb has been confirmed.',
    detailsTitle: 'Appointment Details',
    labelService: 'Service',
    labelDate: 'Date',
    labelTime: 'Time',
    labelRef: 'Reference',
    nextSteps: 'What happens next?',
    steps: [
      'You will receive a reminder 24h before your appointment.',
      'Our team will contact you at the scheduled time.',
      'Prepare your questions about your project.'
    ],
    footer: 'Questions? Reply to this email or contact us at',
    cta: 'Visit our website'
  } : isSpanish ? {
    title: 'Cita Confirmada',
    greeting: 'Hola ' + name + ',',
    subtitle: 'Tu cita con NeurAWeb ha sido confirmada.',
    detailsTitle: 'Detalles de la cita',
    labelService: 'Servicio',
    labelDate: 'Fecha',
    labelTime: 'Hora',
    labelRef: 'Referencia',
    nextSteps: '¿Qué sigue?',
    steps: [
      'Recibirás un recordatorio 24h antes de tu cita.',
      'Nuestro equipo te contactará a la hora acordada.',
      'Prepara tus preguntas sobre tu proyecto.'
    ],
    footer: '¿Preguntas? Responde a este email o contáctanos en',
    cta: 'Visitar nuestro sitio'
  } : {
    title: 'Rendez-vous Confirmé',
    greeting: 'Bonjour ' + name + ',',
    subtitle: 'Votre rendez-vous avec NeurAWeb a bien été confirmé.',
    detailsTitle: 'Détails du rendez-vous',
    labelService: 'Service',
    labelDate: 'Date',
    labelTime: 'Heure',
    labelRef: 'Référence',
    nextSteps: 'La suite ?',
    steps: [
      'Vous recevrez un rappel 24h avant votre rendez-vous.',
      "Notre équipe vous contactera à l'heure convenue.",
      'Préparez vos questions sur votre projet.'
    ],
    footer: 'Des questions ? Répondez à cet email ou contactez-nous à',
    cta: 'Visiter notre site'
  };

  const year = new Date().getFullYear();
  const lang = isEnglish ? 'en' : isSpanish ? 'es' : 'fr';

  const stepsHtml = t.steps.map(function(step, i) {
    return '<tr><td style="padding:8px 0;vertical-align:top;">'
      + '<table cellpadding="0" cellspacing="0"><tr>'
      + '<td style="padding-right:12px;vertical-align:middle;">'
      + '<div style="width:24px;height:24px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;text-align:center;line-height:24px;color:#fff;font-size:12px;font-weight:bold;display:inline-block;">' + (i + 1) + '</div>'
      + '</td><td><p style="color:#c0c0c0;font-size:14px;margin:3px 0;line-height:1.5;">' + step + '</p></td>'
      + '</tr></table></td></tr>';
  }).join('');

  return '<!DOCTYPE html><html lang="' + lang + '">'
    + '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>' + t.title + '</title></head>'
    + '<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Arial,sans-serif;">'
    + '<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">'
    + '<tr><td align="center">'
    + '<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">'

    // HEADER
    + '<tr><td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);border-radius:16px 16px 0 0;padding:40px 40px 32px;text-align:center;">'
    + '<img src="https://neuraweb.tech/assets/neurawebW.png" alt="NeurAWeb" width="180" style="display:block;margin:0 auto 16px;height:auto;max-width:180px;" />'
    + '<div style="width:50px;height:3px;background:linear-gradient(135deg,#667eea,#764ba2);margin:0 auto 20px;border-radius:2px;"></div>'
    + '<h1 style="color:#fff;font-size:20px;font-weight:700;margin:0;">&#10003; ' + t.title + '</h1>'
    + '</td></tr>'

    // CORPS
    + '<tr><td style="background:#111;padding:40px;">'
    + '<p style="color:#e0e0e0;font-size:16px;line-height:1.6;margin:0 0 8px;">' + t.greeting + '</p>'
    + '<p style="color:#a0a0a0;font-size:15px;line-height:1.6;margin:0 0 32px;">' + t.subtitle + '</p>'

    // Carte détails
    + '<table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1a1a2e,#16213e);border:1px solid #2a2a4a;border-radius:12px;margin-bottom:32px;">'
    + '<tr><td style="padding:24px;">'
    + '<p style="color:#667eea;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 20px;">&#128203; ' + t.detailsTitle + '</p>'
    + '<table width="100%" cellpadding="0" cellspacing="0">'
    + '<tr><td style="padding:10px 0;border-bottom:1px solid #2a2a4a;color:#808080;font-size:13px;">' + t.labelService + '</td><td style="padding:10px 0;border-bottom:1px solid #2a2a4a;text-align:right;color:#fff;font-size:14px;font-weight:600;">' + (service || 'Consultation') + '</td></tr>'
    + '<tr><td style="padding:10px 0;border-bottom:1px solid #2a2a4a;color:#808080;font-size:13px;">&#128197; ' + t.labelDate + '</td><td style="padding:10px 0;border-bottom:1px solid #2a2a4a;text-align:right;color:#fff;font-size:14px;font-weight:600;">' + date + '</td></tr>'
    + '<tr><td style="padding:10px 0;border-bottom:1px solid #2a2a4a;color:#808080;font-size:13px;">&#128336; ' + t.labelTime + '</td><td style="padding:10px 0;border-bottom:1px solid #2a2a4a;text-align:right;color:#fff;font-size:14px;font-weight:600;">' + time + '</td></tr>'
    + '<tr><td style="padding:10px 0;color:#808080;font-size:13px;">&#128278; ' + t.labelRef + '</td><td style="padding:10px 0;text-align:right;color:#667eea;font-size:14px;font-weight:700;font-family:monospace;">' + bookingId + '</td></tr>'
    + '</table></td></tr></table>'

    // Étapes
    + '<p style="color:#667eea;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px;">&#128640; ' + t.nextSteps + '</p>'
    + '<table width="100%" cellpadding="0" cellspacing="0">' + stepsHtml + '</table>'
    + '</td></tr>'

    // CTA
    + '<tr><td style="background:#111;padding:0 40px 32px;text-align:center;">'
    + '<a href="https://neuraweb.tech" style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:8px;">&#127758; ' + t.cta + '</a>'
    + '</td></tr>'

    // FOOTER
    + '<tr><td style="background:#0d0d0d;border-top:1px solid #1a1a1a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">'
    + '<p style="color:#505050;font-size:13px;margin:0 0 8px;">' + t.footer + ' <a href="mailto:' + CONFIG.EMAIL_ALIAS + '" style="color:#667eea;text-decoration:none;">' + CONFIG.EMAIL_ALIAS + '</a></p>'
    + '<p style="color:#303030;font-size:12px;margin:0;">&#169; ' + year + ' NeurAWeb &mdash; <a href="https://neuraweb.tech" style="color:#404040;text-decoration:none;">neuraweb.tech</a></p>'
    + '</td></tr>'

    + '</table></td></tr></table></body></html>';
}

// ============================================================
// TEMPLATE EMAIL ADMIN — fond blanc + logo noir
// ============================================================

function getAdminEmailTemplate(params) {
  const bookingId = params.bookingId, name = params.name, email = params.email;
  const phone = params.phone, service = params.service, date = params.date;
  const time = params.time, message = params.message;

  const year = new Date().getFullYear();

  const rows = [
    ['Nom', '<strong>' + name + '</strong>'],
    ['Email', '<a href="mailto:' + email + '" style="color:#667eea;text-decoration:none;">' + email + '</a>'],
    ['Téléphone', phone || '<span style="color:#aaa;">Non renseigné</span>'],
    ['Service', service || '<span style="color:#aaa;">Non spécifié</span>'],
    ['Date', '<strong>' + date + '</strong>'],
    ['Heure', '<strong>' + time + '</strong>'],
    ['Référence', '<strong style="color:#667eea;font-family:monospace;">' + bookingId + '</strong>']
  ];

  const rowsHtml = rows.map(function(row, i) {
    return '<tr style="background:' + (i % 2 === 0 ? '#fff' : '#f8f8ff') + ';">'
      + '<td style="padding:12px 16px;border-bottom:1px solid #e8e8f0;color:#888;font-size:13px;width:35%;">' + row[0] + '</td>'
      + '<td style="padding:12px 16px;border-bottom:1px solid #e8e8f0;color:#1a1a1a;font-size:14px;">' + row[1] + '</td>'
      + '</tr>';
  }).join('');

  return '<!DOCTYPE html><html lang="fr">'
    + '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Réservation ' + bookingId + '</title></head>'
    + '<body style="margin:0;padding:0;background:#f0f0f5;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Arial,sans-serif;">'
    + '<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f5;padding:40px 20px;">'
    + '<tr><td align="center">'
    + '<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">'

    // HEADER fond blanc + logo noir
    + '<tr><td style="background:#fff;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;border-bottom:3px solid #667eea;">'
    + '<img src="https://neuraweb.tech/assets/neurawebB.png" alt="NeurAWeb" width="160" style="display:block;margin:0 auto 12px;height:auto;" />'
    + '<p style="color:#667eea;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0;">&#128197; Nouvelle Réservation</p>'
    + '</td></tr>'

    // BANDEAU violet
    + '<tr><td style="background:linear-gradient(135deg,#667eea,#764ba2);padding:16px 40px;text-align:center;">'
    + '<p style="color:#fff;font-size:16px;font-weight:600;margin:0;">Nouveau RDV &mdash; <strong>' + bookingId + '</strong></p>'
    + '</td></tr>'

    // DÉTAILS
    + '<tr><td style="background:#fff;padding:32px 40px;">'
    + '<p style="color:#667eea;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 20px;">&#128100; Informations Client</p>'
    + '<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0f0;border-radius:8px;overflow:hidden;">'
    + rowsHtml
    + '</table>'

    + (message
        ? '<div style="margin-top:24px;background:#f8f8ff;border-left:4px solid #667eea;border-radius:4px;padding:16px;">'
          + '<p style="color:#667eea;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin:0 0 8px;">&#128172; Message du client</p>'
          + '<p style="color:#333;font-size:14px;line-height:1.6;margin:0;">' + message + '</p>'
          + '</div>'
        : '')

    // Boutons d'action
    + '<div style="margin-top:28px;text-align:center;">'
    + '<a href="mailto:' + email + '?subject=Re:%20Rendez-vous%20' + bookingId + '" style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:8px;margin:4px;">&#128231; Répondre au client</a>'
    + '<a href="https://docs.google.com/spreadsheets/d/' + CONFIG.SPREADSHEET_ID + '" style="display:inline-block;background:#f0f0ff;color:#667eea;border:2px solid #667eea;font-size:14px;font-weight:600;text-decoration:none;padding:10px 24px;border-radius:8px;margin:4px;">&#128202; Voir Google Sheet</a>'
    + '</div>'
    + '</td></tr>'

    // FOOTER
    + '<tr><td style="background:#f0f0f5;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;border-top:1px solid #e0e0f0;">'
    + '<p style="color:#999;font-size:12px;margin:0;">&#169; ' + year + ' NeurAWeb &mdash; Notification automatique interne</p>'
    + '</td></tr>'

    + '</table></td></tr></table></body></html>';
}

// ============================================================
// INITIALISATION DES FEUILLES
// ============================================================

function initializeSheets() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

  const sheetsConfig = [
    { name: CONFIG.SHEETS.BOOKINGS,      headers: ['Date', 'ID', 'Nom', 'Email', 'Téléphone', 'Service', 'Date RDV', 'Heure', 'Message', 'Langue', 'Statut'] },
    { name: CONFIG.SHEETS.CONVERSATIONS, headers: ['Date', 'Session ID', 'Nb Messages', 'Dernier msg utilisateur', 'Dernière réponse bot', 'Nom', 'Email', 'Service', 'Messages (JSON)'] },
    { name: CONFIG.SHEETS.CONTACTS,      headers: ['Date', 'Nom', 'Email', 'Téléphone', 'Entreprise', 'Service', 'Message', 'Source'] },
    { name: CONFIG.SHEETS.SLOTS,         headers: ['Date', 'Heure', 'Statut', 'ID Réservation'] }
  ];

  sheetsConfig.forEach(function(cfg) {
    let sheet = ss.getSheetByName(cfg.name);
    if (!sheet) {
      sheet = ss.insertSheet(cfg.name);
      sheet.getRange(1, 1, 1, cfg.headers.length).setValues([cfg.headers]);
      sheet.getRange(1, 1, 1, cfg.headers.length)
        .setFontWeight('bold')
        .setBackground('#667eea')
        .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }
  });

  return { success: true, message: 'Feuilles initialisées' };
}

// ============================================================
// UTILITAIRES
// ============================================================

function formatDateISO(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

function formatDateFR(date) {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const d = new Date(date);
  return days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
}

// ============================================================
// DÉCLENCHEURS AUTOMATIQUES
// ============================================================

function setupTriggers() {
  ScriptApp.getProjectTriggers().forEach(function(t) { ScriptApp.deleteTrigger(t); });

  ScriptApp.newTrigger('generateUpcomingSlots')
    .timeBased().everyDays(1).atHour(1).create();

  ScriptApp.newTrigger('cleanOldSlots')
    .timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(2).create();

  Logger.log('Déclencheurs configurés avec succès');
}

function cleanOldSlots() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEETS.SLOTS);
  if (!sheet || sheet.getLastRow() < 2) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues();

  for (let i = data.length - 1; i >= 0; i--) {
    if (!data[i][0]) continue;
    const slotDate = new Date(data[i][0]);
    slotDate.setHours(0, 0, 0, 0);
    if (slotDate < today && data[i][2] === 'disponible') {
      sheet.deleteRow(i + 2);
    }
  }
}

// ============================================================
// FONCTION UTILITAIRE — Extraire HH:MM depuis n'importe quel
// format retourné par Google Sheets pour une cellule "heure"
// ============================================================

/**
 * Google Sheets stocke les heures comme fraction de jour depuis le 30/12/1899.
 * Lorsque Apps Script lit la cellule, il retourne un objet Date dont :
 *   - getHours() est CORRECT (heure locale du script = Europe/Paris)
 *   - getUTCHours() est FAUX (décalage historique UTC+0:09:21 → +14 minutes)
 *
 * Cette fonction gère tous les cas possibles.
 */
function extractTime(value) {
  if (!value) return '00:00';

  // Cas 1 : objet Date (le plus fréquent après lecture de Sheets)
  if (value instanceof Date) {
    // getHours() respecte la timezone du script (CONFIG.TIMEZONE = Europe/Paris)
    var h = String(value.getHours()).padStart(2, '0');
    var m = String(value.getMinutes()).padStart(2, '0');
    return h + ':' + m;
  }

  // Cas 2 : string ISO "1899-12-30T08:50:39.000Z"
  // NE PAS faire new Date(str).getUTCHours() → bug +14min
  // Extraire directement depuis la string
  if (typeof value === 'string' && value.includes('T')) {
    // Format : "...THH:MM:SS..." — on prend HH:MM après le T
    var timePart = value.split('T')[1]; // "08:50:39.000Z"
    // Ajouter 1h pour corriger UTC → Paris (heure d'hiver)
    // OU mieux : utiliser les heures stockées dans la cellule texte d'origine
    // → en pratique ce cas ne devrait pas arriver si generateUpcomingSlots
    //   écrit correctement les heures en texte
    var parts = timePart.split(':');
    var hours = parseInt(parts[0], 10);
    var minutes = parseInt(parts[1], 10);
    // Correction offset Paris (UTC+1 hiver, UTC+2 été)
    var offset = isDST() ? 2 : 1;
    hours = (hours + offset) % 24;
    return String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
  }

  // Cas 3 : string "HH:MM" ou "HH:MM:SS" — déjà propre
  if (typeof value === 'string') {
    return value.substring(0, 5);
  }

  return '00:00';
}

/** Détecte si on est en heure d'été (DST) en France */
function isDST() {
  var now = new Date();
  var jan = new Date(now.getFullYear(), 0, 1);
  var jul = new Date(now.getFullYear(), 6, 1);
  var stdOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  return now.getTimezoneOffset() < stdOffset;
}

// ============================================================
// GESTION DES CRÉNEAUX — version corrigée
// ============================================================

function getAvailableSlots(targetDate) {
  initializeSheets();
  generateUpcomingSlots();

  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var sheet = ss.getSheetByName(CONFIG.SHEETS.SLOTS);
  if (!sheet || sheet.getLastRow() < 2) return { slots: [] };

  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues();
  var slots = [];

  data.forEach(function(row) {
    var date = row[0], time = row[1], status = row[2], bookingId = row[3];
    if (!date) return;

    var dateStr = formatDateISO(new Date(date));
    if (targetDate && dateStr !== targetDate) return;

    if (status === 'disponible') {
      var timeStr = extractTime(time); // ← FIX CENTRAL
      slots.push({
        date: dateStr,
        time: timeStr,
        status: status,
        available: true,
        bookingId: bookingId || ''
      });
    }
  });

  return { slots: slots };
}

function saveBooking(data) {
  var name = data.name, email = data.email, phone = data.phone;
  var service = data.service, date = data.date, time = data.time;
  var message = data.message, language = data.language;

  if (!name || !email || !date || !time) {
    return { success: false, error: 'Champs obligatoires manquants' };
  }

  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var slotsSheet = ss.getSheetByName(CONFIG.SHEETS.SLOTS);
  var slotRow = -1;

  if (slotsSheet && slotsSheet.getLastRow() > 1) {
    var slotsData = slotsSheet.getRange(2, 1, slotsSheet.getLastRow() - 1, 4).getValues();
    for (var i = 0; i < slotsData.length; i++) {
      var slotDate = formatDateISO(new Date(slotsData[i][0]));
      var slotTime = extractTime(slotsData[i][1]); // ← FIX : normaliser avant comparaison

      Logger.log('Comparing: slotDate=' + slotDate + ' vs date=' + date + ' | slotTime=' + slotTime + ' vs time=' + time);

      if (slotDate === date && slotTime === time && slotsData[i][2] === 'disponible') {
        slotRow = i + 2;
        break;
      }
    }
  }

  if (slotRow === -1) {
    Logger.log('Créneau non trouvé pour date=' + date + ' time=' + time);
    return { success: false, error: 'Créneau non disponible' };
  }

  var bookingId = 'RDV-' + Utilities.getUuid().substring(0, 8).toUpperCase();
  var timestamp = new Date();

  slotsSheet.getRange(slotRow, 3, 1, 2).setValues([['réservé', bookingId]]);

  var bookingsSheet = ss.getSheetByName(CONFIG.SHEETS.BOOKINGS);
  bookingsSheet.appendRow([
    timestamp, bookingId, name, email,
    phone || '', service || '', date, time,
    message || '', language || 'fr', 'confirmé'
  ]);

  sendBookingEmails({
    bookingId: bookingId, name: name, email: email, phone: phone,
    service: service, date: date, time: time, message: message, language: language
  });

  return {
    success: true,
    bookingId: bookingId,
    message: 'Réservation confirmée pour le ' + formatDateFR(new Date(date + 'T12:00:00')),
    details: { bookingId: bookingId, date: date, time: time, name: name }
  };
}

// ============================================================
// GÉNÉRATION DES CRÉNEAUX — forcer le stockage en texte pur
// ============================================================

function generateUpcomingSlots() {
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var sheet = ss.getSheetByName(CONFIG.SHEETS.SLOTS);

  var existing = new Set ? new Set() : {};
  var useSet = typeof Set !== 'undefined';

  if (sheet.getLastRow() > 1) {
    var existingData = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
    existingData.forEach(function(row) {
      if (!row[0]) return;
      var key = formatDateISO(new Date(row[0])) + '_' + extractTime(row[1]);
      if (useSet) existing.add(key);
      else existing[key] = true;
    });
  }

  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var newRows = [];

  for (var d = 0; d < CONFIG.DAYS_AHEAD; d++) {
    var date = new Date(today);
    date.setDate(today.getDate() + d + 1);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    var dateStr = Utilities.formatDate(date, CONFIG.TIMEZONE, 'yyyy-MM-dd');

    for (var h = CONFIG.WORKING_HOURS.start; h < CONFIG.WORKING_HOURS.end; h++) {
      var timeStr = (h < 10 ? '0' : '') + h + ':00';
      var key = dateStr + '_' + timeStr;

      var exists = useSet ? existing.has(key) : existing.hasOwnProperty(key);
      if (!exists) {
        // Stocker la date ET l'heure comme STRING PURE
        // setNumberFormat('@') dira à Sheets de ne pas interpréter
        newRows.push([dateStr, timeStr, 'disponible', '']);
      }
    }
  }

  if (newRows.length > 0) {
    var startRow = sheet.getLastRow() + 1;
    var range = sheet.getRange(startRow, 1, newRows.length, 4);
    // Forcer le format texte sur la colonne heure AVANT d'écrire
    sheet.getRange(startRow, 2, newRows.length, 1).setNumberFormat('@STRING@');
    range.setValues(newRows);
  }
}

// ============================================================
// GESTION DES TOKENS HÔTEL
// ============================================================

/**
 * Vérifie la validité d'un token hôtel
 */
function verifyHotelToken(token) {
  if (!token) {
    return { error: 'Token requis' };
  }

  initializeHotelSheets();

  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var sheet = ss.getSheetByName(CONFIG.SHEETS.HOTEL_TOKENS);

  if (!sheet || sheet.getLastRow() < 2) {
    return { error: 'Token non trouvé' };
  }

  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).getValues();

  for (var i = 0; i < data.length; i++) {
    var rowToken = data[i][0];
    var hotelName = data[i][1];
    var email = data[i][2];
    var status = data[i][5];

    if (rowToken === token) {
      if (status === 'utilisé') {
        return { error: 'Ce lien a déjà été utilisé' };
      }
      return {
        valid: true,
        hotelName: hotelName,
        email: email
      };
    }
  }

  return { error: 'Token non trouvé' };
}

/**
 * Crée un nouveau token pour un hôtel
 */
function createHotelToken(data) {
  var token = data.token;
  var hotelName = data.hotelName;
  var email = data.email;
  var contactName = data.contactName;
  var language = data.language;
  var formUrl = data.formUrl;
  var createdAt = data.createdAt;

  if (!token || !hotelName || !email) {
    return { success: false, error: 'Token, nom de l\'hôtel et email sont requis' };
  }

  initializeHotelSheets();

  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var sheet = ss.getSheetByName(CONFIG.SHEETS.HOTEL_TOKENS);
  var timestamp = new Date();

  // Ajouter le token dans la feuille
  sheet.appendRow([
    token,
    hotelName,
    email,
    contactName || '',
    timestamp,
    'actif',
    formUrl || '',
    language || 'fr'
  ]);

  // NOTE: L'email est envoyé via Resend par l'API Next.js (/api/hotel-form)
  // Plus besoin de GmailApp ici

  return {
    success: true,
    token: token,
    message: 'Token créé avec succès'
  };
}

/**
 * Envoie l'email avec le lien du formulaire à l'hôtel
 */
function sendHotelTokenEmail(params) {
  var token = params.token;
  var hotelName = params.hotelName;
  var email = params.email;
  var contactName = params.contactName;
  var formUrl = params.formUrl;
  var language = params.language || 'fr';

  var isEnglish = language === 'en';
  var isSpanish = language === 'es';
  var year = new Date().getFullYear();

  var t = isEnglish ? {
    subject: '[' + CONFIG.COMPANY_NAME + '] Your personalized form — ' + hotelName,
    title: 'Your Form is Ready',
    greeting: 'Hello' + (contactName ? ' ' + contactName : '') + ',',
    subtitle: 'We have prepared a personalized form for <strong>' + hotelName + '</strong>. Please fill it out so we can create your website.',
    cta: 'Fill out the form',
    validity: 'This link is valid for 30 days.',
    footer: 'Questions? Contact us at'
  } : isSpanish ? {
    subject: '[' + CONFIG.COMPANY_NAME + '] Tu formulario personalizado — ' + hotelName,
    title: 'Tu Formulario está Listo',
    greeting: 'Hola' + (contactName ? ' ' + contactName : '') + ',',
    subtitle: 'Hemos preparado un formulario personalizado para <strong>' + hotelName + '</strong>. Por favor, complétalo para que podamos crear tu sitio web.',
    cta: 'Completar el formulario',
    validity: 'Este enlace es válido por 30 días.',
    footer: '¿Preguntas? Contáctanos en'
  } : {
    subject: '[' + CONFIG.COMPANY_NAME + '] Votre formulaire personnalisé — ' + hotelName,
    title: 'Votre Formulaire est Prêt',
    greeting: 'Bonjour' + (contactName ? ' ' + contactName : '') + ',',
    subtitle: 'Nous avons préparé un formulaire personnalisé pour <strong>' + hotelName + '</strong>. Merci de le remplir pour que nous puissions créer votre site web.',
    cta: 'Remplir le formulaire',
    validity: 'Ce lien est valable 30 jours.',
    footer: 'Des questions ? Contactez-nous à'
  };

  var html = '<!DOCTYPE html><html lang="' + (isEnglish ? 'en' : isSpanish ? 'es' : 'fr') + '">'
    + '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>' + t.title + '</title></head>'
    + '<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Arial,sans-serif;">'
    + '<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">'
    + '<tr><td align="center">'
    + '<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">'

    // HEADER
    + '<tr><td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);border-radius:16px 16px 0 0;padding:40px 40px 32px;text-align:center;">'
    + '<img src="https://neuraweb.tech/assets/neurawebW.png" alt="NeurAWeb" width="180" style="display:block;margin:0 auto 16px;height:auto;max-width:180px;" />'
    + '<div style="width:50px;height:3px;background:linear-gradient(135deg,#667eea,#764ba2);margin:0 auto 20px;border-radius:2px;"></div>'
    + '<h1 style="color:#fff;font-size:20px;font-weight:700;margin:0;">&#128203; ' + t.title + '</h1>'
    + '</td></tr>'

    // CORPS
    + '<tr><td style="background:#111;padding:40px;">'
    + '<p style="color:#e0e0e0;font-size:16px;line-height:1.6;margin:0 0 8px;">' + t.greeting + '</p>'
    + '<p style="color:#a0a0a0;font-size:15px;line-height:1.6;margin:0 0 32px;">' + t.subtitle + '</p>'

    // CTA
    + '<div style="text-align:center;margin-bottom:32px;">'
    + '<a href="' + formUrl + '" style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;font-size:16px;font-weight:600;text-decoration:none;padding:16px 40px;border-radius:8px;">&#9997; ' + t.cta + '</a>'
    + '</div>'

    + '<p style="color:#667eea;font-size:13px;text-align:center;margin:0;">&#128274; ' + t.validity + '</p>'
    + '</td></tr>'

    // FOOTER
    + '<tr><td style="background:#0d0d0d;border-top:1px solid #1a1a1a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">'
    + '<p style="color:#505050;font-size:13px;margin:0 0 8px;">' + t.footer + ' <a href="mailto:' + CONFIG.EMAIL_ALIAS + '" style="color:#667eea;text-decoration:none;">' + CONFIG.EMAIL_ALIAS + '</a></p>'
    + '<p style="color:#303030;font-size:12px;margin:0;">&#169; ' + year + ' NeurAWeb &mdash; <a href="https://neuraweb.tech" style="color:#404040;text-decoration:none;">neuraweb.tech</a></p>'
    + '</td></tr>'

    + '</table></td></tr></table></body></html>';

  sendEmail({
    to: email,
    subject: t.subject,
    html: html,
    replyTo: CONFIG.EMAIL_ALIAS
  });
}

/**
 * Soumet le formulaire hôtel complet
 */
function submitHotelForm(data) {
  var token = data.token;
  var formData = data.formData;
  var pricing = data.pricing;
  var language = data.language || 'fr';
  var submittedAt = data.submittedAt;

  if (!formData || !formData.nom || !formData.email) {
    return { success: false, error: 'Données du formulaire incomplètes' };
  }

  initializeHotelSheets();

  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var tokensSheet = ss.getSheetByName(CONFIG.SHEETS.HOTEL_TOKENS);
  var formsSheet = ss.getSheetByName(CONFIG.SHEETS.HOTEL_FORMS);

  // Générer un ID de soumission
  var submissionId = 'HOTEL-' + Utilities.getUuid().substring(0, 8).toUpperCase();
  var timestamp = new Date();

  // Marquer le token comme utilisé si fourni
  if (token && tokensSheet && tokensSheet.getLastRow() > 1) {
    var tokensData = tokensSheet.getRange(2, 1, tokensSheet.getLastRow() - 1, 7).getValues();
    for (var i = 0; i < tokensData.length; i++) {
      if (tokensData[i][0] === token) {
        tokensSheet.getRange(i + 2, 6).setValue('utilisé');
        break;
      }
    }
  }

  // Formater les données pour le spreadsheet
  var formDataJson = JSON.stringify(formData);
  var pricingJson = JSON.stringify(pricing);

  // Ajouter la soumission dans la feuille
  formsSheet.appendRow([
    timestamp,
    submissionId,
    token || '',
    formData.nom,
    formData.email,
    formData.tel || '',
    formData.typeEtablissement || '',
    formData.pays || '',
    formData.nbChambresTotal || '',
    pricing.totalOneTime || 0,
    pricing.totalMonthly || 0,
    formDataJson,
    pricingJson,
    language
  ]);

  // Créer le PDF et sauvegarder dans Google Drive
  var pdfUrl = '';
  try {
    pdfUrl = createHotelFormPDF({
      submissionId: submissionId,
      formData: formData,
      pricing: pricing,
      language: language,
      timestamp: timestamp
    });
  } catch (err) {
    Logger.log('Erreur création PDF: ' + err.message);
  }

  // NOTE: Les emails sont envoyés via Resend par l'API Next.js (/api/hotel-form)
  // Plus besoin de GmailApp ici

  return {
    success: true,
    submissionId: submissionId,
    message: 'Formulaire soumis avec succès',
    pdfUrl: pdfUrl
  };
}

/**
 * Initialise les feuilles pour les tokens et formulaires hôtel
 */
function initializeHotelSheets() {
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

  // Feuille des tokens
  var tokensSheet = ss.getSheetByName(CONFIG.SHEETS.HOTEL_TOKENS);
  if (!tokensSheet) {
    tokensSheet = ss.insertSheet(CONFIG.SHEETS.HOTEL_TOKENS);
    var tokensHeaders = ['Token', 'Nom Hôtel', 'Email', 'Contact', 'Date Création', 'Statut', 'URL Formulaire', 'Langue'];
    tokensSheet.getRange(1, 1, 1, tokensHeaders.length).setValues([tokensHeaders]);
    tokensSheet.getRange(1, 1, 1, tokensHeaders.length)
      .setFontWeight('bold')
      .setBackground('#667eea')
      .setFontColor('#ffffff');
    tokensSheet.setFrozenRows(1);
  }

  // Feuille des formulaires
  var formsSheet = ss.getSheetByName(CONFIG.SHEETS.HOTEL_FORMS);
  if (!formsSheet) {
    formsSheet = ss.insertSheet(CONFIG.SHEETS.HOTEL_FORMS);
    var formsHeaders = ['Date', 'ID Soumission', 'Token', 'Nom Hôtel', 'Email', 'Téléphone', 'Type', 'Pays', 'Nb Chambres', 'Prix Unique', 'Prix Mensuel', 'Données (JSON)', 'Pricing (JSON)', 'Langue'];
    formsSheet.getRange(1, 1, 1, formsHeaders.length).setValues([formsHeaders]);
    formsSheet.getRange(1, 1, 1, formsHeaders.length)
      .setFontWeight('bold')
      .setBackground('#667eea')
      .setFontColor('#ffffff');
    formsSheet.setFrozenRows(1);
  }
}

/**
 * Teste l'accès au dossier Google Drive
 */
function testDriveAccess() {
  try {
    var folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    var folderName = folder.getName();
    var files = folder.getFiles();
    var fileCount = 0;
    while (files.hasNext()) {
      files.next();
      fileCount++;
    }
    return { 
      success: true, 
      folderName: folderName,
      fileCount: fileCount,
      message: 'Accès au Drive OK'
    };
  } catch (err) {
    return { 
      success: false, 
      error: err.message,
      folderId: CONFIG.DRIVE_FOLDER_ID,
      message: 'Erreur d\'accès au Drive - vérifiez les permissions'
    };
  }
}

/**
 * Crée un PDF du formulaire et le sauvegarde dans Google Drive
 */
function createHotelFormPDF(params) {
  var submissionId = params.submissionId;
  var formData = params.formData;
  var pricing = params.pricing;
  var language = params.language;
  var timestamp = params.timestamp;

  Logger.log('=== Début création PDF ===');
  Logger.log('submissionId: ' + submissionId);
  Logger.log('hotelName: ' + formData.nom);
  Logger.log('DRIVE_FOLDER_ID: ' + CONFIG.DRIVE_FOLDER_ID);

  // Vérifier l'accès au dossier d'abord
  try {
    var testFolder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    Logger.log('Dossier Drive accessible: ' + testFolder.getName());
  } catch (folderErr) {
    Logger.log('ERREUR: Impossible d\'accéder au dossier Drive: ' + folderErr.message);
    return '';
  }

  // Créer un document Google Doc temporaire
  var doc = DocumentApp.create('Formulaire Hôtel - ' + formData.nom + ' - ' + submissionId);
  var body = doc.getBody();

  // Styles
  var titleStyle = {};
  titleStyle[DocumentApp.Attribute.FONT_SIZE] = 18;
  titleStyle[DocumentApp.Attribute.FONT_WEIGHT] = DocumentApp.FontWeight.BOLD;
  titleStyle[DocumentApp.Attribute.COLOR] = '#667eea';

  var headingStyle = {};
  headingStyle[DocumentApp.Attribute.FONT_SIZE] = 14;
  headingStyle[DocumentApp.Attribute.FONT_WEIGHT] = DocumentApp.FontWeight.BOLD;
  headingStyle[DocumentApp.Attribute.COLOR] = '#333333';
  headingStyle[DocumentApp.Attribute.MARGIN_TOP] = 16;

  // Titre
  body.appendParagraph('FORMULAIRE PROJET HÔTELIER').setAttributes(titleStyle);
  body.appendParagraph('NeuraWeb - ' + submissionId).setFontSize(10);
  body.appendParagraph('');

  // Informations générales
  body.appendParagraph('1. INFORMATIONS GÉNÉRALES').setAttributes(headingStyle);
  addFieldToDoc(body, 'Nom de l\'établissement', formData.nom);
  addFieldToDoc(body, 'Type', formData.typeEtablissement);
  addFieldToDoc(body, 'Adresse', formData.adresse);
  addFieldToDoc(body, 'Pays', formData.pays);
  addFieldToDoc(body, 'Email', formData.email);
  addFieldToDoc(body, 'Téléphone', formData.tel);
  addFieldToDoc(body, 'Responsable', formData.responsable);
  addFieldToDoc(body, 'Étoiles', formData.etoiles);
  addFieldToDoc(body, 'Site existant', formData.siteExistant);
  addFieldToDoc(body, 'URL actuelle', formData.urlActuel);

  // Hébergement
  body.appendParagraph('2. HÉBERGEMENT').setAttributes(headingStyle);
  addFieldToDoc(body, 'Nombre de chambres', formData.nbChambresTotal);
  addFieldToDoc(body, 'Capacité totale', formData.capaciteTotale);
  addFieldToDoc(body, 'Étages', formData.etages);
  addFieldToDoc(body, 'Types de chambres', formData.rooms ? JSON.stringify(formData.rooms) : '');
  addFieldToDoc(body, 'Équipements chambres', formData.equipChambres ? formData.equipChambres.join(', ') : '');
  addFieldToDoc(body, 'Animaux acceptés', formData.animaux);
  addFieldToDoc(body, 'Accès PMR', formData.pmr);

  // Services
  body.appendParagraph('3. SERVICES').setAttributes(headingStyle);
  addFieldToDoc(body, 'Services inclus', formData.servicesInclus ? formData.servicesInclus.join(', ') : '');
  addFieldToDoc(body, 'Services supplémentaires', formData.servicesSup ? formData.servicesSup.join(', ') : '');
  addFieldToDoc(body, 'Autres services', formData.autresServices);

  // Réservation
  body.appendParagraph('4. RÉSERVATION').setAttributes(headingStyle);
  addFieldToDoc(body, 'Moteur de réservation', formData.moteurResa);
  addFieldToDoc(body, 'Outil de réservation', formData.outilResa);
  addFieldToDoc(body, 'OTA', formData.ota ? formData.ota.join(', ') : '');
  addFieldToDoc(body, 'Saisonnalité', formData.saisonnalite);
  addFieldToDoc(body, 'Politique d\'annulation', formData.annulation);
  addFieldToDoc(body, 'Moyens de paiement', formData.paiement ? formData.paiement.join(', ') : '');

  // Contenu
  body.appendParagraph('5. CONTENU & MARKETING').setAttributes(headingStyle);
  addFieldToDoc(body, 'Photos disponibles', formData.photos);
  addFieldToDoc(body, 'Langues', formData.langues ? formData.langues.join(', ') : '');
  addFieldToDoc(body, 'Blog', formData.blog);
  addFieldToDoc(body, 'SEO souhaité', formData.seo);
  addFieldToDoc(body, 'Avis clients', formData.avisClients);
  addFieldToDoc(body, 'Réseaux sociaux', formData.reseaux ? formData.reseaux.join(', ') : '');
  addFieldToDoc(body, 'Charte graphique', formData.charte);

  // Objectifs
  body.appendParagraph('6. OBJECTIFS').setAttributes(headingStyle);
  addFieldToDoc(body, 'Public cible', formData.cible ? formData.cible.join(', ') : '');
  addFieldToDoc(body, 'Objectifs', formData.objectifs ? formData.objectifs.join(', ') : '');
  addFieldToDoc(body, 'Chatbot IA', formData.chatbot);
  addFieldToDoc(body, 'Maintenance', formData.maintenance);
  addFieldToDoc(body, 'Budget', formData.budget);
  addFieldToDoc(body, 'Délai', formData.delai);
  addFieldToDoc(body, 'Références', formData.references);
  addFieldToDoc(body, 'Complément', formData.complement);

  // Pricing
  body.appendParagraph('RÉCAPITULATIF TARIFAIRE').setAttributes(headingStyle);
  addFieldToDoc(body, 'Prix unique (USD)', pricing.totalOneTime ? '$' + pricing.totalOneTime : '');
  addFieldToDoc(body, 'Prix mensuel (USD)', pricing.totalMonthly ? '$' + pricing.totalMonthly + '/mois' : '');

  // Sauvegarder et fermer
  doc.saveAndClose();

  // Exporter en PDF
  var pdfBlob = doc.getAs(MimeType.PDF);

  // Sauvegarder dans Google Drive
  var folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
  var pdfFile = folder.createFile(pdfBlob);
  pdfFile.setName('Formulaire_' + submissionId + '_' + formData.nom.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf');

  // Supprimer le Doc temporaire
  DriveApp.getFileById(doc.getId()).setTrashed(true);

  return pdfFile.getUrl();
}

/**
 * Ajoute un champ au document
 */
function addFieldToDoc(body, label, value) {
  if (!value) return;
  var p = body.appendParagraph('');
  p.appendText(label + ': ').setBold(true);
  p.appendText(String(value));
}

/**
 * Envoie les emails de confirmation (client + admin)
 */
function sendHotelFormEmails(params) {
  var submissionId = params.submissionId;
  var formData = params.formData;
  var pricing = params.pricing;
  var language = params.language;
  var pdfUrl = params.pdfUrl;

  var isEnglish = language === 'en';
  var isSpanish = language === 'es';
  var year = new Date().getFullYear();

  // Email au client
  try {
    var clientT = isEnglish ? {
      subject: '[' + CONFIG.COMPANY_NAME + '] Form received — ' + formData.nom,
      title: 'Form Received',
      greeting: 'Hello,',
      subtitle: 'We have received your hotel project form for <strong>' + formData.nom + '</strong>. Our team will analyze your request and contact you within 48 hours.',
      pricingTitle: 'Estimated Price',
      oneTime: 'One-time',
      monthly: 'Monthly',
      nextSteps: 'What happens next?',
      steps: [
        'Our team will analyze your project carefully.',
        'We will contact you within 48 hours.',
        'We will prepare a personalized proposal.'
      ],
      footer: 'Questions? Contact us at'
    } : isSpanish ? {
      subject: '[' + CONFIG.COMPANY_NAME + '] Formulario recibido — ' + formData.nom,
      title: 'Formulario Recibido',
      greeting: 'Hola,',
      subtitle: 'Hemos recibido tu formulario de proyecto hotelero para <strong>' + formData.nom + '</strong>. Nuestro equipo analizará tu solicitud y te contactará en 48 horas.',
      pricingTitle: 'Precio Estimado',
      oneTime: 'Único',
      monthly: 'Mensual',
      nextSteps: '¿Qué sigue?',
      steps: [
        'Nuestro equipo analizará tu proyecto cuidadosamente.',
        'Te contactaremos en 48 horas.',
        'Prepararemos una propuesta personalizada.'
      ],
      footer: '¿Preguntas? Contáctanos en'
    } : {
      subject: '[' + CONFIG.COMPANY_NAME + '] Formulaire reçu — ' + formData.nom,
      title: 'Formulaire Reçu',
      greeting: 'Bonjour,',
      subtitle: 'Nous avons bien reçu votre formulaire de projet hôtelier pour <strong>' + formData.nom + '</strong>. Notre équipe analysera votre demande et vous contactera sous 48h.',
      pricingTitle: 'Prix Estimé',
      oneTime: 'Unique',
      monthly: 'Mensuel',
      nextSteps: 'La suite ?',
      steps: [
        'Notre équipe analysera votre projet avec attention.',
        'Nous vous contacterons sous 48h.',
        'Nous préparerons une proposition personnalisée.'
      ],
      footer: 'Des questions ? Contactez-nous à'
    };

    var stepsHtml = clientT.steps.map(function(step, i) {
      return '<tr><td style="padding:8px 0;vertical-align:top;">'
        + '<table cellpadding="0" cellspacing="0"><tr>'
        + '<td style="padding-right:12px;vertical-align:middle;">'
        + '<div style="width:24px;height:24px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;text-align:center;line-height:24px;color:#fff;font-size:12px;font-weight:bold;display:inline-block;">' + (i + 1) + '</div>'
        + '</td><td><p style="color:#c0c0c0;font-size:14px;margin:3px 0;line-height:1.5;">' + step + '</p></td>'
        + '</tr></table></td></tr>';
    }).join('');

    var pricingHtml = '';
    if (pricing.totalOneTime || pricing.totalMonthly) {
      pricingHtml = '<table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1a1a2e,#16213e);border:1px solid #2a2a4a;border-radius:12px;margin-bottom:32px;">'
        + '<tr><td style="padding:24px;">'
        + '<p style="color:#667eea;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 20px;">&#128176; ' + clientT.pricingTitle + '</p>'
        + '<table width="100%" cellpadding="0" cellspacing="0">';
      if (pricing.totalOneTime) {
        pricingHtml += '<tr><td style="padding:10px 0;border-bottom:1px solid #2a2a4a;color:#808080;font-size:13px;">' + clientT.oneTime + '</td><td style="padding:10px 0;border-bottom:1px solid #2a2a4a;text-align:right;color:#fff;font-size:14px;font-weight:600;">$' + pricing.totalOneTime.toLocaleString() + '</td></tr>';
      }
      if (pricing.totalMonthly) {
        pricingHtml += '<tr><td style="padding:10px 0;color:#808080;font-size:13px;">' + clientT.monthly + '</td><td style="padding:10px 0;text-align:right;color:#fff;font-size:14px;font-weight:600;">$' + pricing.totalMonthly + '/mois</td></tr>';
      }
      pricingHtml += '</table></td></tr></table>';
    }

    var clientHtml = '<!DOCTYPE html><html lang="' + (isEnglish ? 'en' : isSpanish ? 'es' : 'fr') + '">'
      + '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>' + clientT.title + '</title></head>'
      + '<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Arial,sans-serif;">'
      + '<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">'
      + '<tr><td align="center">'
      + '<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">'

      + '<tr><td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);border-radius:16px 16px 0 0;padding:40px 40px 32px;text-align:center;">'
      + '<img src="https://neuraweb.tech/assets/neurawebW.png" alt="NeurAWeb" width="180" style="display:block;margin:0 auto 16px;height:auto;max-width:180px;" />'
      + '<div style="width:50px;height:3px;background:linear-gradient(135deg,#667eea,#764ba2);margin:0 auto 20px;border-radius:2px;"></div>'
      + '<h1 style="color:#fff;font-size:20px;font-weight:700;margin:0;">&#10003; ' + clientT.title + '</h1>'
      + '</td></tr>'

      + '<tr><td style="background:#111;padding:40px;">'
      + '<p style="color:#e0e0e0;font-size:16px;line-height:1.6;margin:0 0 8px;">' + clientT.greeting + '</p>'
      + '<p style="color:#a0a0a0;font-size:15px;line-height:1.6;margin:0 0 32px;">' + clientT.subtitle + '</p>'

      + pricingHtml

      + '<p style="color:#667eea;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px;">&#128640; ' + clientT.nextSteps + '</p>'
      + '<table width="100%" cellpadding="0" cellspacing="0">' + stepsHtml + '</table>'
      + '</td></tr>'

      + '<tr><td style="background:#111;padding:0 40px 32px;text-align:center;">'
      + '<a href="https://neuraweb.tech" style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:8px;">&#127758; Visiter notre site</a>'
      + '</td></tr>'

      + '<tr><td style="background:#0d0d0d;border-top:1px solid #1a1a1a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">'
      + '<p style="color:#505050;font-size:13px;margin:0 0 8px;">' + clientT.footer + ' <a href="mailto:' + CONFIG.EMAIL_ALIAS + '" style="color:#667eea;text-decoration:none;">' + CONFIG.EMAIL_ALIAS + '</a></p>'
      + '<p style="color:#303030;font-size:12px;margin:0;">&#169; ' + year + ' NeurAWeb &mdash; <a href="https://neuraweb.tech" style="color:#404040;text-decoration:none;">neuraweb.tech</a></p>'
      + '</td></tr>'

      + '</table></td></tr></table></body></html>';

    sendEmail({
      to: formData.email,
      subject: clientT.subject,
      html: clientHtml,
      replyTo: CONFIG.EMAIL_ALIAS
    });
  } catch (err) {
    Logger.log('Erreur email client: ' + err.message);
  }

  // Email à l'admin
  try {
    var adminRows = [
      ['ID', '<strong style="color:#667eea;font-family:monospace;">' + submissionId + '</strong>'],
      ['Hôtel', '<strong>' + formData.nom + '</strong>'],
      ['Email', '<a href="mailto:' + formData.email + '" style="color:#667eea;text-decoration:none;">' + formData.email + '</a>'],
      ['Téléphone', formData.tel || '<span style="color:#aaa;">Non renseigné</span>'],
      ['Type', formData.typeEtablissement || '-'],
      ['Pays', formData.pays || '-'],
      ['Chambres', formData.nbChambresTotal || '-'],
      ['Budget', formData.budget || '-'],
      ['Délai', formData.delai || '-'],
      ['Prix unique', pricing.totalOneTime ? '<strong style="color:#22c55e;">$' + pricing.totalOneTime.toLocaleString() + '</strong>' : '-'],
      ['Prix mensuel', pricing.totalMonthly ? '<strong style="color:#22c55e;">$' + pricing.totalMonthly + '/mois</strong>' : '-']
    ];

    var adminRowsHtml = adminRows.map(function(row, i) {
      return '<tr style="background:' + (i % 2 === 0 ? '#fff' : '#f8f8ff') + ';">'
        + '<td style="padding:12px 16px;border-bottom:1px solid #e8e8f0;color:#888;font-size:13px;width:35%;">' + row[0] + '</td>'
        + '<td style="padding:12px 16px;border-bottom:1px solid #e8e8f0;color:#1a1a1a;font-size:14px;">' + row[1] + '</td>'
        + '</tr>';
    }).join('');

    var adminHtml = '<!DOCTYPE html><html lang="fr">'
      + '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Nouveau formulaire hôtel - ' + formData.nom + '</title></head>'
      + '<body style="margin:0;padding:0;background:#f0f0f5;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Arial,sans-serif;">'
      + '<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f5;padding:40px 20px;">'
      + '<tr><td align="center">'
      + '<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">'

      + '<tr><td style="background:#fff;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;border-bottom:3px solid #667eea;">'
      + '<img src="https://neuraweb.tech/assets/neurawebB.png" alt="NeurAWeb" width="160" style="display:block;margin:0 auto 12px;height:auto;" />'
      + '<p style="color:#667eea;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0;">&#127968; Nouveau Formulaire Hôtel</p>'
      + '</td></tr>'

      + '<tr><td style="background:linear-gradient(135deg,#667eea,#764ba2);padding:16px 40px;text-align:center;">'
      + '<p style="color:#fff;font-size:16px;font-weight:600;margin:0;">' + formData.nom + ' &mdash; <strong>' + submissionId + '</strong></p>'
      + '</td></tr>'

      + '<tr><td style="background:#fff;padding:32px 40px;">'
      + '<p style="color:#667eea;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 20px;">&#128100; Informations</p>'
      + '<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0f0;border-radius:8px;overflow:hidden;">'
      + adminRowsHtml
      + '</table>'

      // Boutons d'action
      + '<div style="margin-top:28px;text-align:center;">'
      + '<a href="mailto:' + formData.email + '?subject=Re:%20Votre%20projet%20-%20' + formData.nom + '" style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:8px;margin:4px;">&#128231; Répondre</a>'
      + (pdfUrl ? '<a href="' + pdfUrl + '" style="display:inline-block;background:#f0f0ff;color:#667eea;border:2px solid #667eea;font-size:14px;font-weight:600;text-decoration:none;padding:10px 24px;border-radius:8px;margin:4px;">&#128196; Voir PDF</a>' : '')
      + '<a href="https://docs.google.com/spreadsheets/d/' + CONFIG.SPREADSHEET_ID + '" style="display:inline-block;background:#f0f0ff;color:#667eea;border:2px solid #667eea;font-size:14px;font-weight:600;text-decoration:none;padding:10px 24px;border-radius:8px;margin:4px;">&#128202; Sheet</a>'
      + '</div>'
      + '</td></tr>'

      + '<tr><td style="background:#f0f0f5;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;border-top:1px solid #e0e0f0;">'
      + '<p style="color:#999;font-size:12px;margin:0;">&#169; ' + year + ' NeurAWeb &mdash; Notification automatique</p>'
      + '</td></tr>'

      + '</table></td></tr></table></body></html>';

    sendEmail({
      to: CONFIG.ADMIN_EMAIL,
      subject: '[NeurAWeb] Nouveau formulaire hôtel - ' + formData.nom + ' (' + submissionId + ')',
      html: adminHtml,
      replyTo: formData.email
    });
  } catch (err) {
    Logger.log('Erreur email admin: ' + err.message);
  }
}
