// ============================================================
// lib/push.ts
// Notifications du cockpit vers le téléphone, app fermée.
// Les jetons FCM des appareils sont dans editorial.push_tokens (enregistrés
// par l'app via /api/mobile/push/register). sendPush les notifie tous et
// supprime ceux qu'Android a invalidés (app désinstallée).
// ============================================================

import { editorialDb } from '@/lib/mobile-api';
import { fcmConfigured, sendToToken, type PushMessage } from '@/lib/fcm';

export interface PushResult {
  envoyes: number;
  appareils: number;
  erreurs: string[];
}

export function pushConfigured(): boolean {
  return fcmConfigured();
}

export async function sendPush(msg: PushMessage): Promise<PushResult> {
  const result: PushResult = { envoyes: 0, appareils: 0, erreurs: [] };
  const db = editorialDb();
  const { data, error } = await db.from('push_tokens').select('token');
  if (error) {
    result.erreurs.push(`Lecture des appareils impossible : ${error.message}`);
    return result;
  }
  const tokens = (data ?? []).map((r) => String(r.token));
  result.appareils = tokens.length;
  if (tokens.length === 0) {
    result.erreurs.push('Aucun appareil enregistré : ouvre l\'app une fois (version avec notifications).');
    return result;
  }

  const dead: string[] = [];
  await Promise.all(
    tokens.map(async (t) => {
      try {
        const r = await sendToToken(t, msg);
        if (r.outcome === 'ok') result.envoyes++;
        else if (r.outcome === 'invalid_token') dead.push(t);
        else result.erreurs.push(r.detail ?? 'Erreur FCM');
      } catch (e) {
        result.erreurs.push(e instanceof Error ? e.message : String(e));
      }
    }),
  );
  if (dead.length) await db.from('push_tokens').delete().in('token', dead);
  return result;
}
