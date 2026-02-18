/**
 * NeuraWeb - Script complet sans emojis avec GmailApp uniquement
 */

const CONFIG = {
  SHEET_NAME: 'Rendez-vous',
  EMAIL_ALIAS: 'contact@neuraweb.tech',
  ADMIN_EMAIL: 'contact@neuraweb.tech',
  SLOTS_START: 9,
  SLOTS_END: 18
};

function doGet(e) { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

function handleRequest(e) {
  try {
    const action = e.parameter.action || 'getSlots';
    let result;
    
    if (action === 'getSlots') result = getAvailableSlots();
    else if (action === 'book') result = bookSlot(e.parameter);
    else if (action === 'genererCreneaux') result = genererCreneaux();
    else if (action === 'test') result = { success: true, message: 'API OK', time: new Date().toISOString() };
    else result = getAvailableSlots();
    
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function genererCreneaux() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (sheet) ss.deleteSheet(sheet);
  
  sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  sheet.appendRow(['Date', 'Heure', 'Statut', 'Client', 'Email', 'Telephone', 'WhatsApp', 'Entreprise', 'Service', 'Langue', 'DateReservation']);
  sheet.getRange(1, 1, 1, 11).setFontWeight('bold').setBackground('#4F46E5').setFontColor('#FFFFFF');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let count = 1;
  
  for (let d = 1; d <= 30; d++) {
    const date = new Date(today);
    date.setDate(date.getDate() + d);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    const dateStr = formatDate(date);
    for (let h = CONFIG.SLOTS_START; h < CONFIG.SLOTS_END; h++) {
      sheet.appendRow([dateStr, h.toString().padStart(2, '0') + ':00', 'disponible', '', '', '', '', '', '', '', '']);
      count++;
    }
  }
  return { success: true, message: (count - 1) + ' creneaux generes' };
}

function getAvailableSlots() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) { genererCreneaux(); return getAvailableSlots(); }
  
  const data = sheet.getDataRange().getValues();
  const slots = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] !== 'disponible') continue;
    
    let heure = data[i][1];
    if (heure instanceof Date) heure = heure.getHours().toString().padStart(2, '0') + ':' + heure.getMinutes().toString().padStart(2, '0');
    else if (typeof heure === 'number') {
      const mins = Math.round(heure * 24 * 60);
      heure = Math.floor(mins / 60).toString().padStart(2, '0') + ':' + (mins % 60).toString().padStart(2, '0');
    }
    else if (typeof heure === 'string') {
      heure = heure.trim();
      if (!/^\d{1,2}:\d{2}$/.test(heure)) {
        const m = heure.match(/(\d{1,2})[:hH](\d{2})?/);
        if (m) heure = m[1].padStart(2, '0') + ':' + (m[2] || '00');
      }
    }
    
    slots.push({ date: data[i][0], heure: heure, row: i + 1 });
  }
  return { success: true, slots: slots, total: slots.length };
}

function bookSlot(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) return { success: false, error: 'Feuille non trouvee' };
  
  const date = params.date;
  const heure = params.heure;
  if (!date || !heure) return { success: false, error: 'Date et heure requises' };
  
  const client = params.client || '';
  const email = params.email || '';
  const telephone = params.telephone || '';
  const whatsapp = params.whatsapp || '';
  const entreprise = params.entreprise || '';
  const service = params.service || '';
  const langue = params.langue || 'FR';
  
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    let rowDate = data[i][0];
    let rowHeure = data[i][1];
    
    if (rowDate instanceof Date) rowDate = formatDate(rowDate);
    if (rowHeure instanceof Date) rowHeure = rowHeure.getHours().toString().padStart(2, '0') + ':' + rowHeure.getMinutes().toString().padStart(2, '0');
    else if (typeof rowHeure === 'number') {
      const mins = Math.round(rowHeure * 24 * 60);
      rowHeure = Math.floor(mins / 60).toString().padStart(2, '0') + ':' + (mins % 60).toString().padStart(2, '0');
    }
    
    if (rowDate === date && rowHeure === heure && data[i][2] === 'disponible') {
      sheet.getRange(i + 1, 3).setValue('reserve');
      sheet.getRange(i + 1, 4).setValue(client);
      sheet.getRange(i + 1, 5).setValue(email);
      sheet.getRange(i + 1, 6).setValue(telephone);
      sheet.getRange(i + 1, 7).setValue(whatsapp);
      sheet.getRange(i + 1, 8).setValue(entreprise);
      sheet.getRange(i + 1, 9).setValue(service);
      sheet.getRange(i + 1, 10).setValue(langue);
      sheet.getRange(i + 1, 11).setValue(new Date());
      
      sendEmails({ client, email, telephone, whatsapp, entreprise, service, langue, date, heure });
      
      return { success: true, message: 'Reservation confirmee' };
    }
  }
  return { success: false, error: 'Creneau non disponible' };
}

