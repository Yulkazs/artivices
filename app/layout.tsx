import type { Metadata } from "next";
import Loader from "@/components/Loader";
import "./globals.css";

const SITE_URL = "https://artivices.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Artivices | B2B Webdesign Studio",
    template: "%s | Artivices",
  },
  description:
    "B2B webdesign for businesses that need a website to build trust, explain what they do, and turn visitors into customers.",
  alternates: { canonical: "/" },
  creator: "Artivices",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: {
    title: "Artivices | B2B Webdesign Studio",
    description: "B2B webdesign for businesses that need a website to build trust, explain what they do, and turn visitors into customers.",
    url: "/",
    siteName: "Artivices",
    images: [{ url: "/links/og-image.png", width: 1200, height: 630, alt: "Artivices, B2B webdesign" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artivices | B2B Webdesign Studio",
    description: "B2B webdesign for businesses that need a website to build trust, explain what they do, and turn visitors into customers.",
    images: ["/links/twitter-image.png"],
  },

  icons: {
    icon: [
      {
        url: "/favicons/favicon.ico",
        type: "image/x-icon",
      },
      {
        url: "/favicons/favicon-32x32.png",
        type: "image/png",
      },
      {
        url: "/favicons/favicon-16x16.png",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/favicons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ]
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Artivices",
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#org`,
      name: "Artivices",
      url: SITE_URL,
      logo: `${SITE_URL}/favicons/android-chrome-512x512.png`,
      image: `${SITE_URL}/links/og-image.png`,
      description:
        "B2B webdesign studio building websites that build trust and turn visitors into customers.",
      email: "artivicesstudio@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Utrecht",
        addressCountry: "NL",
      },
      sameAs: [], // TODO: add real LinkedIn / Instagram URLs
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Marks returning visitors before first paint so the loader never flashes */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("artivices-loader-seen"))document.documentElement.classList.add("ldr-seen")}catch(e){}`,
          }}
        />
        <noscript>
          <style>{`.ldr-root{display:none!important}`}</style>
        </noscript>
      </head>
      <body className="font-body antialiased bg-ink text-linen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Loader />
        {children}
      </body>
    </html>
  );
}