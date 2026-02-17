/**
 * =====================================================
 * NeuraWeb - Système de Réservation avec Google Sheets
 * Version 3.0 - Encodage UTF-8 strict + Alias email forcé
 * =====================================================
 */

// Configuration
const CONFIG = {
  SHEET_NAME: 'Rendez-vous',
  EMAIL_ALIAS: 'contact@neuraweb.tech',
  ADMIN_EMAIL: 'contact@neuraweb.tech',
  TIME_ZONE: 'Europe/Paris',
  SLOTS_START: 9,
  SLOTS_END: 18,
  SLOTS_DURATION: 60
};

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    const action = e.parameter.action || 'getSlots';
    let result;
    
    switch(action) {
      case 'getSlots':
        result = getAvailableSlots();
        break;
      case 'book':
        result = bookSlot(e.parameter);
        break;
      case 'genererCreneaux':
        result = genererCreneaux();
        break;
      case 'test':
        result = { success: true, message: 'API fonctionnelle', timestamp: new Date().toISOString() };
        break;
      default:
        result = getAvailableSlots();
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function genererCreneaux() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (sheet) {
    ss.deleteSheet(sheet);
  }
  
  sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  sheet.appendRow(['Date', 'Heure', 'Statut', 'Client', 'Email', 'Telephone', 'WhatsApp', 'Entreprise', 'Service', 'Langue', 'DateReservation']);
  
  const headerRange = sheet.getRange(1, 1, 1, 11);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4F46E5');
  headerRange.setFontColor('#FFFFFF');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let rowCount = 1;
  
  for(let day = 1; day <= 30; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);
    
    if(date.getDay() === 0 || date.getDay() === 6) continue;
    
    const dateStr = formatDate(date);
    
    for(let hour = CONFIG.SLOTS_START; hour < CONFIG.SLOTS_END; hour++) {
      const timeStr = hour.toString().padStart(2, '0') + ':00';
      
      sheet.appendRow([
        dateStr,
        timeStr,
        'disponible',
        '', '', '', '', '', '', '', ''
      ]);
      rowCount++;
    }
  }
  
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 80);
  sheet.setColumnWidth(3, 100);
  sheet.setColumnWidth(4, 150);
  sheet.setColumnWidth(5, 200);
  sheet.setColumnWidth(6, 120);
  sheet.setColumnWidth(7, 120);
  sheet.setColumnWidth(8, 150);
  sheet.setColumnWidth(9, 150);
  sheet.setColumnWidth(10, 80);
  sheet.setColumnWidth(11, 150);
  
  return {
    success: true,
    message: (rowCount - 1) + ' créneaux générés',
    slotsCreated: rowCount - 1
  };
}

function getAvailableSlots() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  
  if(!sheet) {
    genererCreneaux();
    return getAvailableSlots();
  }
  
  const data = sheet.getDataRange().getValues();
  const slots = [];
  
  for(let i = 1; i < data.length; i++) {
    if(data[i][2] === 'disponible') {
      let heure = data[i][1];
      
      if(heure instanceof Date) {
        heure = heure.getHours().toString().padStart(2, '0') + ':' + 
                heure.getMinutes().toString().padStart(2, '0');
      }
      else if(typeof heure === 'number') {
        const totalMinutes = Math.round(heure * 24 * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        heure = hours.toString().padStart(2, '0') + ':' + 
                minutes.toString().padStart(2, '0');
      }
      else if(typeof heure === 'string') {
        heure = heure.trim();
        if(!/^\d{1,2}:\d{2}$/.test(heure)) {
          const match = heure.match(/(\d{1,2})[:hH](\d{2})?/);
          if(match) {
            heure = match[1].padStart(2, '0') + ':' + (match[2] || '00');
          }
        }
      }
      
      slots.push({
        date: data[i][0],
        heure: heure,
        row: i + 1
      });
    }
  }
  
  return {
    success: true,
    slots: slots,
    total: slots.length
  };
}

