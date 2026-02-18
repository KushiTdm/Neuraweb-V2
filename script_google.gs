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
    SLOTS: 'Créneaux'
  }
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
// GESTION DES CRÉNEAUX
// ============================================================

function getAvailableSlots(targetDate) {
  initializeSheets();
  generateUpcomingSlots();

  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEETS.SLOTS);
  if (!sheet || sheet.getLastRow() < 2) return { slots: [] };

  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues();
  const slots = [];

  data.forEach(function(row) {
    const date = row[0], time = row[1], status = row[2], bookingId = row[3];
    if (!date) return;
    const dateStr = formatDateISO(new Date(date));
    if (targetDate && dateStr !== targetDate) return;
    if (status === 'disponible') {
      // FIX: extraire HH:MM depuis objet Date retourné par Google Sheets
      var timeStr;
      if (time instanceof Date) {
  timeStr = Utilities.formatDate(time, CONFIG.TIMEZONE, 'HH:mm');
} else if (typeof time === 'string' && time.indexOf('T') !== -1) {
  timeStr = Utilities.formatDate(new Date(time), CONFIG.TIMEZONE, 'HH:mm');
} else {
  timeStr = String(time).substring(0, 5); // sécurité si format "09:00:00"
}
      slots.push({ date: dateStr, time: timeStr, status: status, available: true, bookingId: bookingId || '' });
    }
  });

  return { slots: slots };
}

function generateUpcomingSlots() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEETS.SLOTS);

  const existing = new Set();
  if (sheet.getLastRow() > 1) {
    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
    data.forEach(function(row) {
      if (row[0]) existing.add(formatDateISO(new Date(row[0])) + '_' + row[1]);
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const newRows = [];

  for (let d = 0; d < CONFIG.DAYS_AHEAD; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d + 1);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    for (let h = CONFIG.WORKING_HOURS.start; h < CONFIG.WORKING_HOURS.end; h++) {
      const time = (h < 10 ? '0' : '') + h + ':00';
      const key = formatDateISO(date) + '_' + time;
      if (!existing.has(key)) {
        // Forcer le format texte pour l'heure (évite la conversion en Date par Sheets)
        newRows.push([Utilities.formatDate(date, CONFIG.TIMEZONE, 'yyyy-MM-dd'), time, 'disponible', '']);
      }
    }
  }

  if (newRows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, 4).setValues(newRows);
  }
}

// ============================================================
// SAUVEGARDE DES RÉSERVATIONS
// ============================================================

function saveBooking(data) {
  const name = data.name, email = data.email, phone = data.phone;
  const service = data.service, date = data.date, time = data.time;
  const message = data.message, language = data.language;

  if (!name || !email || !date || !time) {
    return { success: false, error: 'Champs obligatoires manquants' };
  }

  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const slotsSheet = ss.getSheetByName(CONFIG.SHEETS.SLOTS);
  let slotRow = -1;

  if (slotsSheet && slotsSheet.getLastRow() > 1) {
    const slotsData = slotsSheet.getRange(2, 1, slotsSheet.getLastRow() - 1, 4).getValues();
    for (let i = 0; i < slotsData.length; i++) {
      const slotDate = formatDateISO(new Date(slotsData[i][0]));
      var slotTime = slotsData[i][1];
if (slotTime instanceof Date) {
  slotTime = Utilities.formatDate(slotTime, CONFIG.TIMEZONE, 'HH:mm');
} else if (typeof slotTime === 'string' && slotTime.indexOf('T') !== -1) {
  slotTime = Utilities.formatDate(new Date(slotTime), CONFIG.TIMEZONE, 'HH:mm');
} else {
  slotTime = String(slotTime).substring(0, 5);
}

if (slotDate === date && slotTime === time && slotsData[i][2] === 'disponible') {        slotRow = i + 2;
        break;
      }
    }
  }

  if (slotRow === -1) {
    return { success: false, error: 'Créneau non disponible' };
  }

  const bookingId = 'RDV-' + Utilities.getUuid().substring(0, 8).toUpperCase();
  const timestamp = new Date();

  slotsSheet.getRange(slotRow, 3, 1, 2).setValues([['réservé', bookingId]]);

  const bookingsSheet = ss.getSheetByName(CONFIG.SHEETS.BOOKINGS);
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
  const name = data.name, email = data.email, phone = data.phone;
  const company = data.company, service = data.service;
  const message = data.message, source = data.source;

  if (!name || !email) {
    return { success: false, error: 'Nom et email obligatoires' };
  }

  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEETS.CONTACTS);
  const timestamp = new Date();

  sheet.appendRow([
    timestamp, name, email, phone || '',
    company || '', service || '', message || '', source || 'chatbot'
  ]);

  try {
    sendEmail({
      to: CONFIG.ADMIN_EMAIL,
      subject: '[NeurAWeb] Nouveau contact: ' + name,
      html: getContactNotificationTemplate({
        name: name, email: email, phone: phone, company: company,
        service: service, message: message, timestamp: timestamp
      })
    });
  } catch (err) {
    Logger.log('Erreur email contact: ' + err.message);
  }

  return { success: true, message: 'Contact enregistré avec succès' };
}