function sendEmails(resa) {
  sendClientEmail(resa);
  sendAdminEmail(resa);
}

function sendClientEmail(resa) {
  const { client, email, langue, date, heure } = resa;
  if (!email) return;
  
  const isFR = langue === 'FR';
  const isEN = langue === 'EN';
  
  let subject, body;
  
  if (isFR) {
    subject = 'Confirmation de votre rendez-vous - NeuraWeb';
    body = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f3f4f6;">' +
    '<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">' +
    '<div style="background:linear-gradient(135deg,#4F46E5,#7C3AED);padding:40px;text-align:center;">' +
    '<h1 style="color:#fff;margin:0;font-size:28px;">NeuraWeb</h1>' +
    '<p style="color:#e0e7ff;margin:10px 0 0;font-size:16px;">Confirmation de rendez-vous</p></div>' +
    '<div style="padding:40px 30px;">' +
    '<p style="font-size:18px;color:#1f2937;margin:0 0 24px;">Bonjour ' + (client || 'cher client') + ',</p>' +
    '<p style="font-size:16px;color:#4b5563;margin:0 0 30px;">Votre rendez-vous est confirme. Voici les details :</p>' +
    '<div style="background:#f9fafb;border-left:4px solid #4F46E5;padding:24px;border-radius:8px;margin-bottom:24px;">' +
    '<p style="margin:0 0 12px;color:#6b7280;font-size:14px;"><strong>DATE</strong></p>' +
    '<p style="margin:0 0 16px;color:#1f2937;font-size:18px;font-weight:600;">' + formatDateFR(date) + '</p>' +
    '<p style="margin:0 0 12px;color:#6b7280;font-size:14px;"><strong>HEURE</strong></p>' +
    '<p style="margin:0 0 16px;color:#1f2937;font-size:18px;font-weight:600;">' + heure + '</p>' +
    '<p style="margin:0 0 12px;color:#6b7280;font-size:14px;"><strong>DUREE</strong></p>' +
    '<p style="margin:0;color:#1f2937;font-size:18px;font-weight:600;">30 minutes</p></div>' +
    '<p style="font-size:15px;color:#4b5563;margin:0 0 24px;">Nous vous appellerons a l\'heure convenue.</p>' +
    '<div style="text-align:center;margin:32px 0;">' +
    '<a href="mailto:contact@neuraweb.tech" style="display:inline-block;background:#4F46E5;color:#fff;padding:14px 28px;text-decoration:none;border-radius:8px;margin:4px;">Email</a>' +
    '<a href="https://wa.me/33749775654" style="display:inline-block;background:#25D366;color:#fff;padding:14px 28px;text-decoration:none;border-radius:8px;margin:4px;">WhatsApp</a></div>' +
    '<p style="font-size:16px;color:#1f2937;margin:32px 0 0;font-weight:600;">A bientot !<br>L\'equipe NeuraWeb</p></div>' +
    '<div style="background:#f9fafb;padding:24px;text-align:center;border-top:1px solid #e5e7eb;">' +
    '<p style="color:#6b7280;font-size:14px;margin:0;"><strong>NeuraWeb</strong> - Solutions web innovantes</p>' +
    '<p style="color:#9ca3af;font-size:12px;margin:8px 0 0;">neuraweb.tech | contact@neuraweb.tech</p></div></div></body></html>';
  }
  else if (isEN) {
    subject = 'Appointment Confirmation - NeuraWeb';
    body = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f3f4f6;">' +
    '<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">' +
    '<div style="background:linear-gradient(135deg,#4F46E5,#7C3AED);padding:40px;text-align:center;">' +
    '<h1 style="color:#fff;margin:0;font-size:28px;">NeuraWeb</h1>' +
    '<p style="color:#e0e7ff;margin:10px 0 0;font-size:16px;">Appointment Confirmation</p></div>' +
    '<div style="padding:40px 30px;">' +
    '<p style="font-size:18px;color:#1f2937;margin:0 0 24px;">Hello ' + (client || 'dear client') + ',</p>' +
    '<p style="font-size:16px;color:#4b5563;margin:0 0 24px;">Your appointment is confirmed!</p>' +
    '<div style="background:#f9fafb;border-left:4px solid #4F46E5;padding:24px;border-radius:8px;">' +
    '<p style="margin:0 0 8px;color:#6b7280;font-size:14px;"><strong>DATE</strong></p>' +
    '<p style="margin:0 0 16px;color:#1f2937;font-size:18px;font-weight:600;">' + date + '</p>' +
    '<p style="margin:0 0 8px;color:#6b7280;font-size:14px;"><strong>TIME</strong></p>' +
    '<p style="margin:0;color:#1f2937;font-size:18px;font-weight:600;">' + heure + '</p></div></div>' +
    '<div style="background:#f9fafb;padding:24px;text-align:center;border-top:1px solid #e5e7eb;">' +
    '<p style="color:#6b7280;font-size:14px;margin:0;">neuraweb.tech | contact@neuraweb.tech</p></div></div></body></html>';
  }
  else {
    subject = 'Confirmacion de su cita - NeuraWeb';
    body = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f3f4f6;">' +
    '<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">' +
    '<div style="background:linear-gradient(135deg,#4F46E5,#7C3AED);padding:40px;text-align:center;">' +
    '<h1 style="color:#fff;margin:0;font-size:28px;">NeuraWeb</h1>' +
    '<p style="color:#e0e7ff;margin:10px 0 0;font-size:16px;">Confirmacion de cita</p></div>' +
    '<div style="padding:40px 30px;">' +
    '<p style="font-size:18px;color:#1f2937;margin:0 0 24px;">Hola ' + (client || 'cliente') + ',</p>' +
    '<p style="font-size:16px;color:#4b5563;margin:0 0 24px;">Su cita esta confirmada!</p>' +
    '<div style="background:#f9fafb;border-left:4px solid #4F46E5;padding:24px;border-radius:8px;">' +
    '<p style="margin:0 0 8px;color:#6b7280;font-size:14px;"><strong>FECHA</strong></p>' +
    '<p style="margin:0 0 16px;color:#1f2937;font-size:18px;font-weight:600;">' + date + '</p>' +
    '<p style="margin:0 0 8px;color:#6b7280;font-size:14px;"><strong>HORA</strong></p>' +
    '<p style="margin:0;color:#1f2937;font-size:18px;font-weight:600;">' + heure + '</p></div></div>' +
    '<div style="background:#f9fafb;padding:24px;text-align:center;border-top:1px solid #e5e7eb;">' +
    '<p style="color:#6b7280;font-size:14px;margin:0;">neuraweb.tech | contact@neuraweb.tech</p></div></div></body></html>';
  }
  
  // UNIQUEMENT GmailApp avec from
  GmailApp.sendEmail(email, subject, '', {
    htmlBody: body,
    from: CONFIG.EMAIL_ALIAS,
    name: 'NeuraWeb'
  });
}

