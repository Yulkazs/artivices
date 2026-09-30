"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type CaseStudy = {
  name: string;
  blurb: string;
  href: string;
  date: string;
  image?: string;
};


const BLURB =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
const DATE = "September 2026";

const CASE_STUDIES: CaseStudy[] = [
  { name: "COMPANY NAME", blurb: BLURB, href: "/case-studies/one", date: DATE },
  { name: "COMPANY NAME", blurb: BLURB, href: "/case-studies/two", date: DATE },
  { name: "COMPANY NAME", blurb: BLURB, href: "/case-studies/three", date: DATE },
  { name: "COMPANY NAME", blurb: BLURB, href: "/case-studies/four", date: DATE },
];

const PANELS = CASE_STUDIES.length + 1;
const INK = "#0a0804";

function ImagePlaceholder() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="16.5" cy="7.5" r="0.6" fill="white" />
      <path d="M3 17l5.5-5.5a2 2 0 0 1 2.8 0L17 17" />
      <path d="M14 14l1.5-1.5a2 2 0 0 1 2.8 0L21 15" />
    </svg>
  );
}

function CaseStudyPanel({
  study,
  hideOnMobile = false,
}: {
  study: CaseStudy;
  hideOnMobile?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  // Fade the texts in once this project is on screen (works for the horizontal
  // desktop scroller too, since it observes the real on-screen position).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reveal = `transition duration-700 ease-out motion-reduce:transition-none ${
    inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
  }`;
  const delay = (ms: number) => ({ transitionDelay: `${ms}ms` });

  return (
    <article
      ref={ref}
      className={`relative w-full shrink-0 px-4 py-24 md:flex md:h-full md:w-screen md:items-center md:px-0 md:py-0 ${
        hideOnMobile ? "hidden" : ""
      }`}
    >
      {/* Stage: every desktop position below is relative to this box (same geometry as the design).
          Mobile: plain column (card, title, blurb, link + date). */}
      <div className="relative flex w-full flex-col md:block md:h-[min(32vw,72vh)]">
        {/* Card */}
        <div className="relative z-10 order-1 flex aspect-[5/4] w-full items-center justify-center overflow-hidden bg-[#9b9b9b] md:absolute md:left-[38vw] md:top-0 md:aspect-auto md:h-full md:w-[56vw] md:rounded-2xl">
          {study.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={study.image} alt={study.name} className="h-full w-full object-cover" />
          ) : (
            <ImagePlaceholder />
          )}

          {/* White copy of the title, clipped by the card: this is the "ME" in white (desktop only) */}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute hidden whitespace-nowrap font-light leading-none tracking-tight text-white md:block md:left-[-33vw] md:top-[3vw] md:text-[5.2vw] ${reveal}`}
            style={delay(0)}
          >
            {study.name}
          </span>
        </div>

        {/* Title (desktop: sits BEHIND the card, so the card hides the overlapping part) */}
        <h3
          className={`relative z-0 order-2 mt-10 whitespace-nowrap text-[7.3vw] font-light leading-none tracking-tight md:absolute md:left-[5vw] md:top-[3vw] md:mt-0 md:text-[5.2vw] ${reveal}`}
          style={{ color: INK, fontFamily: "inherit", ...delay(0) }}
        >
          {study.name}
        </h3>

        {/* Text column */}
        <div className="order-3 mt-5 md:absolute md:left-[5vw] md:top-0 md:mt-0 md:flex md:h-full md:w-[31vw] md:flex-col md:pt-[11vw]">
          <p
            className={`line-clamp-3 text-left text-base leading-relaxed md:ml-auto md:line-clamp-none md:max-w-none md:text-right md:text-[clamp(11px,0.85vw,15px)] ${reveal}`}
            style={{ color: "rgba(10,8,4,0.7)", ...delay(150) }}
          >
            {study.blurb}
          </p>

          {/* Mobile: link left, date right. Desktop: date bottom-left, link bottom-right */}
          <div
            className={`mt-16 flex items-center justify-between md:mt-auto md:flex-row-reverse md:items-end ${reveal}`}
            style={delay(300)}
          >
            <Link
              href={study.href}
              className="text-xl underline-offset-4 hover:underline md:text-base"
              style={{ color: INK }}
            >
              View Case Study
            </Link>
            <span
              className="text-base md:text-[clamp(11px,0.85vw,15px)]"
              style={{ color: "rgba(10,8,4,0.7)" }}
            >
              {study.date}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function CtaPanel() {
  return (
    <div className="w-full shrink-0 px-6 py-14 md:-ml-[2vw] md:flex md:h-full md:w-[52vw] md:items-center md:px-0 md:py-0">
      <Link
        href="/contact"
        className="group relative flex w-full flex-col justify-between gap-12 rounded-2xl px-8 py-10 text-[#fafafa] transition-transform duration-500 hover:scale-[1.015] md:h-[min(32vw,72vh)] md:w-[44vw] md:px-[3vw] md:py-[2.5vw]"
        style={{ backgroundColor: INK }}
      >
        <span className="text-sm" style={{ color: "#c9b99a" }}>
          Your turn
        </span>

        <span className="text-[11vw] font-light leading-[0.95] tracking-tight md:text-[4.4vw]">
          Next, your
          <br />
          project here?
        </span>

        <span className="flex w-full items-end justify-between gap-6">
          <span className="max-w-[16rem] text-sm text-[#fafafa]/70">
            Let&apos;s talk about what we can build together.
          </span>
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-transform duration-500 group-hover:translate-x-2 md:h-[5vw] md:w-[5vw]"
            style={{ backgroundColor: "#c9b99a", color: INK }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </span>
      </Link>
    </div>
  );
}

export default function CaseStudies() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [showAllMobile, setShowAllMobile] = useState(false);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      if (window.innerWidth < 768) {
        track.style.transform = "";
        return;
      }

      const scrollable = section.offsetHeight - window.innerHeight;
      const scrolled = -section.getBoundingClientRect().top;
      const progress = Math.min(Math.max(scrolled / scrollable, 0), 1);
      const maxX = track.scrollWidth - window.innerWidth;

      track.style.transform = `translate3d(${-progress * maxX}px, 0, 0)`;
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="case-studies" className="relative w-full bg-[#fafafa]">
      {/* Intro row */}
      <div className="flex w-full flex-col gap-6 px-4 pb-8 pt-24 md:flex-row md:items-end md:justify-between md:px-[5vw] md:pb-[6vw]">
        <div>
          <p className="mb-3 text-sm" style={{ color: "rgba(10,8,4,0.5)" }}>
            Case Studies
          </p>
          {/* If your other headings use a serif/display font, add that class here (same one Services.tsx uses) */}
          <h2 className="text-4xl leading-tight md:text-[3.2vw]" style={{ color: INK, fontFamily: "'Orange Avenue Demo', serif" }}>
            Recent work &amp;
            <br />
            what it moved.
          </h2>
        </div>
        <p
          className="ml-auto max-w-[22rem] text-right text-base leading-relaxed md:ml-0 md:max-w-md md:text-sm"
          style={{ color: "rgba(10,8,4,0.6)" }}
        >
          Explore a selection of websites we&apos;ve designed and built for businesses across different
          industries. Each project is tailored to reflect the client&apos;s brand, goals, and audience.
        </p>
      </div>

      {/* Pinned horizontal scroller */}
      <div
        ref={sectionRef}
        className="relative md:h-[calc(var(--panels)*100vh)]"
        style={{ ["--panels" as string]: PANELS }}
      >
        <div className="md:sticky md:top-0 md:h-screen md:overflow-hidden">
          <div ref={trackRef} className="flex flex-col will-change-transform md:h-full md:flex-row">
            {CASE_STUDIES.map((study, i) => (
              <CaseStudyPanel
                key={i}
                study={study}
                hideOnMobile={i >= 2 && !showAllMobile}
              />
            ))}

            {/* Mobile only: reveals projects 3 and 4 */}
            {!showAllMobile && (
              <div className="flex justify-center px-6 pb-14 md:hidden">
                <button
                  type="button"
                  onClick={() => setShowAllMobile(true)}
                  className="rounded-full border px-8 py-3 text-sm transition-colors active:bg-black/5"
                  style={{ borderColor: INK, color: INK }}
                >
                  View More
                </button>
              </div>
            )}

            <CtaPanel />
          </div>
        </div>
      </div>

      {/* Wave band, in normal flow below the scroller */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative h-[400px] w-full overflow-hidden bg-[#fafafa] md:h-auto"
      >
        {/* Mobile: image is ~2x the screen width and shifted so the crest and swirl stay in view.
            Desktop: normal full-width, natural height. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/LooperGroup.svg"
          alt=""
          className="absolute inset-y-0 -left-[35%] h-full w-[200%] max-w-none object-cover md:static md:left-0 md:block md:h-auto md:w-full"
        />

        {/* Fade finishes fully dark by 82%, leaving a solid dark zone at the bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,8,4,0) 0%, rgba(10,8,4,0) 25%, rgba(10,8,4,0.65) 55%, #0a0804 82%, #0a0804 100%)",
          }}
        />
      </div>

      {/* Solid tail, same color as the next section */}
      <div aria-hidden="true" className="h-6 w-full bg-ink" />
    </section>
  );
}