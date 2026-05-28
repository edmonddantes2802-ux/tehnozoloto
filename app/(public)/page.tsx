import { Hero } from '@/components/sections/Hero';
import { ProblemsSection } from '@/components/sections/ProblemsSection';
import { SolutionSection } from '@/components/sections/SolutionSection';
import { Calculator } from '@/components/forms/Calculator';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { AboutSection } from '@/components/sections/AboutSection';
import { ShowcaseGrid } from '@/components/sections/ShowcaseGrid';
import { ReviewsSection } from '@/components/sections/ReviewsSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { LocationSection } from '@/components/sections/LocationSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProblemsSection />
      <SolutionSection />
      <Calculator />
      <HowItWorks />
      <AboutSection />
      <ShowcaseGrid />
      <ReviewsSection />
      <LocationSection />
      <FAQSection />
    </>
  );
}
