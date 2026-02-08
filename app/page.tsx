import { HomePageClient } from '@/components/home-page-client';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <>
      <Header />
      <HomePageClient />
      <Footer />
    </>
  );
}