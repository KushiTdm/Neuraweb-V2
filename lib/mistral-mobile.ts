// ============================================================
// lib/mistral-mobile.ts
// Appel Mistral pour l'app mobile. Utilise une clé DÉDIÉE
// (MISTRAL_API_KEY_MOBILE) distincte du chatbot du site, pour ne pas
// consommer le même crédit. Modèle gratuit `ministral-3b-latest`.
// ============================================================

const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";
const MODEL = "ministral-3b-latest";

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
  opts: {
    maxTokens?: number;
    temperature?: number;
    /** Modèle Mistral (défaut : `ministral-3b-latest`). */
    model?: string;
    /** Force une réponse JSON valide (`response_format: json_object`). */
    json?: boolean;
  } = {},
): Promise<string> {
  const apiKey = process.env.MISTRAL_API_KEY_MOBILE;
  if (!apiKey) throw new MistralError("MISTRAL_API_KEY_MOBILE non configurée.", 503);

  // Un seul nouvel essai : le palier gratuit renvoie de temps en temps un 429
  // ponctuel (limite par seconde) ou une génération interrompue en cours de route
  // (`finish_reason: "error"`, sortie tronquée) qui passent au second appel. Reste
  // sous le maxDuration des routes (30-60 s).
  const MAX_ATTEMPTS = 2;
  let lastError = new MistralError("Erreur de l'IA Mistral.", 502);

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const res = await fetch(MISTRAL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: opts.model ?? MODEL,
        messages,
        max_tokens: opts.maxTokens ?? 800,
        temperature: opts.temperature ?? 0.6,
        stream: false,
        ...(opts.json ? { response_format: { type: "json_object" } } : {}),
      }),
    });

    if (res.ok) {
      const json = await res.json();
      const choice = json?.choices?.[0];
      if (choice?.finish_reason !== "error") return choice?.message?.content?.trim() || "";
      console.error("[mistral-mobile] génération interrompue (finish_reason=error), tentative", attempt);
      lastError = new MistralError("Génération interrompue côté Mistral — réessaie.", 502);
    } else {
      const detail = await res.text().catch(() => "");
      console.error("[mistral-mobile] API error", res.status, detail.slice(0, 300));
      lastError = new MistralError(
        res.status === 429 ? "Quota Mistral atteint, réessaie plus tard." : "Erreur de l'IA Mistral.",
        res.status === 429 ? 429 : 502,
      );
      if (res.status !== 429 && res.status < 500) throw lastError;
    }

    if (attempt < MAX_ATTEMPTS) await new Promise((r) => setTimeout(r, 1200));
  }
  throw lastError;
}
