"use client";

import Image from "next/image";
import AutoScroll from "embla-carousel-auto-scroll";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

interface Logo {
  id: string;
  description: string;
  image: string;
  className?: string;
}

interface Logos3Props {
  heading?: string;
  logos?: Logo[];
}

const Logos3 = ({
  heading = "Empresas que confían en NexCode97",
  logos = [
    { id: "logo-1", description: "Natural Ropa Deportiva", image: "/logos/logo-ntrl.png",      className: "h-10 w-auto" },
    { id: "logo-2", description: "Guevara Sport",          image: "/logos/logo-gvr.png",       className: "h-10 w-auto" },
    { id: "logo-3", description: "VeloClub",               image: "/logos/logo-veloclub.png",  className: "h-10 w-auto" },
    { id: "logo-4", description: "Grupo 500",              image: "/logos/logo-grupo500.png",  className: "h-10 w-auto" },
    /* duplicados para que el scroll se vea continuo con pocos logos */
    { id: "logo-5", description: "Natural Ropa Deportiva", image: "/logos/logo-ntrl.png",      className: "h-10 w-auto" },
    { id: "logo-6", description: "Guevara Sport",          image: "/logos/logo-gvr.png",       className: "h-10 w-auto" },
    { id: "logo-7", description: "VeloClub",               image: "/logos/logo-veloclub.png",  className: "h-10 w-auto" },
    { id: "logo-8", description: "Grupo 500",              image: "/logos/logo-grupo500.png",  className: "h-10 w-auto" },
  ],
}: Logos3Props) => {
  return (
    <section className="py-16" style={{ background: "#09090e" }}>
      {/* Divider */}
      <div className="h-px mx-auto max-w-5xl mb-14" style={{ background: "linear-gradient(90deg,transparent,rgba(124,58,237,.4) 30%,rgba(6,182,212,.3) 70%,transparent)" }} />

      <div className="flex flex-col items-center text-center px-6 mb-10">
        <p className="text-xs font-bold tracking-[0.14em] uppercase" style={{ color: "#3d3f52", fontFamily: "'Inter', sans-serif" }}>
          {heading}
        </p>
      </div>

      <div className="relative mx-auto flex items-center justify-center lg:max-w-5xl">
        <Carousel
          opts={{ loop: true }}
          plugins={[AutoScroll({ playOnInit: true, speed: 1 })]}
        >
          <CarouselContent className="ml-0">
            {logos.map((logo) => (
              <CarouselItem
                key={logo.id}
                className="flex basis-1/2 justify-center pl-0 sm:basis-1/3 md:basis-1/4 lg:basis-1/4"
              >
                <div className="mx-10 flex shrink-0 items-center justify-center">
                  <Image
                    src={logo.image}
                    alt={logo.description}
                    width={120}
                    height={48}
                    className={`${logo.className} opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300`}
                    loading="lazy"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16" style={{ background: "linear-gradient(to right, #09090e, transparent)" }} />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16" style={{ background: "linear-gradient(to left, #09090e, transparent)" }} />
      </div>
    </section>
  );
};

export { Logos3 };