function sendAdminEmail(resa) {
  const { client, email, telephone, whatsapp, entreprise, service, langue, date, heure } = resa;
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR');
  const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  
  const subject = 'Nouvelle reservation - ' + (client || 'Client') + ' le ' + date;
  
  const body = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f3f4f6;">' +
  '<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">' +
  '<div style="background:linear-gradient(135deg,#4F46E5,#7C3AED);padding:40px;text-align:center;">' +
  '<h1 style="color:#fff;margin:0;font-size:28px;">NeuraWeb</h1>' +
  '<p style="color:#e0e7ff;margin:10px 0 0;font-size:16px;">Nouvelle Reservation</p></div>' +
  '<div style="padding:40px 30px;">' +
  '<p style="font-size:16px;color:#1f2937;margin:0 0 24px;">Un nouveau rendez-vous a ete reserve.</p>' +
  '<div style="background:#f9fafb;border-left:4px solid #4F46E5;padding:24px;border-radius:8px;margin-bottom:20px;">' +
  '<h3 style="color:#4F46E5;margin:0 0 16px;font-size:16px;">Informations Client</h3>' +
  '<p style="margin:0 0 8px;color:#6b7280;font-size:14px;">Nom: <strong style="color:#1f2937;">' + (client || 'Non renseigne') + '</strong></p>' +
  '<p style="margin:0 0 8px;color:#6b7280;font-size:14px;">Email: ' + (email ? '<a href="mailto:' + email + '" style="color:#4F46E5;">' + email + '</a>' : 'Non renseigne') + '</p>' +
  '<p style="margin:0 0 8px;color:#6b7280;font-size:14px;">Telephone: <strong style="color:#1f2937;">' + (telephone || 'Non renseigne') + '</strong></p>' +
  '<p style="margin:0 0 8px;color:#6b7280;font-size:14px;">WhatsApp: <strong style="color:#1f2937;">' + (whatsapp || 'Non renseigne') + '</strong></p>' +
  '<p style="margin:0 0 8px;color:#6b7280;font-size:14px;">Entreprise: <strong style="color:#1f2937;">' + (entreprise || 'Non renseigne') + '</strong></p>' +
  '<p style="margin:0 0 8px;color:#6b7280;font-size:14px;">Service: <strong style="color:#1f2937;">' + (service || 'Non renseigne') + '</strong></p>' +
  '<p style="margin:0;color:#6b7280;font-size:14px;">Langue: <strong style="color:#1f2937;">' + langue + '</strong></p></div>' +
  '<div style="background:#ecfdf5;border-left:4px solid #10B981;padding:24px;border-radius:8px;margin-bottom:20px;">' +
  '<h3 style="color:#10B981;margin:0 0 16px;font-size:16px;">Details du RDV</h3>' +
  '<p style="margin:0 0 8px;color:#047857;font-size:14px;">Date: <strong style="color:#065f46;font-size:16px;">' + formatDateFR(date) + '</strong></p>' +
  '<p style="margin:0;color:#047857;font-size:14px;">Heure: <strong style="color:#065f46;font-size:16px;">' + heure + '</strong></p></div>' +
  '<div style="text-align:center;margin:24px 0;">' +
  (whatsapp ? '<a href="https://wa.me/' + whatsapp.replace(/[^0-9]/g, '') + '" style="display:inline-block;background:#25D366;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;margin:4px;">WhatsApp</a>' : '') +
  (email ? '<a href="mailto:' + email + '" style="display:inline-block;background:#4F46E5;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;margin:4px;">Email</a>' : '') +
  '</div></div>' +
  '<div style="background:#f9fafb;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">' +
  '<p style="color:#9ca3af;font-size:13px;margin:0;">Le ' + dateStr + ' a ' + timeStr + '</p></div></div></body></html>';
  
  // UNIQUEMENT GmailApp avec from
  GmailApp.sendEmail(CONFIG.ADMIN_EMAIL, subject, '', {
    htmlBody: body,
    from: CONFIG.EMAIL_ALIAS,
    name: 'NeuraWeb',
    replyTo: email || CONFIG.EMAIL_ALIAS
  });
}

function formatDate(d) {
  const date = new Date(d);
  return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
}

function formatDateFR(d) {
  const date = new Date(d);
  const s = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function testEmail() {
  sendClientEmail({
    client: 'Test',
    email: 'san3neb@gmail.com',
    telephone: '',
    whatsapp: '',
    entreprise: '',
    service: '',
    langue: 'FR',
    date: '2025-02-20',
    heure: '10:00'
  });
  return 'Email envoye';
}

function checkAliases() {
  const a = GmailApp.getAliases();
  Logger.log('Alias: ' + a.join(', '));
  return a;
}