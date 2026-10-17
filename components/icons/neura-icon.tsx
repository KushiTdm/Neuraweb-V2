import React from 'react';
import data from './neura-icon-data.json';

// Icônes « gravure & tampon » (plaquette D) : générées avec Gemini sur fond uni,
// détourées puis vectorisées avec potrace (voir generated/icones/). Une seule couleur,
// `currentColor` : elles suivent la couleur de texte du thème de la page
// (lib/page-themes.ts). Les « creux » sont de vrais vides, donc le fond de page transparaît.

type IconData = { viewBox: string; transform: string; d: string[] };
const ICONS = data as unknown as Record<string, IconData>;

export type NeuraIconName = keyof typeof data;
export const NEURA_ICON_NAMES = Object.keys(ICONS) as NeuraIconName[];

interface NeuraIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  name: NeuraIconName;
  size?: number | string;
  /** Si absent, l'icône est décorative (aria-hidden). */
  title?: string;
}

export function NeuraIcon({ name, size = 48, title, ...rest }: NeuraIconProps) {
  const icon = ICONS[name];
  if (!icon) return null;
  return (
    <svg
      viewBox={icon.viewBox}
      width={size}
      height={size}
      fill="currentColor"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    >
      <g transform={icon.transform}>
        {icon.d.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}
