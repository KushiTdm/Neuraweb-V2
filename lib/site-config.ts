// Configuration transverse du site.

/**
 * Sous-domaine Vercel hébergeant la démo interactive « NeuraWeb Connected Suite »
 * (web + mobile connectés, projet appMobile). Lien externe → ouvrir dans un
 * nouvel onglet avec rel="noopener". Domaine canonique du site : neuraweb.fr.
 */
export const DEMO_URL = 'https://demo.neuraweb.fr';

/**
 * Vitrine des packs (Khởi Đầu / Phát Triển / Cao Cấp / Doanh Nghiệp) et des
 * démos pour commerces vietnamiens — projet séparé (monorepo `Hanoi`), déployé
 * sur Cloudflare Workers, pas sur neuraweb.fr. Lien externe → nouvel onglet
 * avec rel="noopener". Affiché uniquement sur la version `vi` du site.
 */
export const HANOI_OFFERS_URL = 'https://hanoi-demos-site.san3neb.workers.dev/packs';
