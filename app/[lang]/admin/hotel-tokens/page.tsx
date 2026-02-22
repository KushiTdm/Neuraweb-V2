// app/[lang]/admin/hotel-tokens/page.tsx
// Page admin pour générer des liens de formulaire hôtel
'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function HotelTokensAdminPage() {
  const [hotelName, setHotelName] = useState('');
  const [email, setEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [language, setLanguage] = useState('fr');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; token?: string; formUrl?: string; error?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/hotel-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createToken',
          hotelName,
          email,
          contactName,
          language,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult({ success: true, token: data.token, formUrl: data.formUrl });
        setHotelName('');
        setEmail('');
        setContactName('');
      } else {
        setResult({ success: false, error: data.error || 'Erreur lors de la création' });
      }
    } catch (error: any) {
      setResult({ success: false, error: error.message || 'Erreur de connexion' });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#050510] py-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-extrabold text-3xl text-white mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
              Génération de liens hôtel
            </h1>
            <p className="text-slate-400 text-sm">
              Créez un lien personnalisé pour un établissement hôtelier
            </p>
          </div>

          {/* Formulaire */}
          <div className="rounded-[20px] border border-white/8 p-8 backdrop-blur-md"
            style={{ background: 'rgba(255,255,255,0.025)' }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nom de l'établissement *
                </label>
                <input
                  type="text"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="Hôtel de la Paix"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email de contact *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="contact@hotel-paix.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nom du contact
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Langue du formulaire
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500 transition-colors"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading || !hotelName || !email}
                className="w-full py-4 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)' }}
              >
                {isLoading ? 'Création en cours...' : 'Générer le lien'}
              </button>
            </form>

            {/* Résultat */}
            {result && (
              <div className={`mt-6 p-4 rounded-lg ${result.success ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                {result.success ? (
                  <div className="space-y-4">
                    <p className="text-green-400 font-medium">✓ Lien créé avec succès !</p>
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Token :</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-black/30 rounded text-violet-400 text-sm">
                          {result.token}
                        </code>
                        <button
                          onClick={() => copyToClipboard(result.token!)}
                          className="px-3 py-2 bg-violet-500/20 text-violet-400 rounded hover:bg-violet-500/30 transition-colors text-sm"
                        >
                          Copier
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm mb-1">URL du formulaire :</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-black/30 rounded text-violet-400 text-sm truncate">
                          {result.formUrl}
                        </code>
                        <button
                          onClick={() => copyToClipboard(result.formUrl!)}
                          className="px-3 py-2 bg-violet-500/20 text-violet-400 rounded hover:bg-violet-500/30 transition-colors text-sm"
                        >
                          Copier
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-500 text-xs">
                      Un email a été envoyé à {email} avec le lien du formulaire.
                    </p>
                  </div>
                ) : (
                  <p className="text-red-400">✗ {result.error}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}