import Hero from '@/components/landing/Hero';
import ModelSection from '@/components/landing/ModelSection';
import StageMapSection from '@/components/landing/StageMapSection';
import AudienceSection from '@/components/landing/AudienceSection';
import TwelveWeekFlowSection from '@/components/landing/TwelveWeekFlowSection';
import FinalCtaSection from '@/components/landing/FinalCtaSection';
import Footer from '@/components/landing/Footer';

function Divider() {
  return (
    <div aria-hidden className="container mx-auto px-4">
      <div className="divider-fade" />
    </div>
  );
}

export default function Landing() {
  return (
    <div className="bg-ivory text-slate-deep">
      <Hero />
      <Divider />
      <ModelSection />
      <Divider />
      <StageMapSection />
      <Divider />
      <AudienceSection />
      <Divider />
      <TwelveWeekFlowSection />
      <FinalCtaSection />
      <Footer />
    </div>
  );
}
