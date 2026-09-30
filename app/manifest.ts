import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Artivices",
    short_name: "Artivices",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0804",
    theme_color: "#0a0804",
    icons: [
      { src: "/favicons/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/favicons/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}