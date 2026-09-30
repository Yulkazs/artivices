import type { MetadataRoute } from "next";
const SITE_URL = "https://artivices.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
  ];
}

// TODO: Case Study URL add