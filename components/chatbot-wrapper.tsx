'use client';

import dynamic from 'next/dynamic';

const Chatbot = dynamic(() => import('@/components/chatbot'), {
  loading: () => null,
  ssr: false,
});

export default function ChatbotWrapper() {
  return <Chatbot />;
}