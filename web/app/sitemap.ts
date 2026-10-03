import type { MetadataRoute } from "next";

const SITIO = "https://www.nexcode97.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITIO, changeFrequency: "weekly", priority: 1 },
    ...["/privacidad", "/terminos", "/uso-aceptable", "/eliminar-datos"].map(ruta => ({
      url: SITIO + ruta, changeFrequency: "yearly" as const, priority: 0.3,
    })),
  ];
}
