// ============================================================
// lib/email-imap.ts
// Lecture de la boîte contact@neuraweb.fr via IMAP (imapflow) et
// envoi via SMTP (nodemailer). Identifiants 100% côté serveur :
//   IMAP_HOST (mail.neuraweb.fr / mail76.lwspanel.com) IMAP_PORT (993, SSL)
//   SMTP_HOST (mail.neuraweb.fr / mail76.lwspanel.com) SMTP_PORT (465, SSL)
//   IMAP_USER / IMAP_PASSWORD (réutilisés pour SMTP sauf SMTP_USER/PASSWORD).
// ============================================================

import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import nodemailer from "nodemailer";

export interface EmailSummary {
  uid: number;
  from: string;
  fromName: string;
  subject: string;
  date: string | null;
  seen: boolean;
  preview: string;
}

export interface EmailDetail extends EmailSummary {
  to: string;
  text: string;
  html: string | null;
}

function imapConfigured(): boolean {
  return Boolean(process.env.IMAP_HOST && process.env.IMAP_USER && process.env.IMAP_PASSWORD);
}

function newClient(): ImapFlow {
  return new ImapFlow({
    host: process.env.IMAP_HOST!,
    port: parseInt(process.env.IMAP_PORT || "143", 10),
    // Port 143 → connexion claire puis STARTTLS (secure:false). 993 → secure:true.
    secure: process.env.IMAP_PORT === "993",
    auth: { user: process.env.IMAP_USER!, pass: process.env.IMAP_PASSWORD! },
    logger: false,
    tls: { rejectUnauthorized: false },
  });
}

function addr(a: any): { text: string; name: string } {
  const first = a?.value?.[0] || a?.[0];
  if (!first) return { text: "", name: "" };
  return { text: first.address || "", name: first.name || "" };
}

/** Liste les `limit` derniers e-mails de l'INBOX (le plus récent d'abord). */
export async function listEmails(limit = 30): Promise<EmailSummary[]> {
  if (!imapConfigured()) return [];
  const client = newClient();
  await client.connect();
  const out: EmailSummary[] = [];
  const lock = await client.getMailboxLock("INBOX");
  try {
    const mailbox: any = client.mailbox;
    const total = mailbox?.exists ?? 0;
    if (total === 0) return [];
    const start = Math.max(1, total - limit + 1);

    for await (const msg of client.fetch(`${start}:*`, {
      uid: true,
      envelope: true,
      flags: true,
      bodyParts: ["text"],
    })) {
      const env = msg.envelope;
      const from = addr(env?.from);
      const previewBuf = (msg.bodyParts as Map<string, Buffer> | undefined)?.get("text");
      const preview = previewBuf ? previewBuf.toString("utf8").replace(/\s+/g, " ").trim().slice(0, 160) : "";
      out.push({
        uid: msg.uid,
        from: from.text,
        fromName: from.name,
        subject: env?.subject || "(sans objet)",
        date: env?.date ? new Date(env.date).toISOString() : null,
        seen: msg.flags?.has("\\Seen") ?? false,
        preview,
      });
    }
  } finally {
    lock.release();
    await client.logout().catch(() => {});
  }
  return out.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

/** Récupère le contenu complet d'un e-mail par UID. */
export async function getEmail(uid: number): Promise<EmailDetail | null> {
  if (!imapConfigured()) return null;
  const client = newClient();
  await client.connect();
  const lock = await client.getMailboxLock("INBOX");
  try {
    const msg = await client.fetchOne(String(uid), { uid: true, envelope: true, flags: true, source: true }, { uid: true });
    if (!msg || !msg.source) return null;
    const parsed = await simpleParser(msg.source as Buffer);
    const env = msg.envelope;
    const from = addr(env?.from);
    return {
      uid,
      from: from.text,
      fromName: from.name,
      to: parsed.to ? (Array.isArray(parsed.to) ? parsed.to.map((t: any) => t.text).join(", ") : parsed.to.text) : "",
      subject: env?.subject || parsed.subject || "(sans objet)",
      date: env?.date ? new Date(env.date).toISOString() : parsed.date?.toISOString() || null,
      seen: msg.flags?.has("\\Seen") ?? false,
      preview: (parsed.text || "").replace(/\s+/g, " ").trim().slice(0, 160),
      text: parsed.text || "",
      html: typeof parsed.html === "string" ? parsed.html : null,
    };
  } finally {
    lock.release();
    await client.logout().catch(() => {});
  }
}

/** Envoie un e-mail via SMTP (587 STARTTLS). */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  text: string;
  inReplyTo?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const host = process.env.SMTP_HOST || process.env.IMAP_HOST;
  const user = process.env.SMTP_USER || process.env.IMAP_USER;
  const pass = process.env.SMTP_PASSWORD || process.env.IMAP_PASSWORD;
  if (!host || !user || !pass) return { ok: false, error: "SMTP non configuré." };

  const transporter = nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_PORT === "465",
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });

  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || user,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      ...(opts.inReplyTo ? { inReplyTo: opts.inReplyTo, references: opts.inReplyTo } : {}),
    });
    return { ok: true };
  } catch (e: any) {
    console.error("[email-imap] envoi SMTP échoué:", e?.message);
    return { ok: false, error: "Envoi impossible." };
  }
}
