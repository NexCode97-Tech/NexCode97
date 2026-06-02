import { WovenLightHero } from "@/components/hero-dynamic";
import { ServicesSection } from "@/components/services-section";
import StackFeatureSection from "@/components/ui/stack-feature-section";
import { NosotrosSection } from "@/components/nosotros-section";
import { WhatsAppFAB } from "@/components/whatsapp-fab";

export default function Home() {
  return (
    <main style={{ background: "#09090e" }}>
      <WovenLightHero />
      <ServicesSection />
      <StackFeatureSection />
      <NosotrosSection />
      <WhatsAppFAB />
    </main>
  );
}
