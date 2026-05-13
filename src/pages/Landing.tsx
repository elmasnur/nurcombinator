import Hero from '@/components/landing/Hero';
import ModelSection from '@/components/landing/ModelSection';
import StageMapSection from '@/components/landing/StageMapSection';
import AudienceSection from '@/components/landing/AudienceSection';
import TwelveWeekFlowSection from '@/components/landing/TwelveWeekFlowSection';
import FinalCtaSection from '@/components/landing/FinalCtaSection';
import Footer from '@/components/landing/Footer';

export default function Landing() {
  return (
    <div className="bg-ivory text-slate-deep">
      <Hero />
      <ModelSection />
      <StageMapSection />
      <AudienceSection />
      <TwelveWeekFlowSection />
      <FinalCtaSection />
      <Footer />
    </div>
  );
}
