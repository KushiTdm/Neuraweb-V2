// app/api/contact/route.ts

import { NextRequest, NextResponse } from 'next/server';

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

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`Google Script error: ${response.status}`);
    }

    const result = await response.json();

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi : ' + error.message },
      { status: 500 }
    );
  }
}
