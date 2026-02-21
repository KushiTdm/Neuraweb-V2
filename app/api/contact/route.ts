// app/api/contact/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email-service';

const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, budget, message, language } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants : name, email, message' },
        { status: 400 }
      );
    }

    // Construire le message avec le budget si fourni
    const fullMessage = budget
      ? `[Budget: ${budget}]\n\n${message}`
      : message;

    const payload = {
      action: 'saveContact',
      name,
      email,
      phone: '',
      company: '',
      service: subject || '',
      message: fullMessage,
      source: 'contact-form',
      language: language || 'fr',
    };

    // Sauvegarder dans Google Sheets (en parallèle avec l'envoi d'email)
    const googlePromise = fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    // Envoyer l'email via Resend
    const emailPromise = sendContactEmail({
      name,
      email,
      subject: subject || undefined,
      budget: budget || undefined,
      message,
      language: language || 'fr',
    });

    // Exécuter les deux en parallèle
    const [googleResponse, emailResult] = await Promise.all([googlePromise, emailPromise]);

    // Vérifier la réponse Google (non bloquant si l'email est OK)
    if (!googleResponse.ok) {
      console.warn(`Google Script warning: ${googleResponse.status}`);
    } else {
      const googleResult = await googleResponse.json();
      if (googleResult.error) {
        console.warn('Google Script warning:', googleResult.error);
      }
    }

    // Log le résultat de l'envoi d'email (non bloquant)
    if (!emailResult.success) {
      console.warn('Email sending warning:', emailResult.error);
    }

    // Retourner succès même si l'email échoue (le contact est sauvegardé)
    return NextResponse.json({ 
      success: true,
      emailSent: emailResult.success 
    });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi : ' + error.message },
      { status: 500 }
    );
  }
}
