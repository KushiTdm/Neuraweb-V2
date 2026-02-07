import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with NeuraWeb for professional web development, AI integration, and automation services. Contact us today for a free consultation.',
  keywords: ['contact', 'web development contact', 'get in touch', 'free consultation'],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
