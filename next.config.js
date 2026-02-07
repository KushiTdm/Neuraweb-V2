/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: false, // Changé pour optimiser les images
    remotePatterns: [],
    formats: ['image/webp', 'image/avif'],
  },
};

module.exports = nextConfig;
```

---

## ✅ Ce qui est fait :

✅ **Migration complète du Header**
- Composant client avec `'use client'`
- Navigation avec `next/link` et `usePathname`
- Optimisation des images avec `next/image`
- Détection du scroll préservée
- Menu mobile fonctionnel
- Toggle thème/langue intégré
- Structure d'authentification préparée (props)

✅ **Différences clés avec React Router :**
- `Link` de Next.js (pas de `to` mais `href`)
- `usePathname()` au lieu de `useLocation()`
- `Image` optimisé pour les performances
- Fermeture automatique du menu au changement de route

✅ **Points d'attention :**
- ⚠️ Les traductions sont en dur (système simplifié à remplacer)
- ⚠️ L'authentification est via props (à connecter avec ton backend)
- ⚠️ Les images logos doivent être dans `/public/assets/`

---

## 📝 Actions requises de ton côté :

1. **Ajouter les images dans `/public/assets/` :**
```
   /public/assets/neurawebW.webp
   /public/assets/neurawebB.webp