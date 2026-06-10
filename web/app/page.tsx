import { WovenLightHero } from "@/components/hero-dynamic";
import { ServicesSection } from "@/components/services-section";
import StackFeatureSection from "@/components/ui/stack-feature-section";
import { NosotrosSection } from "@/components/nosotros-section";
import { TestimoniosSection } from "@/components/testimonios-section";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFAB } from "@/components/whatsapp-fab";
import { IntroSplash } from "@/components/intro-splash";
import { ContactFormModal } from "@/components/contact-form";

export default function Home() {
  return (
    <main style={{ background: "#09090e" }}>
      <IntroSplash />
      <WovenLightHero />
      <ServicesSection />
      <StackFeatureSection />
      <NosotrosSection />
      <TestimoniosSection />
      <ContactFormModal />
      <SiteFooter />
      <WhatsAppFAB />
    </main>
  );
}
