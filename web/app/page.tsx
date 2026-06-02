import { WovenLightHero } from "@/components/hero-dynamic";
import { BrandsSparkles } from "@/components/brands-dynamic";
import { ServicesSection } from "@/components/services-section";

export default function Home() {
  return (
    <main style={{ background: "#09090e" }}>
      <WovenLightHero />
      <BrandsSparkles />
      <ServicesSection />
    </main>
  );
}
