'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Chatbot = dynamic(() => import('@/components/chatbot'), {
  loading: () => null,
  ssr: false,
});

// Le chatbot n'est pas nécessaire au premier rendu : on charge son bundle quand le
// navigateur est inactif (ou à la première interaction), pour libérer le thread principal
// pendant le LCP / TBT.
export default function ChatbotWrapper() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const start = () => setReady(true);
    const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;
    events.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));

    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
      .requestIdleCallback;
    const timer = idle ? idle(start, { timeout: 5000 }) : window.setTimeout(start, 4000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, start));
      if (!idle) window.clearTimeout(timer);
    };
  }, []);

  return ready ? <Chatbot /> : null;
}
