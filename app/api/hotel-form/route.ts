// app/api/hotel-form/route.ts
// API pour générer des liens uniques et soumettre les formulaires hôtel

import { NextRequest, NextResponse } from 'next/server';
import { sendHotelTokenEmail, sendHotelFormConfirmationEmail, sendHotelFormAdminNotification } from '@/lib/email-service';

const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL!;

// Générer un token unique
function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = 'HOTEL-';
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// GET - Vérifier la validité d'un token
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token requis' }, { status: 400 });
  }

  try {
    // Vérifier le token via Google Apps Script
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=verifyHotelToken&token=${token}`, {
      method: 'GET',
      redirect: 'follow',
    });

    const result = await response.json();

    if (result.error) {
      return NextResponse.json({ valid: false, error: result.error }, { status: 404 });
    }

    return NextResponse.json({ 
      valid: true, 
      hotelName: result.hotelName,
      email: result.email 
    });
  } catch (error: any) {
    console.error('Erreur vérification token:', error);
    return NextResponse.json({ valid: false, error: error.message }, { status: 500 });
  }
}

// POST - Créer un nouveau token ou soumettre le formulaire
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'createToken') {
      // Créer un nouveau token pour un établissement
      const { hotelName, email, contactName, language } = body;

      if (!hotelName || !email) {
        return NextResponse.json(
          { error: 'Nom de l\'hôtel et email sont requis' },
          { status: 400 }
        );
      }

      const token = generateToken();
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://neuraweb.tech';
      const formUrl = `${baseUrl}/fr/hotel-form?token=${token}`;

      const payload = {
        action: 'createHotelToken',
        token,
        hotelName,
        email,
        contactName: contactName || '',
        language: language || 'fr',
        formUrl,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        redirect: 'follow',
      });

      const result = await response.json();

      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      // Envoyer l'email via Resend
      try {
        await sendHotelTokenEmail({
          token,
          hotelName,
          email,
          contactName: contactName || undefined,
          formUrl,
          language: language || 'fr',
        });
      } catch (emailError: any) {
        console.error('Erreur envoi email token:', emailError);
        // Ne pas échouer si l'email échoue
      }

      return NextResponse.json({ 
        success: true, 
        token,
        formUrl,
        message: 'Lien généré avec succès' 
      });
    }

    if (action === 'submitForm') {
      // Soumettre le formulaire complet
      const { token, formData, pricing, language } = body;

      if (!formData || !formData.nom || !formData.email) {
        return NextResponse.json(
          { error: 'Données du formulaire incomplètes' },
          { status: 400 }
        );
      }

      const payload = {
        action: 'submitHotelForm',
        token: token || '',
        formData,
        pricing: pricing || {},
        language: language || 'fr',
        submittedAt: new Date().toISOString(),
      };

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        redirect: 'follow',
      });

      const result = await response.json();

      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      // Envoyer les emails via Resend
      const submissionId = result.submissionId;
      const pdfUrl = result.pdfUrl;

      // Email de confirmation au client
      try {
        await sendHotelFormConfirmationEmail({
          submissionId,
          hotelName: formData.nom,
          email: formData.email,
          phone: formData.tel,
          typeEtablissement: formData.typeEtablissement,
          pays: formData.pays,
          nbChambresTotal: formData.nbChambresTotal,
          budget: formData.budget,
          delai: formData.delai,
          totalOneTime: pricing?.totalOneTime,
          totalMonthly: pricing?.totalMonthly,
          pdfUrl,
          language: language || 'fr',
        });
      } catch (emailError: any) {
        console.error('Erreur envoi email confirmation client:', emailError);
      }

      // Email de notification à l'admin
      try {
        await sendHotelFormAdminNotification({
          submissionId,
          hotelName: formData.nom,
          email: formData.email,
          phone: formData.tel,
          typeEtablissement: formData.typeEtablissement,
          pays: formData.pays,
          nbChambresTotal: formData.nbChambresTotal,
          budget: formData.budget,
          delai: formData.delai,
          totalOneTime: pricing?.totalOneTime,
          totalMonthly: pricing?.totalMonthly,
          pdfUrl,
          language: language || 'fr',
        });
      } catch (emailError: any) {
        console.error('Erreur envoi email notification admin:', emailError);
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Formulaire soumis avec succès',
        submissionId,
        pdfUrl
      });
    }

    return NextResponse.json({ error: 'Action inconnue' }, { status: 400 });
  } catch (error: any) {
    console.error('Erreur hotel-form API:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement: ' + error.message },
      { status: 500 }
    );
  }
}