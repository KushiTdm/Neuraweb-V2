/**
 * =====================================================
 * NeuraWeb - Système de Réservation avec Google Sheets
 * Script corrigé pour l'encodage UTF-8 et l'alias email
 * =====================================================
 */

// Configuration
const CONFIG = {
  SHEET_NAME: 'Rendez-vous',
  EMAIL_ALIAS: 'contact@neuraweb.tech',
  ADMIN_EMAIL: 'benachouba.nacer@gmail.com',
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
    htmlBody = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head>' +
    '<body style="margin:0;padding:0;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;background-color:#f3f4f6;">' +
    '<div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">' +
    '<div style="background:linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%);padding:30px;text-align:center;">' +
    '<h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;">NeuraWeb</h1>' +
    '<p style="color:#e0e7ff;margin:10px 0 0 0;font-size:16px;">Confirmation de rendez-vous</p></div>' +
    '<div style="padding:40px 30px;">' +
    '<p style="font-size:18px;color:#1f2937;margin:0 0 20px 0;">Bonjour ' + (client || 'cher client') + ',</p>' +
    '<p style="font-size:16px;color:#4b5563;margin:0 0 30px 0;line-height:1.6;">Votre rendez-vous a été confirmé avec succès.</p>' +
    '<div style="background-color:#f9fafb;border-radius:8px;padding:25px;margin-bottom:30px;border-left:4px solid #4F46E5;">' +
    '<table style="width:100%;border-collapse:collapse;">' +
    '<tr><td style="padding:10px 0;color:#6b7280;font-size:14px;width:120px;">Date</td>' +
    '<td style="padding:10px 0;color:#1f2937;font-size:16px;font-weight:600;">' + formatDateFR(date) + '</td></tr>' +
    '<tr><td style="padding:10px 0;color:#6b7280;font-size:14px;">Heure</td>' +
    '<td style="padding:10px 0;color:#1f2937;font-size:16px;font-weight:600;">' + heure + '</td></tr>' +
    (service ? '<tr><td style="padding:10px 0;color:#6b7280;font-size:14px;">Service</td><td style="padding:10px 0;color:#1f2937;font-size:16px;font-weight:600;">' + service + '</td></tr>' : '') +
    '</table></div>' +
    '<div style="text-align:center;margin-top:30px;">' +
    '<a href="mailto:contact@neuraweb.tech" style="display:inline-block;background-color:#4F46E5;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:6px;margin:0 5px;font-size:14px;">Email</a>' +
    '<a href="https://wa.me/33600000000" style="display:inline-block;background-color:#25D366;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:6px;margin:0 5px;font-size:14px;">WhatsApp</a>' +
    '</div></div>' +
    '<div style="background-color:#f9fafb;padding:25px;text-align:center;border-top:1px solid #e5e7eb;">' +
    '<p style="color:#6b7280;font-size:14px;margin:0;"><strong>NeuraWeb</strong> - Solutions web innovantes</p>' +
    '<p style="color:#9ca3af;font-size:12px;margin:10px 0 0 0;">neuraweb.tech | contact@neuraweb.tech</p>' +
    '</div></div></body></html>';
  } else if(isEN) {
    subject = 'Appointment Confirmation - NeuraWeb';
    htmlBody = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head>' +
    '<body style="margin:0;padding:0;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;background-color:#f3f4f6;">' +
    '<div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">' +
    '<div style="background:linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%);padding:30px;text-align:center;">' +
    '<h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;">NeuraWeb</h1>' +
    '<p style="color:#e0e7ff;margin:10px 0 0 0;font-size:16px;">Appointment Confirmation</p></div>' +
    '<div style="padding:40px 30px;">' +
    '<p style="font-size:18px;color:#1f2937;margin:0 0 20px 0;">Hello ' + (client || 'dear client') + ',</p>' +
    '<p style="font-size:16px;color:#4b5563;margin:0 0 30px 0;line-height:1.6;">Your appointment has been successfully confirmed.</p>' +
    '<div style="background-color:#f9fafb;border-radius:8px;padding:25px;margin-bottom:30px;border-left:4px solid #4F46E5;">' +
    '<table style="width:100%;border-collapse:collapse;">' +
    '<tr><td style="padding:10px 0;color:#6b7280;font-size:14px;width:120px;">Date</td>' +
    '<td style="padding:10px 0;color:#1f2937;font-size:16px;font-weight:600;">' + date + '</td></tr>' +
    '<tr><td style="padding:10px 0;color:#6b7280;font-size:14px;">Time</td>' +
    '<td style="padding:10px 0;color:#1f2937;font-size:16px;font-weight:600;">' + heure + '</td></tr></table></div>' +
    '<div style="text-align:center;margin-top:30px;">' +
    '<a href="mailto:contact@neuraweb.tech" style="display:inline-block;background-color:#4F46E5;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:6px;margin:0 5px;font-size:14px;">Email</a>' +
    '<a href="https://wa.me/33600000000" style="display:inline-block;background-color:#25D366;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:6px;margin:0 5px;font-size:14px;">WhatsApp</a>' +
    '</div></div>' +
    '<div style="background-color:#f9fafb;padding:25px;text-align:center;border-top:1px solid #e5e7eb;">' +
    '<p style="color:#6b7280;font-size:14px;margin:0;"><strong>NeuraWeb</strong> - Innovative web solutions</p>' +
    '</div></div></body></html>';
  } else { // ES
    subject = 'Confirmacion de su cita - NeuraWeb';
    htmlBody = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head>' +
    '<body style="margin:0;padding:0;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;background-color:#f3f4f6;">' +
    '<div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">' +
    '<div style="background:linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%);padding:30px;text-align:center;">' +
    '<h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;">NeuraWeb</h1>' +
    '<p style="color:#e0e7ff;margin:10px 0 0 0;font-size:16px;">Confirmacion de cita</p></div>' +
    '<div style="padding:40px 30px;">' +
    '<p style="font-size:18px;color:#1f2937;margin:0 0 20px 0;">Hola ' + (client || 'cliente') + ',</p>' +
    '<p style="font-size:16px;color:#4b5563;margin:0 0 30px 0;line-height:1.6;">Su cita ha sido confirmada exitosamente.</p>' +
    '<div style="background-color:#f9fafb;border-radius:8px;padding:25px;margin-bottom:30px;border-left:4px solid #4F46E5;">' +
    '<table style="width:100%;border-collapse:collapse;">' +
    '<tr><td style="padding:10px 0;color:#6b7280;font-size:14px;width:120px;">Fecha</td>' +
    '<td style="padding:10px 0;color:#1f2937;font-size:16px;font-weight:600;">' + date + '</td></tr>' +
    '<tr><td style="padding:10px 0;color:#6b7280;font-size:14px;">Hora</td>' +
    '<td style="padding:10px 0;color:#1f2937;font-size:16px;font-weight:600;">' + heure + '</td></tr></table></div>' +
    '<div style="text-align:center;margin-top:30px;">' +
    '<a href="mailto:contact@neuraweb.tech" style="display:inline-block;background-color:#4F46E5;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:6px;margin:0 5px;font-size:14px;">Email</a>' +
    '<a href="https://wa.me/33600000000" style="display:inline-block;background-color:#25D366;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:6px;margin:0 5px;font-size:14px;">WhatsApp</a>' +
    '</div></div>' +
    '<div style="background-color:#f9fafb;padding:25px;text-align:center;border-top:1px solid #e5e7eb;">' +
    '<p style="color:#6b7280;font-size:14px;margin:0;"><strong>NeuraWeb</strong> - Soluciones web innovadoras</p>' +
    '</div></div></body></html>';
  }
  
  GmailApp.sendEmail(email, subject, '', {
    htmlBody: htmlBody,
    from: CONFIG.EMAIL_ALIAS,
    name: 'NeuraWeb'
  });
}

