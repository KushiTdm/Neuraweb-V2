// app/api/sante-quote/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email-service';
import { rateLimitRequest, isValidEmail, isHoneypotFilled } from '@/lib/rate-limit';

const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

const PACK_LABELS: Record<string, string> = {
  vitrine: 'Pack Vitrine Santé (990€ HT)',
  'pro-blog': 'Pack Vitrine Pro + Blog (1 490€ HT)',
  'pro-sante': 'Pack Pro Santé (4 490€ HT)',
  premium: 'Pack Premium Santé (8 900€ HT)',
};

const METIER_LABELS: Record<string, string> = {
  osteopathe: 'Ostéopathe',
  kine: 'Kinésithérapeute',
  infirmier: 'Infirmier(e)',
  'sage-femme': 'Sage-femme',
  autre: 'Autre profession santé',
};

export async function POST(request: NextRequest) {
  try {
    const limit = rateLimitRequest(request, 'sante-quote', { max: 5, windowMs: 60_000 });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Trop de demandes. Réessayez dans une minute.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter ?? 60) } }
      );
    }

    const body = await request.json();
    const { fullName, metier, ville, phone, email, pack, message } = body ?? {};

    // Honeypot : champ leurre rempli = bot → on acquitte sans rien traiter.
    if (isHoneypotFilled(body)) {
      return NextResponse.json({ ok: true });
    }

    if (!fullName || !email || !phone || !metier) {
      return NextResponse.json(
        { error: 'Champs requis manquants : fullName, email, phone, metier' },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Adresse email invalide' }, { status: 400 });
    }

    const metierLabel = METIER_LABELS[metier] ?? metier;
    const packLabel = pack ? PACK_LABELS[pack] ?? pack : 'À définir';

    const fullMessage =
      `[Devis Santé]\n` +
      `Métier : ${metierLabel}\n` +
      `Ville : ${ville || '—'}\n` +
      `Pack ciblé : ${packLabel}\n\n` +
      `Message :\n${message || '(aucun)'}`;

    const payload = {
      action: 'saveContact',
      name: fullName,
      email,
      phone,
      company: '',
      service: `Santé - ${packLabel}`,
      message: fullMessage,
      source: 'sante-page-quote',
      language: 'fr',
    };

    const tasks: Promise<unknown>[] = [];

    if (GOOGLE_SCRIPT_URL) {
      tasks.push(
        fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          redirect: 'follow',
        }).catch((err) => {
          console.warn('[sante-quote] Google Script error:', err);
        })
      );
    } else {
      console.warn('[sante-quote] NEXT_PUBLIC_GOOGLE_SCRIPT_URL not set, skipping sheet write');
    }

    tasks.push(
      sendContactEmail({
        name: fullName,
        email,
        subject: `Devis Santé - ${packLabel}`,
        message: fullMessage,
        language: 'fr',
      }).catch((err) => {
        console.warn('[sante-quote] Email error:', err);
      })
    );

    await Promise.all(tasks);

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('[sante-quote] error:', message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
