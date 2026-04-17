// Next.js middleware — active la détection de langue via Accept-Language header.
// La logique est dans proxy.ts pour garder les exports SUPPORTED_LANGUAGES accessibles
// aux autres modules (sitemap, layout, pages).
export { proxy as default, config } from './proxy';
