'use client';

import { useEffect } from 'react';

// ── Crisp Chat Component ────────────────────────────────────────────────────
// Intégration du chat live Crisp avec chargement différé
// pour ne pas impacter les Core Web Vitals
declare global {
  interface Window {
    $crisp: unknown[];
    CRISP_WEBSITE_ID: string;
  }
}

export function CrispChat() {
  useEffect(() => {
    // Chargement différé pour ne pas impacter les Core Web Vitals
    // Le chat se charge 3 secondes après le chargement de la page
    const timer = setTimeout(() => {
      // Vérifier si CRISP_WEBSITE_ID est défini
      const crispId = process.env.NEXT_PUBLIC_CRISP_ID;
      
      if (!crispId) {
        console.warn('NEXT_PUBLIC_CRISP_ID not set, skipping Crisp chat initialization');
        return;
      }

      // Initialiser Crisp
      window.$crisp = [];
      window.CRISP_WEBSITE_ID = crispId;
      
      // Charger le script Crisp
      const script = document.createElement('script');
      script.src = 'https://client.crisp.chat/l.js';
      script.async = true;
      
      // Ajouter le script au head
      document.head.appendChild(script);
      
      // Configuration optionnelle
      window.$crisp.push(['set', 'message:max', 5000]);
      window.$crisp.push(['set', 'message:delay', 1000]);
      
      // Identifier l'utilisateur si des informations sont disponibles
      // window.$crisp.push(['set', 'user:email', 'user@example.com']);
      // window.$crisp.push(['set', 'user:nickname', 'User Name']);
      
    }, 3000); // Délai de 3s après chargement page

    return () => clearTimeout(timer);
  }, []);

  // Le composant ne rend rien visuellement - Crisp injecte son propre UI
  return null;
}

export default CrispChat;