function envoyerEmailNotificationAdmin(reservation) {
  const { client, email, telephone, whatsapp, entreprise, service, langue, date, heure } = reservation;
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR');
  const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  
  const subject = 'Nouvelle reservation - ' + (client || 'Client') + ' le ' + date;
  
  const htmlBody = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head>' +
  '<body style="margin:0;padding:0;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;background-color:#f3f4f6;">' +
  '<div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">' +
  '<div style="background:linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%);padding:30px;text-align:center;">' +
  '<h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;">NeuraWeb</h1>' +
  '<p style="color:#e0e7ff;margin:10px 0 0 0;font-size:16px;">Nouvelle Reservation</p></div>' +
  '<div style="padding:40px 30px;">' +
  '<p style="font-size:16px;color:#1f2937;margin:0 0 25px 0;">Un nouveau rendez-vous vient d\'etre reserve sur le site.</p>' +
  '<div style="background-color:#f9fafb;border-radius:8px;padding:25px;margin-bottom:25px;border-left:4px solid #4F46E5;">' +
  '<h3 style="color:#4F46E5;margin:0 0 20px 0;font-size:18px;">Informations Client</h3>' +
  '<table style="width:100%;border-collapse:collapse;">' +
  '<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;width:120px;">Nom</td>' +
  '<td style="padding:8px 0;color:#1f2937;font-size:15px;font-weight:500;">' + (client || 'Non renseigne') + '</td></tr>' +
  '<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Email</td>' +
  '<td style="padding:8px 0;color:#1f2937;font-size:15px;font-weight:500;">' + (email ? '<a href="mailto:' + email + '" style="color:#4F46E5;">' + email + '</a>' : 'Non renseigne') + '</td></tr>' +
  '<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Telephone</td>' +
  '<td style="padding:8px 0;color:#1f2937;font-size:15px;font-weight:500;">' + (telephone || 'Non renseigne') + '</td></tr>' +
  '<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">WhatsApp</td>' +
  '<td style="padding:8px 0;color:#1f2937;font-size:15px;font-weight:500;">' + (whatsapp || 'Non renseigne') + '</td></tr>' +
  '<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Entreprise</td>' +
  '<td style="padding:8px 0;color:#1f2937;font-size:15px;font-weight:500;">' + (entreprise || 'Non renseigne') + '</td></tr>' +
  '<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Service</td>' +
  '<td style="padding:8px 0;color:#1f2937;font-size:15px;font-weight:500;">' + (service || 'Non renseigne') + '</td></tr>' +
  '<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Langue</td>' +
  '<td style="padding:8px 0;color:#1f2937;font-size:15px;font-weight:500;">' + langue + '</td></tr>' +
  '</table></div>' +
  '<div style="background-color:#ecfdf5;border-radius:8px;padding:25px;margin-bottom:25px;border-left:4px solid #10B981;">' +
  '<h3 style="color:#10B981;margin:0 0 20px 0;font-size:18px;">Details du Rendez-vous</h3>' +
  '<table style="width:100%;border-collapse:collapse;">' +
  '<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;width:120px;">Date</td>' +
  '<td style="padding:8px 0;color:#1f2937;font-size:15px;font-weight:500;">' + formatDateFR(date) + '</td></tr>' +
  '<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Heure</td>' +
  '<td style="padding:8px 0;color:#1f2937;font-size:15px;font-weight:500;">' + heure + '</td></tr>' +
  '</table></div>' +
  '<div style="text-align:center;margin-top:30px;">' +
  '<p style="color:#6b7280;font-size:14px;margin:0 0 15px 0;">Actions rapides :</p>' +
  (whatsapp ? '<a href="https://wa.me/' + whatsapp.replace(/[^0-9]/g, '') + '" style="display:inline-block;background-color:#25D366;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:6px;margin:0 5px;font-size:14px;">Contacter sur WhatsApp</a>' : '') +
  (email ? '<a href="mailto:' + email + '" style="display:inline-block;background-color:#4F46E5;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:6px;margin:0 5px;font-size:14px;">Repondre par email</a>' : '') +
  '</div></div>' +
  '<div style="background-color:#f9fafb;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">' +
  '<p style="color:#9ca3af;font-size:13px;margin:0;">Reservation effectuee le ' + dateStr + ' a ' + timeStr + '</p>' +
  '</div></div>' +
  '<div style="max-width:600px;margin:20px auto;text-align:center;">' +
  '<p style="color:#6b7280;font-size:14px;margin:0;"><strong>NeuraWeb</strong></p>' +
  '<p style="color:#9ca3af;font-size:12px;margin:5px 0 0 0;">Notification automatique du systeme de reservation</p>' +
  '<p style="color:#9ca3af;font-size:11px;margin:10px 0 0 0;">neuraweb.tech | contact@neuraweb.tech</p>' +
  '</div></body></html>';

  GmailApp.sendEmail(CONFIG.ADMIN_EMAIL, subject, '', {
    htmlBody: htmlBody,
    from: CONFIG.EMAIL_ALIAS,
    name: 'NeuraWeb',
    replyTo: email || CONFIG.EMAIL_ALIAS
  });
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
  return date.toLocaleDateString('fr-FR', options);
}

function testEmail() {
  envoyerEmailNotificationAdmin({
    client: 'Test Client',
    email: 'test@example.com',
    telephone: '+33600000000',
    whatsapp: '+33600000000',
    entreprise: 'Test Entreprise',
    service: 'Consultation',
    langue: 'FR',
    date: '2025-02-20',
    heure: '10:00'
  });
  return 'Email de test envoye a ' + CONFIG.ADMIN_EMAIL;
}

function verifierAliasGmail() {
  const aliases = GmailApp.getAliases();
  console.log('Alias disponibles:', aliases);
  return aliases;
}