// ============================================================
// ENVOI D'EMAILS (avec alias contact@neuraweb.tech)
// ============================================================

function sendEmail(params) {
  const to = params.to, subject = params.subject, html = params.html, replyTo = params.replyTo;

  const options = {
    htmlBody: html,
    replyTo: replyTo || CONFIG.EMAIL_ALIAS,
    name: CONFIG.COMPANY_NAME
  };

  try {
    GmailApp.sendEmail(to, subject, '', Object.assign({}, options, { from: CONFIG.EMAIL_ALIAS }));
  } catch (aliasErr) {
    Logger.log('Alias indisponible, fallback compte principal: ' + aliasErr.message);
    GmailApp.sendEmail(to, subject, '', options);
  }
}

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
    + '<img src="https://neuraweb.tech/assets/neurawebW.webp" alt="NeurAWeb" width="180" style="display:block;margin:0 auto 16px;height:auto;max-width:180px;" />'
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
    + '<img src="https://neuraweb.tech/assets/neurawebB.webp" alt="NeurAWeb" width="160" style="display:block;margin:0 auto 12px;height:auto;" />'
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
// TEMPLATE EMAIL NOTIFICATION CONTACT
// ============================================================

function getContactNotificationTemplate(params) {
  const name = params.name, email = params.email, phone = params.phone;
  const company = params.company, service = params.service;
  const message = params.message, timestamp = params.timestamp;
  const year = new Date().getFullYear();

  const rows = [
    ['Nom', name],
    ['Email', email],
    ['Téléphone', phone || 'N/A'],
    ['Entreprise', company || 'N/A'],
    ['Service', service || 'N/A'],
    ['Date', timestamp.toLocaleString('fr-FR')]
  ];

  const rowsHtml = rows.map(function(r, i) {
    return '<tr style="background:' + (i % 2 === 0 ? '#fff' : '#f8f8ff') + ';">'
      + '<td style="padding:10px 16px;color:#888;font-size:13px;border-bottom:1px solid #eee;width:35%;">' + r[0] + '</td>'
      + '<td style="padding:10px 16px;color:#333;font-size:14px;border-bottom:1px solid #eee;">' + r[1] + '</td></tr>';
  }).join('');

  return '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Nouveau contact</title></head>'
    + '<body style="margin:0;padding:0;background:#f0f0f5;font-family:Arial,sans-serif;">'
    + '<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;background:#f0f0f5;">'
    + '<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">'
    + '<tr><td style="background:#fff;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;border-bottom:3px solid #667eea;">'
    + '<img src="https://neuraweb.tech/assets/neurawebB.webp" alt="NeurAWeb" width="160" style="display:block;margin:0 auto 12px;height:auto;" />'
    + '<p style="color:#667eea;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0;">&#128235; Nouveau Contact</p>'
    + '</td></tr>'
    + '<tr><td style="background:#fff;padding:32px 40px;">'
    + '<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0f0;border-radius:8px;overflow:hidden;">'
    + rowsHtml + '</table>'
    + (message
        ? '<div style="margin-top:20px;background:#f8f8ff;border-left:4px solid #667eea;padding:16px;border-radius:4px;">'
          + '<p style="color:#667eea;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin:0 0 8px;">&#128172; Message</p>'
          + '<p style="color:#333;font-size:14px;margin:0;">' + message + '</p></div>'
        : '')
    + '</td></tr>'
    + '<tr><td style="background:#f0f0f5;border-radius:0 0 16px 16px;padding:16px 40px;text-align:center;border-top:1px solid #e0e0f0;">'
    + '<p style="color:#999;font-size:12px;margin:0;">&#169; ' + year + ' NeurAWeb &mdash; Notification automatique</p>'
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
// FONCTIONS DE TEST
// ============================================================

function testSetup() {
  Logger.log('=== TEST SETUP ===');
  initializeSheets();
  Logger.log('Feuilles OK');
  generateUpcomingSlots();
  Logger.log('Créneaux générés');
  const slots = getAvailableSlots();
  Logger.log('Créneaux disponibles: ' + slots.slots.length);
  Logger.log('=== OK ===');
}

function testEmail() {
  Logger.log('Test envoi email...');
  sendBookingEmails({
    bookingId: 'RDV-TEST01',
    name: 'Test Utilisateur',
    email: CONFIG.ADMIN_EMAIL,
    phone: '+33 6 00 00 00 00',
    service: 'Développement Web',
    date: '2026-03-01',
    time: '10:00',
    message: 'Ceci est un test de réservation.',
    language: 'fr'
  });
  Logger.log('Email de test envoyé à ' + CONFIG.ADMIN_EMAIL);
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