import Image from 'next/image';

interface CoverImageProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** Classes du cadre (ratio, rayon, bordure). Le cadre doit définir sa hauteur (aspect-ratio ou min-h). */
  className?: string;
  imgClassName?: string;
}

/**
 * Illustration d'article affichée en entier (object-contain). Quand son ratio diffère du cadre
 * (images carrées, panoramiques), les marges sont remplies par la même image floutée : plus de
 * bandes de couleur étrangères, sans connaître les dimensions à l'avance.
 */
export function CoverImage({ src, alt, sizes, priority, className = '', imgClassName = '' }: CoverImageProps) {
  return (
    <div className={`relative overflow-hidden bg-chypre/[0.06] ${className}`}>
      <Image src={src} alt="" aria-hidden="true" fill sizes={sizes} className="scale-125 object-cover opacity-70 blur-2xl" loading="lazy" />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={`object-contain ${imgClassName}`}
        priority={priority}
        {...(priority ? { fetchPriority: 'high' as const } : {})}
      />
    </div>
  );
}
