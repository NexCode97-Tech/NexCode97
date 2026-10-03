import { WovenLightHero } from "@/components/hero-dynamic";
import { ServicesSection } from "@/components/services-section";
import StackFeatureSection from "@/components/ui/stack-feature-section";
import { NosotrosSection } from "@/components/nosotros-section";
import { TestimoniosSection } from "@/components/testimonios-section";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFAB } from "@/components/whatsapp-fab";
import { IntroSplash } from "@/components/intro-splash";
import { ContactFormModal } from "@/components/contact-form";

/** Quién es el sitio, para Google: el nombre de la marca y de la app es NexCode97. */
const DATOS_ESTRUCTURADOS = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": "https://www.nexcode97.com/#org", name: "NexCode97", url: "https://www.nexcode97.com", logo: "https://www.nexcode97.com/icon-192.png", email: "nexcode97@gmail.com", sameAs: ["https://www.instagram.com/nexcode97"] },
    { "@type": "WebSite", name: "NexCode97", url: "https://www.nexcode97.com", publisher: { "@id": "https://www.nexcode97.com/#org" } },
    { "@type": "SoftwareApplication", name: "NexCode97", applicationCategory: "BusinessApplication", operatingSystem: "Web", url: "https://www.nexcode97.com/crm/", publisher: { "@id": "https://www.nexcode97.com/#org" } },
  ],
};

export default function Home() {
  return (
    <main style={{ background: "#09090e" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(DATOS_ESTRUCTURADOS) }} />
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
