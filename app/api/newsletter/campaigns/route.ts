// app/api/newsletter/campaigns/route.ts
//
// POST → appelée par n8n juste après la publication d'un article (commit
// GitHub + redeploy Vercel). Crée une campagne `pending_review` — N'ENVOIE
// AUCUN EMAIL. L'envoi nécessite une validation explicite depuis l'app
// mobile (approbation immédiate ou programmation), voir
// app/api/mobile/newsletter/campaigns/[id]/route.ts.
//
// Protégée par le même secret partagé que l'ancien endpoint /notify
// (x-webhook-secret / NEWSLETTER_NOTIFY_SECRET).

import { NextRequest, NextResponse } from 'next/server';
import { createCampaignFromPost, SUPPORTED_LANGUAGES, type CampaignLang } from '@/lib/newsletter-campaigns';

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.NEWSLETTER_NOTIFY_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'NEWSLETTER_NOTIFY_SECRET non configuré.' }, { status: 503 });
    }
    if (request.headers.get('x-webhook-secret') !== secret) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
    }

    const { slug, lang } = await request.json();
    if (!slug || !SUPPORTED_LANGUAGES.includes(lang)) {
      return NextResponse.json({ error: 'slug et lang (fr|en|es) requis.' }, { status: 400 });
    }

    const result = await createCampaignFromPost(slug, lang as CampaignLang);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }
    if (result.alreadyExists) {
      return NextResponse.json({ success: true, alreadyExists: true });
    }

    return NextResponse.json({ success: true, campaign: result.campaign });
  } catch (error: any) {
    console.error('Newsletter campaign creation error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la campagne : ' + error.message },
      { status: 500 }
    );
  }
}
