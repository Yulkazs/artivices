# Artivices

A Next.js 14 (App Router) + TypeScript + Tailwind CSS site for a B2B website
studio, with a scroll-driven hero: the image starts as a half-width panel
next to the header and expands into a full-bleed background as you scroll,
using Framer Motion tied to scroll position.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

For a production build:

```bash
npm run build
npm run start
```

## Notes

- **Hero image**: `public/images/hero-night.svg` is a generated placeholder
  (stars, moon, marsh silhouette) standing in for your real photo, since no
  photo was supplied. Swap it for your own image by replacing that file, or
  point the `<img src="...">` in `components/Hero.tsx` at a new path (a
  `.jpg`/`.webp` works fine — just keep an aspect ratio that reads well both
  half-width and full-bleed, roughly 16:10 or wider).
- **Fonts**: the site uses `next/font/google` to load Cormorant Garamond
  (display/serif) and Jost (body) automatically at build time — this needs
  an internet connection the first time you build or run dev, same as any
  Next.js project using Google Fonts.
- **Copy**: all headings, case studies, testimonial and footer text are
  placeholder copy written for a website-design studio. Replace with your
  real services, past projects and contact details before launch.
- **Responsive**: the hero's split-panel treatment only applies at `md`
  breakpoint (768px) and up; on phones the image runs full-bleed from the
  start since there isn't room for a side-by-side layout, with a stronger
  dark scrim so the headline stays readable over the sky.
- **Reduced motion**: the global stylesheet disables animation/transition
  duration for anyone with `prefers-reduced-motion` set at the OS level.

## Project structure

```
app/
  layout.tsx       Root layout, fonts, metadata
  page.tsx          Assembles all sections
  globals.css       Tailwind + base styles + design tokens
components/
  Header.tsx        Fixed nav with mobile menu
  Hero.tsx          The scroll-linked parallax hero
  Services.tsx       "What we build" list
  CaseStudies.tsx    Project grid
  Process.tsx        Four-step engagement process
  Testimonial.tsx    Single pull-quote
  CTA.tsx            Closing contact band
  Footer.tsx         Footer nav + legal line
  LogoMark.tsx       The flourish logo mark, as inline SVG
public/images/
  hero-night.svg     Placeholder hero artwork — replace with your photo
```
