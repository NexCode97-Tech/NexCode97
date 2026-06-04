"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface CardItem {
  id: string | number;
  title: string;
  description: string;
  imgSrc: string;
  icon: React.ReactNode;
  linkHref: string;
}

interface ExpandingCardsProps extends React.HTMLAttributes<HTMLUListElement> {
  items: CardItem[];
  defaultActiveIndex?: number;
}

export const ExpandingCards = React.forwardRef<HTMLUListElement, ExpandingCardsProps>(
  ({ className, items, defaultActiveIndex = 0, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(defaultActiveIndex);
    const [isDesktop, setIsDesktop] = React.useState(false);

    React.useEffect(() => {
      const handleResize = () => setIsDesktop(window.innerWidth >= 768);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const gridStyle = React.useMemo(() => {
      if (activeIndex === null) return {};
      if (isDesktop) {
        return { gridTemplateColumns: items.map((_, i) => (i === activeIndex ? "5fr" : "1fr")).join(" ") };
      }
      return { gridTemplateRows: items.map((_, i) => (i === activeIndex ? "5fr" : "1fr")).join(" ") };
    }, [activeIndex, items.length, isDesktop]);

    return (
      <ul
        ref={ref}
        className={cn(
          "w-full max-w-6xl gap-2 grid",
          "h-[600px] md:h-[480px]",
          "transition-[grid-template-columns,grid-template-rows] duration-500 ease-out",
          className,
        )}
        style={{
          ...gridStyle,
          ...(isDesktop ? { gridTemplateRows: "1fr" } : { gridTemplateColumns: "1fr" }),
        }}
        {...props}
      >
        {items.map((item, index) => (
          <li
            key={item.id}
            className={cn(
              "group relative cursor-pointer overflow-hidden rounded-xl border shadow-sm",
              "md:min-w-[72px] min-h-0 min-w-0",
            )}
            style={{ borderColor: "rgba(255,255,255,0.07)" }}
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            onClick={() => setActiveIndex(index)}
            tabIndex={0}
            data-active={activeIndex === index}
          >
            <Image
              src={item.imgSrc}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={100}
              className="object-cover transition-all duration-500 ease-out group-data-[active=true]:scale-100 group-data-[active=true]:grayscale-0 scale-110 grayscale"
              loading={index === 0 ? "eager" : "lazy"}
            />
            {/* overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
            {/* dark tint on inactive */}
            <div className="absolute inset-0 opacity-60 group-data-[active=true]:opacity-0 transition-opacity duration-500"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,.8), rgba(9,9,14,.5))" }} />

            {/* Título vertical — capa independiente, solo en colapsado desktop */}
            <h3
              className="absolute inset-0 hidden md:flex items-center justify-center text-xs font-semibold uppercase tracking-widest text-white/60 transition-opacity duration-300 ease-out group-data-[active=true]:opacity-0 whitespace-nowrap pointer-events-none"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              {item.title}
            </h3>

            <article className="absolute inset-0 flex flex-col justify-end gap-2 p-5">
              {/* expanded content */}
              <div className="text-white opacity-0 transition-all duration-300 delay-75 ease-out group-data-[active=true]:opacity-100">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-white opacity-0 transition-all duration-300 delay-150 ease-out group-data-[active=true]:opacity-100">
                {item.title}
              </h3>
              <p className="max-w-xs text-sm text-white/75 opacity-0 transition-all duration-300 delay-[225ms] ease-out group-data-[active=true]:opacity-100 leading-relaxed">
                {item.description}
              </p>
            </article>
          </li>
        ))}
      </ul>
    );
  }
);
ExpandingCards.displayName = "ExpandingCards";
