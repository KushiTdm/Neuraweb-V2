// ============================================================
// lib/fcm.ts
// Envoi de notifications push Firebase Cloud Messaging (API HTTP v1), sans
// dépendance : JWT RS256 signé avec le module crypto de Node, échangé contre
// un access token OAuth2 (valable 1 h, gardé en mémoire).
//
// Variable (Vercel) : FIREBASE_SERVICE_ACCOUNT_JSON — le contenu du fichier
// de clé de compte de service (JSON brut, ou encodé en base64).
// Gratuit : FCM n'est pas facturé, quel que soit le volume.
// ============================================================

import { createSign } from 'crypto';

const SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

interface ServiceAccount {
  project_id: string;
  client_email: string;
  private_key: string;
}

let cachedAccount: ServiceAccount | null | undefined;
let cachedToken: { value: string; expiresAt: number } | null = null;

function loadServiceAccount(): ServiceAccount | null {
  if (cachedAccount !== undefined) return cachedAccount;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) return (cachedAccount = null);
  try {
    const text = raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
    const j = JSON.parse(text) as Partial<ServiceAccount>;
    if (!j.project_id || !j.client_email || !j.private_key) return (cachedAccount = null);
    return (cachedAccount = {
      project_id: j.project_id,
      client_email: j.client_email,
      // Une clé collée dans un champ d'environnement perd parfois ses vrais retours à la ligne.
      private_key: j.private_key.replace(/\\n/g, '\n'),
    });
  } catch {
    return (cachedAccount = null);
  }
}

export function fcmConfigured(): boolean {
  return loadServiceAccount() !== null;
}

const b64url = (b: Buffer | string) => Buffer.from(b).toString('base64url');

async function accessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt - 60 > now) return cachedToken.value;

  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = b64url(
    JSON.stringify({ iss: sa.client_email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }),
  );
  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${claims}`);
  const jwt = `${header}.${claims}.${b64url(signer.sign(sa.private_key))}`;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
    signal: AbortSignal.timeout(15_000),
  });
  const body = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error_description?: string };
  if (!res.ok || !body.access_token) {
    throw new Error(`Google a refusé la clé Firebase : ${body.error_description ?? `HTTP ${res.status}`}.`);
  }
  cachedToken = { value: body.access_token, expiresAt: now + (body.expires_in ?? 3600) };
  return body.access_token;
}

export interface PushMessage {
  title: string;
  body: string;
  /** Canal Android (créé par l'app) : cockpit | leads | security | campagne. */
  channel?: string;
  /** Même tag = la notification en remplace une autre (anti-doublon avec les notifications locales de l'app). */
  tag?: string;
  /** Données libres (valeurs converties en texte). */
  data?: Record<string, string | number | null | undefined>;
}

export type PushOutcome = 'ok' | 'invalid_token' | 'error';

/** Envoie un message à un appareil. `invalid_token` = jeton à supprimer. */
export async function sendToToken(token: string, msg: PushMessage): Promise<{ outcome: PushOutcome; detail?: string }> {
  const sa = loadServiceAccount();
  if (!sa) return { outcome: 'error', detail: 'FIREBASE_SERVICE_ACCOUNT_JSON absent ou illisible.' };
  const bearer = await accessToken(sa);

  const data: Record<string, string> = {};
  for (const [k, v] of Object.entries(msg.data ?? {})) if (v !== null && v !== undefined) data[k] = String(v);

  const res = await fetch(`https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${bearer}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: {
        token,
        notification: { title: msg.title, body: msg.body },
        data,
        android: {
          priority: 'HIGH',
          notification: {
            channel_id: msg.channel ?? 'cockpit',
            ...(msg.tag ? { tag: msg.tag } : {}),
          },
        },
      },
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (res.ok) return { outcome: 'ok' };

  const err = (await res.json().catch(() => ({}))) as { error?: { status?: string; message?: string } };
  const status = err.error?.status ?? '';
  if (status === 'UNREGISTERED' || status === 'NOT_FOUND' || status === 'INVALID_ARGUMENT') {
    // INVALID_ARGUMENT couvre aussi un message mal formé : on ne supprime que si le jeton est en cause.
    if (status !== 'INVALID_ARGUMENT' || /registration token/i.test(err.error?.message ?? '')) {
      return { outcome: 'invalid_token', detail: status };
    }
  }
  return { outcome: 'error', detail: `${status || `HTTP ${res.status}`} ${err.error?.message ?? ''}`.trim() };
}
