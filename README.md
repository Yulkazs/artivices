<div align="center">

# ARTIVICES

**Websites that help your business grow.**

B2B web design and branding studio · Utrecht, Netherlands

[Live site](https://artivices.vercel.app) · [studio@artivices.com](mailto:studio@artivices.com)

</div>

---

## About

This repository contains the website of **Artivices**, a small studio that designs and builds websites and brand identities for B2B companies.

The site has one job: to show what the studio does, prove it with work and results, and make it easy to start a conversation. It is a single-page experience with a scroll-driven hero, a restrained dark palette and motion that supports the content instead of competing with it.

## The Website

| Section | Purpose |
| --- | --- |
| **Hero** | Positioning statement and primary call to action. The image expands from a half-width panel into a full-bleed background as you scroll. |
| **What we build** | Five kinds of work: Brand Websites, Product & SaaS, Commerce storefronts, Internal & partner portals, and Branding. |
| **Case Studies** | A grid of recent projects, each linking to its own case study page. |
| **How it runs** | The four-stage process (Discover, Design, Build, Launch & hand off) across roughly eight weeks. |
| **Proof** | Rotating client reviews, animated metrics and a 24/7 support preview in a bento grid. |
| **Pricing** | Website, Branding and Hosting + Care packages with indicative prices, plus a prompt to discuss pricing. |
| **Contact** | Closing call to action and studio email. |
| **Footer** | Wordmark, navigation, social links and legal line. |

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3 with custom design tokens |
| Animation | Framer Motion 11 |
| Fonts | Satoshi (body), a display face for script accents, a logo face for the wordmark |
| Hosting | Vercel |

## Getting Started

**Requirements:** Node.js 18.17 or newer.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # lint (requires eslint and eslint-config-next)
```

## Project Structure

```
app/
  layout.tsx          Root layout, fonts, metadata
  page.tsx            Assembles all sections
  globals.css         Base styles, utilities, focus and motion rules
components/
  Header.tsx          Fixed navigation with mobile menu
  Hero.tsx            Scroll-linked hero
  Services.tsx        "What we build"
  CaseStudies.tsx     Project grid
  Process.tsx         Four-stage engagement process
  Testimonial.tsx     Reviews, metrics and support preview (bento grid)
  Pricing.tsx         Packages, branding, hosting and contact card
  CTA.tsx             Closing contact band
  Footer.tsx          Wordmark, navigation, socials, ornament
  LogoMark.tsx        The flourish logo mark, as inline SVG
public/
  images/             Hero artwork and decorative SVGs
  links/              Open Graph and Twitter share images
tailwind.config.ts    Colors, fonts and layout tokens
```

## Design System

The look is quiet and editorial: warm near-black, soft linen text and a single sandy accent.

### Colors

| Token | Hex | Use |
| --- | --- | --- |
| `ink` | `#0c0a07` | Page background |
| `ink-soft` | `#141109` | Cards and raised surfaces |
| `ink-line` | `#2c2820` | Borders and dividers |
| `linen` | `#f2ede2` | Primary text |
| `linen-dim` | `#a89f8c` | Secondary text |
| `linen-faint` | `#6f6a5c` | Tertiary text and captions |
| `clay` | `#c9bda3` | Accent, highlights, selection |
| `clay-dark` / `clay-light` | `#a99a7c` / `#ddd3bf` | Accent variants |
| `mist` | `#9aa1ad` | Cool neutral for small labels |

### Typography

| Class | Role |
| --- | --- |
| `font-body` | All running text, UI and numbers |
| `font-display` | Script accent words only, for example *Speaks*, *Prove* and *scales* |
| `font-logo` | The ARTIVICES wordmark |

Fonts are licensed separately and are not part of this repository's license. Use only font files you hold a web license for. Serve them as subsetted **woff2** through `next/font/local`.

### Layout and utilities

- `container-x`: centered content column, max width 1400px, with responsive side padding.
- `focus-ring`: a clay outline on keyboard focus for links and buttons.
- `case-title`: case study titles switch from ink to white where they cross the image.
- `looper-mask`: fades the edges of the looping lines on very wide screens.

### Motion and accessibility

- Animation is used for hierarchy: staggered fades, count-up numbers, a rotating review and a looping chat preview.
- `prefers-reduced-motion` is respected globally in `globals.css`, and components skip their entrance animations.
- Interactive elements have visible focus states, and decorative elements are hidden from assistive technology.
- Text selection uses the accent color on ink.

## Editing Content

Copy lives next to the component that uses it, as typed arrays at the top of each file.

| What | Where |
| --- | --- |
| Client reviews and metrics | `REVIEWS` and `METRICS` in `components/Testimonial.tsx` |
| Website, branding and hosting packages | `WEBSITE`, `BRANDING` and `CARE_FEATURES` in `components/Pricing.tsx` |
| Services | `components/Services.tsx` |
| Navigation and social links | `NAV` and `SOCIALS` in `components/Footer.tsx`, plus `Header.tsx` |

Pricing is indicative. Final prices depend on scope, which the Pricing section states and invites visitors to discuss.

## SEO and Performance

- Page title, description, canonical URL, Open Graph and Twitter metadata are set in `app/layout.tsx`.
- Share images live in `public/links/`.
- Use `next/image` for photography, and `next/font` for fonts, to protect Core Web Vitals.
- Keep one H1 per page and a clear H2 and H3 hierarchy inside sections.

## Roadmap

- [ ] Replace placeholder case studies and client reviews with real work
- [ ] Build the `/contact` page and the individual case study pages
- [ ] Add real LinkedIn and Instagram URLs
- [ ] Add `robots.ts`, `sitemap.ts` and JSON-LD structured data
- [ ] Switch the display font to Qeilab once a web license is in place
- [ ] Move to a custom domain and set `metadataBase`

## Contact

**Artivices Studio**
Utrecht, Netherlands
[studio@artivices.com](mailto:studio@artivices.com)

We take on a handful of new projects each quarter and reply within two working days.

---

<div align="center">

© 2026 Artivices Studio. All rights reserved.

</div>
