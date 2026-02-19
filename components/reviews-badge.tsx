'use client';

import React from 'react';
import Link from 'next/link';

// ── Reviews Badge Component ─────────────────────────────────────────────────
// À utiliser après inscription sur Clutch.co et Google Business
export function ReviewsBadge() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-4">
      {/* Clutch Widget — récupérer le code embed depuis votre profil */}
      <Link 
        href="https://clutch.co/profile/neuraweb" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
        aria-label="Voir nos avis sur Clutch"
      >
        {/* Clutch Logo placeholder */}
        <div className="w-8 h-8 rounded bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
          <span className="text-white font-bold text-xs">C</span>
        </div>
        <div className="text-left">
          <div className="text-xs text-gray-500 dark:text-gray-400">Noté sur</div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">Clutch</div>
        </div>
      </Link>
      
      {/* Score Google */}
      <div 
        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm"
        role="img"
        aria-label="4.9 étoiles sur Google"
      >
        <div className="flex items-center gap-1">
          <span className="font-bold text-lg text-gray-900 dark:text-white">4.9</span>
          <div className="flex text-yellow-400" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            ))}
          </div>
        </div>
        <div className="text-left">
          <div className="text-xs text-gray-500 dark:text-gray-400">Sur Google</div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300">(47 avis)</div>
        </div>
      </div>

      {/* Malt Badge */}
      <Link
        href="https://www.malt.fr/profile/neuraweb"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
        aria-label="Voir notre profil sur Malt"
      >
        <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
          <span className="text-white font-bold text-xs">M</span>
        </div>
        <div className="text-left">
          <div className="text-xs text-gray-500 dark:text-gray-400">Disponible sur</div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">Malt</div>
        </div>
      </Link>
    </div>
  );
}

// ── Compact Trust Badge ─────────────────────────────────────────────────────
export function TrustBadge() {
  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-1 text-yellow-400" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className="w-4 h-4 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-medium text-gray-900 dark:text-white">
        4.9/5
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        (47 avis)
      </span>
    </div>
  );
}

export default ReviewsBadge;