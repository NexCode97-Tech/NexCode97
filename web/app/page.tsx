import { WovenLightHero } from "@/components/woven-light-hero";
import { Logos3 } from "@/components/ui/logos3";
import { ServicesSection } from "@/components/services-section";

export default function Home() {
  return (
    <main style={{ background: "#09090e" }}>
      <WovenLightHero />
      <Logos3 />
      <ServicesSection />
    </main>
  );
}