function bookSlot(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  
  if(!sheet) {
    return { success: false, error: 'Feuille non trouvée' };
  }
  
  const date = params.date;
  const heure = params.heure;
  const client = params.client || '';
  const email = params.email || '';
  const telephone = params.telephone || '';
  const whatsapp = params.whatsapp || '';
  const entreprise = params.entreprise || '';
  const service = params.service || '';
  const langue = params.langue || 'FR';
  
  if(!date || !heure) {
    return { success: false, error: 'Date et heure requises' };
  }
  
  const data = sheet.getDataRange().getValues();
  
  for(let i = 1; i < data.length; i++) {
    let rowDate = data[i][0];
    let rowHeure = data[i][1];
    
    if(rowDate instanceof Date) {
      rowDate = formatDate(rowDate);
    }
    
    if(rowHeure instanceof Date) {
      rowHeure = rowHeure.getHours().toString().padStart(2, '0') + ':' + 
                 rowHeure.getMinutes().toString().padStart(2, '0');
    } else if(typeof rowHeure === 'number') {
      const totalMinutes = Math.round(rowHeure * 24 * 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      rowHeure = hours.toString().padStart(2, '0') + ':' + 
                 minutes.toString().padStart(2, '0');
    }
    
    if(rowDate === date && rowHeure === heure && data[i][2] === 'disponible') {
      sheet.getRange(i + 1, 3).setValue('reserve');
      sheet.getRange(i + 1, 4).setValue(client);
      sheet.getRange(i + 1, 5).setValue(email);
      sheet.getRange(i + 1, 6).setValue(telephone);
      sheet.getRange(i + 1, 7).setValue(whatsapp);
      sheet.getRange(i + 1, 8).setValue(entreprise);
      sheet.getRange(i + 1, 9).setValue(service);
      sheet.getRange(i + 1, 10).setValue(langue);
      sheet.getRange(i + 1, 11).setValue(new Date());
      
      envoyerEmailsReservation({
        client, email, telephone, whatsapp, 
        entreprise, service, langue, date, heure
      });
      
      return {
        success: true,
        message: 'Réservation confirmée',
        reservation: { date, heure, client, email }
      };
    }
  }
  
  return { success: false, error: 'Créneau non disponible' };
}

function envoyerEmailsReservation(reservation) {
  envoyerEmailConfirmationClient(reservation);
  envoyerEmailNotificationAdmin(reservation);
}

function envoyerEmailConfirmationClient(reservation) {
  const { client, email, telephone, whatsapp, entreprise, service, langue, date, heure } = reservation;
  
  if(!email) return;
  
  const isFR = langue === 'FR';
  const isEN = langue === 'EN';
  
  let subject, htmlBody;
  
  if(isFR) {
    subject = 'Confirmation de votre rendez-vous - NeuraWeb';
    
    // Template HTML SANS émojis - utilise du texte uniquement
    htmlBody = '<!DOCTYPE html>' +
    '<html lang="fr">' +
    '<head>' +
    '<meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '<title>Confirmation de rendez-vous</title>' +
    '</head>' +
    '<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;background-color:#f3f4f6;">' +
    '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:20px 0;">' +
    '<tr><td align="center">' +
    '<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;max-width:600px;width:100%;">' +
    
    // Header
    '<tr><td style="background:linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%);padding:40px 30px;text-align:center;">' +
    '<h1 style="color:#ffffff;margin:0;font-size:32px;font-weight:700;">NeuraWeb</h1>' +
    '<p style="color:#e0e7ff;margin:12px 0 0 0;font-size:16px;">Confirmation de rendez-vous</p>' +
    '</td></tr>' +
    
    // Body
    '<tr><td style="padding:40px 30px;">' +
    '<p style="font-size:18px;color:#1f2937;margin:0 0 8px 0;font-weight:600;">Bonjour ' + (client || 'cher client') + ',</p>' +
    '<p style="font-size:16px;color:#4b5563;margin:0 0 32px 0;line-height:1.6;">Votre rendez-vous avec NeuraWeb est confirme !</p>' +
    
    // Info table
    '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border-radius:12px;border-left:4px solid #4F46E5;margin-bottom:32px;">' +
    '<tr><td style="padding:28px;">' +
    '<table width="100%" cellpadding="8" cellspacing="0">' +
    '<tr>' +
    '<td style="color:#6b7280;font-size:14px;font-weight:600;width:120px;">DATE</td>' +
    '<td style="color:#1f2937;font-size:16px;font-weight:700;">' + formatDateFR(date) + '</td>' +
    '</tr>' +
    '<tr>' +
    '<td style="color:#6b7280;font-size:14px;font-weight:600;">HEURE</td>' +
    '<td style="color:#1f2937;font-size:16px;font-weight:700;">' + heure + '</td>' +
    '</tr>' +
    '<tr>' +
    '<td style="color:#6b7280;font-size:14px;font-weight:600;">DUREE</td>' +
    '<td style="color:#1f2937;font-size:16px;font-weight:700;">30 minutes</td>' +
    '</tr>' +
    (whatsapp ? 
      '<tr><td style="color:#6b7280;font-size:14px;font-weight:600;">CONTACT</td><td style="color:#1f2937;font-size:16px;font-weight:700;">' + whatsapp + '</td></tr>' : 
      '<tr><td style="color:#6b7280;font-size:14px;font-weight:600;">CONTACT</td><td style="color:#6b7280;font-size:14px;">Non renseigne</td></tr>') +
    '</table>' +
    '</td></tr></table>' +
    
    '<p style="font-size:15px;color:#4b5563;margin:0 0 24px 0;line-height:1.6;">Nous vous appellerons a l\'heure convenue pour discuter de votre projet.</p>' +
    
    // CTA
    '<table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">' +
    '<tr><td align="center">' +
    '<p style="color:#6b7280;font-size:14px;margin:0 0 16px 0;font-weight:600;">Besoin de nous joindre avant le rendez-vous ?</p>' +
    (whatsapp ? '<a href="https://wa.me/' + whatsapp.replace(/[^0-9]/g, '') + '" style="display:inline-block;background-color:#25D366;color:#ffffff;padding:14px 28px;text-decoration:none;border-radius:8px;margin:8px;font-size:15px;font-weight:600;">Contacter sur WhatsApp</a>' : '') +
    '<a href="mailto:contact@neuraweb.tech" style="display:inline-block;background-color:#4F46E5;color:#ffffff;padding:14px 28px;text-decoration:none;border-radius:8px;margin:8px;font-size:15px;font-weight:600;">Envoyer un email</a>' +
    '</td></tr></table>' +
    
    // Reminder
    '<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">' +
    '<tr><td style="background-color:#ecfdf5;border-left:4px solid #10B981;padding:16px;border-radius:8px;">' +
    '<p style="color:#047857;font-size:14px;margin:0;line-height:1.5;">Vous recevrez un rappel 24h avant votre rendez-vous.</p>' +
    '</td></tr></table>' +
    
    '<p style="font-size:16px;color:#1f2937;margin:32px 0 0 0;font-weight:600;">A tres bientot !</p>' +
    '<p style="font-size:15px;color:#6b7280;margin:4px 0 0 0;">L\'equipe NeuraWeb</p>' +
    '</td></tr>' +
    
    // Footer
    '<tr><td style="background-color:#f9fafb;padding:32px 30px;text-align:center;border-top:1px solid #e5e7eb;">' +
    '<h3 style="color:#1f2937;font-size:18px;margin:0 0 8px 0;font-weight:700;">NeuraWeb</h3>' +
    '<p style="color:#6b7280;font-size:14px;margin:0 0 16px 0;">Solutions web innovantes et automatisation intelligente</p>' +
    '<p style="font-size:13px;margin:8px 0;"><a href="https://neuraweb.tech" style="color:#4F46E5;text-decoration:none;font-weight:600;">https://neuraweb.tech</a></p>' +
    '<p style="font-size:13px;margin:8px 0;"><a href="mailto:contact@neuraweb.tech" style="color:#4F46E5;text-decoration:none;font-weight:600;">contact@neuraweb.tech</a></p>' +
    '<p style="color:#9ca3af;font-size:12px;margin:16px 0 0 0;">&copy; ' + new Date().getFullYear() + ' NeuraWeb. Tous droits reserves.</p>' +
    '</td></tr>' +
    
    '</table></td></tr></table></body></html>';
    
  } else if(isEN) {
    subject = 'Appointment Confirmation - NeuraWeb';
    htmlBody = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>' +
    '<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;background-color:#f3f4f6;">' +
    '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:20px;">' +
    '<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;max-width:600px;">' +
    '<tr><td style="background:linear-gradient(135deg,#4F46E5,#7C3AED);padding:40px;text-align:center;">' +
    '<h1 style="color:#fff;margin:0;font-size:32px;">NeuraWeb</h1>' +
    '<p style="color:#e0e7ff;margin:12px 0 0;">Appointment Confirmation</p></td></tr>' +
    '<tr><td style="padding:40px;">' +
    '<p style="font-size:18px;color:#1f2937;margin:0 0 8px;font-weight:600;">Hello ' + (client || 'dear client') + ',</p>' +
    '<p style="font-size:16px;color:#4b5563;margin:0 0 24px;">Your appointment with NeuraWeb has been confirmed!</p>' +
    '<table width="100%" style="background-color:#f9fafb;border-left:4px solid #4F46E5;padding:20px;margin-bottom:24px;">' +
    '<tr><td style="color:#6b7280;padding:8px 0;width:100px;">DATE</td><td style="color:#1f2937;font-weight:700;padding:8px 0;">' + date + '</td></tr>' +
    '<tr><td style="color:#6b7280;padding:8px 0;">TIME</td><td style="color:#1f2937;font-weight:700;padding:8px 0;">' + heure + '</td></tr>' +
    '</table></td></tr></table></td></tr></table></body></html>';
    
  } else { // ES
    subject = 'Confirmacion de su cita - NeuraWeb';
    htmlBody = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>' +
    '<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;background-color:#f3f4f6;">' +
    '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:20px;">' +
    '<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;max-width:600px;">' +
    '<tr><td style="background:linear-gradient(135deg,#4F46E5,#7C3AED);padding:40px;text-align:center;">' +
    '<h1 style="color:#fff;margin:0;font-size:32px;">NeuraWeb</h1>' +
    '<p style="color:#e0e7ff;margin:12px 0 0;">Confirmacion de cita</p></td></tr>' +
    '<tr><td style="padding:40px;">' +
    '<p style="font-size:18px;color:#1f2937;margin:0 0 8px;font-weight:600;">Hola ' + (client || 'cliente') + ',</p>' +
    '<p style="font-size:16px;color:#4b5563;margin:0 0 24px;">Su cita con NeuraWeb ha sido confirmada!</p></td></tr>' +
    '</table></td></tr></table></body></html>';
  }
  
  // METHODE 1 : MailApp avec replyTo
  try {
    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody,
      name: 'NeuraWeb',
      replyTo: CONFIG.EMAIL_ALIAS
    });
    Logger.log('Email envoyé via MailApp à : ' + email);
  } catch(e) {
    Logger.log('Erreur MailApp : ' + e.toString());
    
    // FALLBACK : GmailApp en dernier recours
    try {
      GmailApp.sendEmail(email, subject, '', {
        htmlBody: htmlBody,
        name: 'NeuraWeb'
      });
      Logger.log('Email envoyé via GmailApp (fallback) à : ' + email);
    } catch(e2) {
      Logger.log('Erreur GmailApp : ' + e2.toString());
    }
  }
}

