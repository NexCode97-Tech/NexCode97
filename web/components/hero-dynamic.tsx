"use client";

import dynamic from "next/dynamic";

const WovenLightHero = dynamic(() => import("@/components/woven-light-hero"), {
  ssr: false,
});

export { WovenLightHero };
