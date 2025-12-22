import Header from '@/components/common/Header';
import Briefing from '@/components/main/Briefing';
import Footer from '@/components/main/Footer';
import Keyword from '@/components/main/Keyword';
import Macro from '@/components/main/Macro';
import Sector from '@/components/main/Sector';

export default function Home() {
  return (
    <>
      <Header />
      <main className="py-8 space-y-10">
        <Briefing />
        <Macro />
        <Sector />
        <Keyword />
        <Footer />
      </main>
    </>
  );
}