function envoyerEmailNotificationAdmin(reservation) {
  const { client, email, telephone, whatsapp, entreprise, service, langue, date, heure } = reservation;
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR');
  const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  
  const subject = 'Nouvelle reservation - ' + (client || 'Client') + ' le ' + date;
  
  const htmlBody = '<!DOCTYPE html>' +
  '<html lang="fr">' +
  '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>' +
  '<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;background-color:#f3f4f6;">' +
  '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:20px 0;">' +
  '<tr><td align="center">' +
  '<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;max-width:600px;">' +
  
  '<tr><td style="background:linear-gradient(135deg,#4F46E5,#7C3AED);padding:40px;text-align:center;">' +
  '<h1 style="color:#fff;margin:0;font-size:32px;">NeuraWeb</h1>' +
  '<p style="color:#e0e7ff;margin:12px 0 0;">Nouvelle Reservation</p>' +
  '</td></tr>' +
  
  '<tr><td style="padding:40px;">' +
  '<p style="font-size:16px;color:#1f2937;margin:0 0 28px;">Un nouveau rendez-vous vient d\'etre reserve sur le site.</p>' +
  
  '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border-left:4px solid #4F46E5;margin-bottom:24px;">' +
  '<tr><td style="padding:28px;">' +
  '<h3 style="color:#4F46E5;margin:0 0 20px;font-size:18px;">Informations Client</h3>' +
  '<table width="100%" cellpadding="8" cellspacing="0">' +
  '<tr><td style="color:#6b7280;font-size:14px;width:130px;">Nom</td><td style="color:#1f2937;font-size:15px;font-weight:600;">' + (client || 'Non renseigne') + '</td></tr>' +
  '<tr><td style="color:#6b7280;font-size:14px;">Email</td><td style="color:#1f2937;font-size:15px;">' + (email ? '<a href="mailto:' + email + '" style="color:#4F46E5;text-decoration:none;">' + email + '</a>' : 'Non renseigne') + '</td></tr>' +
  '<tr><td style="color:#6b7280;font-size:14px;">Telephone</td><td style="color:#1f2937;font-size:15px;">' + (telephone || 'Non renseigne') + '</td></tr>' +
  '<tr><td style="color:#6b7280;font-size:14px;">WhatsApp</td><td style="color:#1f2937;font-size:15px;">' + (whatsapp || 'Non renseigne') + '</td></tr>' +
  '<tr><td style="color:#6b7280;font-size:14px;">Entreprise</td><td style="color:#1f2937;font-size:15px;">' + (entreprise || 'Non renseigne') + '</td></tr>' +
  '<tr><td style="color:#6b7280;font-size:14px;">Service</td><td style="color:#1f2937;font-size:15px;">' + (service || 'Non renseigne') + '</td></tr>' +
  '<tr><td style="color:#6b7280;font-size:14px;">Langue</td><td style="color:#1f2937;font-size:15px;">' + langue + '</td></tr>' +
  '</table></td></tr></table>' +
  
  '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ecfdf5;border-left:4px solid #10B981;margin-bottom:24px;">' +
  '<tr><td style="padding:28px;">' +
  '<h3 style="color:#10B981;margin:0 0 20px;font-size:18px;">Details du Rendez-vous</h3>' +
  '<table width="100%" cellpadding="8" cellspacing="0">' +
  '<tr><td style="color:#047857;font-size:14px;width:130px;">Date</td><td style="color:#065f46;font-size:16px;font-weight:700;">' + formatDateFR(date) + '</td></tr>' +
  '<tr><td style="color:#047857;font-size:14px;">Heure</td><td style="color:#065f46;font-size:16px;font-weight:700;">' + heure + '</td></tr>' +
  '</table></td></tr></table>' +
  
  '<table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;"><tr><td align="center">' +
  '<p style="color:#6b7280;font-size:14px;margin:0 0 16px;">Actions rapides :</p>' +
  (whatsapp ? '<a href="https://wa.me/' + whatsapp.replace(/[^0-9]/g, '') + '" style="display:inline-block;background-color:#25D366;color:#fff;padding:14px 24px;text-decoration:none;border-radius:8px;margin:6px;font-size:14px;">Contacter sur WhatsApp</a>' : '') +
  (email ? '<a href="mailto:' + email + '" style="display:inline-block;background-color:#4F46E5;color:#fff;padding:14px 24px;text-decoration:none;border-radius:8px;margin:6px;font-size:14px;">Repondre par email</a>' : '') +
  '</td></tr></table>' +
  
  '</td></tr>' +
  
  '<tr><td style="background-color:#f9fafb;padding:24px;text-align:center;border-top:1px solid #e5e7eb;">' +
  '<p style="color:#9ca3af;font-size:13px;margin:0;">Reservation effectuee le ' + dateStr + ' a ' + timeStr + '</p>' +
  '</td></tr>' +
  
  '</table></td></tr></table></body></html>';

  try {
    MailApp.sendEmail({
      to: CONFIG.ADMIN_EMAIL,
      subject: subject,
      htmlBody: htmlBody,
      name: 'NeuraWeb - Notifications',
      replyTo: email || CONFIG.EMAIL_ALIAS
    });
    Logger.log('Email admin envoyé via MailApp');
  } catch(e) {
    Logger.log('Erreur email admin : ' + e.toString());
    GmailApp.sendEmail(CONFIG.ADMIN_EMAIL, subject, '', {
      htmlBody: htmlBody,
      name: 'NeuraWeb - Notifications'
    });
  }
}

function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return year + '-' + month + '-' + day;
}

function formatDateFR(dateStr) {
  const date = new Date(dateStr);
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formatted = date.toLocaleDateString('fr-FR', options);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function testEmail() {
  envoyerEmailConfirmationClient({
    client: 'Jean Test',
    email: 'san3neb@gmail.com',
    telephone: '+33612345678',
    whatsapp: '+33612345678',
    entreprise: 'Test Entreprise',
    service: 'Consultation Web',
    langue: 'FR',
    date: '2025-02-20',
    heure: '10:00'
  });
  return 'Email de test envoye !';
}

function verifierConfiguration() {
  const aliases = GmailApp.getAliases();
  Logger.log('=== VERIFICATION CONFIGURATION ===');
  Logger.log('Alias Gmail disponibles: ' + aliases.join(', '));
  Logger.log('Email alias configure: ' + CONFIG.EMAIL_ALIAS);
  Logger.log('Email admin: ' + CONFIG.ADMIN_EMAIL);
  
  return {
    aliases: aliases,
    emailAlias: CONFIG.EMAIL_ALIAS,
    emailAdmin: CONFIG.ADMIN_EMAIL
  };
}