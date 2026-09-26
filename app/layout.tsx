import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Artivices ‣ B2B Webdesign",
  description:
    "B2B webdesign for businesses that need a website to build trust, explain what they do, and turn visitors into customers.",
  
    keywords: [
    // Dutch
    "webdesign",
    "website laten maken",
    "website laten bouwen",
    "webdesigner",
    "webdesign bureau",
    "professionele website",
    "zakelijke website",
    "branding",
    "branding bureau",
    "huisstijl",
    "logo ontwerp",
    "visuele identiteit",
    "website onderhoud",

    // English
    "web design",
    "web development",
    "web design agency",
    "web design studio",
    "web design company",
    "website development",
    "business website",
    "branding agency",
    "branding studio",
    "brand identity",
    "visual identity",
    "website maintenance",
  ],

  creator: "Artivices",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "Artivices ‣ B2B Webdesign",
    description:
      "B2B webdesign for businesses that need a website to build trust, explain what they do, and turn visitors into customers.",
    url: "https://artivices.vercel.app",
    siteName: "Artivices",
    images: [
      {
        url: "/Links/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artivices ‣ B2B Webdesign",
    description:
      "B2B webdesign for businesses that need a website to build trust, explain what they do, and turn visitors into customers.",
    images: ["/Links/twitter-image.png"],
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-body antialiased bg-ink text-linen">
        {children}
      </body>
    </html>
  );
}
