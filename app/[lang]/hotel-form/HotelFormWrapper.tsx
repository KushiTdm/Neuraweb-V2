// app/[lang]/hotel-form/HotelFormWrapper.tsx
// Wrapper client pour gérer le token depuis l'URL
'use client';

import { HotelForm } from '@/components/hotel-form';
import type { Language } from '@/lib/mdx';

interface HotelFormWrapperProps {
  lang: Language;
}

export function HotelFormWrapper({ lang }: HotelFormWrapperProps) {
  // Le formulaire sera accessible directement via l'URL avec un token
  // Ex: /fr/hotel-form?token=HOTEL-abc123xyz
  return <HotelForm lang={lang} />;
}