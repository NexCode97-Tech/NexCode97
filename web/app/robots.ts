import type { MetadataRoute } from "next";

/** El CRM y el API no se indexan: son privados. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/crm", "/api/"] },
    sitemap: "https://www.nexcode97.com/sitemap.xml",
    host: "https://www.nexcode97.com",
  };
}
