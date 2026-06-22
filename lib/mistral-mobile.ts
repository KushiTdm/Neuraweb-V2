// ============================================================
// lib/mistral-mobile.ts
// Appel Mistral pour l'app mobile. Utilise une clé DÉDIÉE
// (MISTRAL_API_KEY_MOBILE) distincte du chatbot du site, pour ne pas
// consommer le même crédit. Modèle gratuit `mistral-small-latest`.
// ============================================================

const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";
const MODEL = "mistral-small-latest";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export class MistralError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

/**
 * Envoie une complétion à Mistral et renvoie le texte de la réponse.
 * Lève MistralError (clé manquante → 503, erreur API → 429/502).
 */
export async function mistralChat(
  messages: ChatMessage[],
  opts: { maxTokens?: number; temperature?: number } = {},
): Promise<string> {
  const apiKey = process.env.MISTRAL_API_KEY_MOBILE;
  if (!apiKey) throw new MistralError("MISTRAL_API_KEY_MOBILE non configurée.", 503);

  const res = await fetch(MISTRAL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: opts.maxTokens ?? 800,
      temperature: opts.temperature ?? 0.6,
      stream: false,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[mistral-mobile] API error", res.status, detail.slice(0, 300));
    const status = res.status === 429 ? 429 : 502;
    throw new MistralError(
      res.status === 429 ? "Quota Mistral atteint, réessaie plus tard." : "Erreur de l'IA Mistral.",
      status,
    );
  }

  const json = await res.json();
  return json?.choices?.[0]?.message?.content?.trim() || "";
}
