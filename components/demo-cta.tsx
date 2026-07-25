import { ArrowRight, Sparkles, Smartphone, Monitor, Zap } from 'lucide-react';

import { cn } from '@/lib/utils';
import { DEMO_URL } from '@/lib/site-config';

type DemoSector = 'collectivite' | 'web' | 'mobile' | 'restaurant' | 'hotel' | 'generic';

interface DemoCopy {
  eyebrow: string;
  title: string;
  highlight: string;
  text: string;
  /** point d'entrée direct dans la démo (ancre/route du sous-domaine) */
  path?: string;
}

// Source de vérité de l'URL : lib/site-config.ts (demo.neuraweb.fr).
const COPY: Record<DemoSector, DemoCopy> = {
  collectivite: {
    eyebrow: 'Démo interactive',
    title: 'Voyez l’app citoyenne et le back-office mairie',
    highlight: 'connectés en temps réel',
    text: 'Signalement, réservation de salle, démarche en ligne : agissez côté citoyen et regardez l’action remonter instantanément dans le back-office de la collectivité.',
    path: '/c/collectivite',
  },
  web: {
    eyebrow: 'Démo interactive',
    title: 'Notre savoir-faire web + mobile,',
    highlight: 'connecté en direct',
    text: 'Back-office et expérience client (site web ou application) partagent le même état, avec synchronisation temps réel, IA intégrée et notifications. Trois métiers à explorer.',
  },
  mobile: {
    eyebrow: 'Démo interactive',
    title: 'Une application mobile reliée à son back-office,',
    highlight: 'en temps réel',
    text: 'Application citoyenne, suivi de commande, conciergerie : voyez comment une app mobile et l’interface métier se synchronisent instantanément. Démo mockée, sans installation.',
  },
  restaurant: {
    eyebrow: 'Démo interactive',
    title: 'Commande, réservation et écran cuisine (KDS)',
    highlight: 'synchronisés en direct',
    text: 'Le client commande ou réserve depuis le site, le restaurant accepte ou refuse, et le suivi avance en temps réel côté client. Explorez le scénario complet.',
    path: '/r/restaurant',
  },
  hotel: {
    eyebrow: 'Démo interactive',
    title: 'Réservation, check-in et conciergerie',
    highlight: 'connectés en temps réel',
    text: 'Le voyageur réserve et demande un service depuis le site, la réception valide, et la notification revient instantanément côté client. Démo mockée à explorer.',
    path: '/h/hotel',
  },
  generic: {
    eyebrow: 'Démo interactive',
    title: 'Web + mobile connectés,',
    highlight: 'synchronisés en temps réel',
    text: 'Une maquette interactive pour trois métiers (collectivité, restaurant, hôtel) : back-office et expérience client parlent en direct. À explorer sans installation.',
  },
};

const PILLARS = [
  { icon: Monitor, label: 'Web + mobile' },
  { icon: Zap, label: 'Temps réel' },
  { icon: Smartphone, label: 'App + back-office' },
];

/**
 * Encart « Voir la démo » renvoyant vers le sous-domaine de la démo interactive
 * (NeuraWeb Connected Suite). Lien externe — nouvel onglet, rel sécurisé.
 * Stylé en navy pour rappeler l'esthétique sombre de la démo, quel que soit
 * le fond (clair) de la page hôte.
 */
export function DemoCTA({
  sector = 'generic',
  className,
}: {
  sector?: DemoSector;
  className?: string;
}) {
  const copy = COPY[sector];
  const href = copy.path ? `${DEMO_URL}${copy.path}` : DEMO_URL;

  return (
    <section className={cn('relative px-4 sm:px-6 lg:px-8 py-12 md:py-16', className)}>
      <div className="relative max-w-6xl mx-auto overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0E1B3D] to-[#070F26] p-8 sm:p-10 lg:p-12 shadow-2xl shadow-indigo-900/20">
        {/* halos décoratifs */}
        <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-sky-300">
              <Sparkles className="h-3.5 w-3.5" />
              {copy.eyebrow}
            </span>

            <h2 className="mt-4 font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white">
              {copy.title}{' '}
              <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
                {copy.highlight}
              </span>
            </h2>

            <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-white/60">
              {copy.text}
            </p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {PILLARS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1 text-xs font-medium text-white/75"
                >
                  <Icon className="h-3.5 w-3.5 text-sky-300" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 lg:text-right">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#070F26] shadow-lg shadow-white/10 transition hover:-translate-y-0.5 hover:opacity-90"
            >
              Voir la démo
              <ArrowRight className="h-4 w-4" />
            </a>
            <p className="mt-3 text-xs text-white/40">
              Maquette interactive — données fictives, sans installation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
