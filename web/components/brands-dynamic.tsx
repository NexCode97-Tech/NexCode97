"use client";

import dynamic from "next/dynamic";

const BrandsSparkles = dynamic(
  () => import("@/components/brands-sparkles").then((m) => ({ default: m.BrandsSparkles })),
  { ssr: false }
);

export { BrandsSparkles };
