"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/* ---------- display font ----------
   Orange Avenue, from globals.css: --font-logo. The serif stack is only a
   fallback while the font loads. */
const DISPLAY: CSSProperties = {
  fontFamily: 'var(--font-logo), "Bodoni Moda", Georgia, serif',
};

const Display = ({ children }: { children: string }) => (
  <span style={DISPLAY} className="font-normal">
    {children}
  </span>
);

const EYEBROW = "Clarity, then craft.";
const LINE_TOP = (
  <>
    How we turn <Display>ideas</Display>
  </>
);
const LINE_BOTTOM = (
  <>
    into <Display>Impact.</Display>
  </>
);

const STEPS = [
  {
    n: "01",
    title: "Discovery",
    body: "We learn about your business, your goals, and your target audience.",
  },
  {
    n: "02",
    title: "Design",
    body: "We shape your identity and interface into one clear visual system.",
  },
  {
    n: "03",
    title: "Build",
    body: "We build your site and brand assets in the open, with a live preview.",
  },
  {
    n: "04",
    title: "Launch",
    body: "We launch, hand over the code and guidelines, and keep supporting you.",
  },
];

/* ---------- card ----------
   Everything inside is sized in `cqw` (1% of the card's width), so the card
   keeps the exact proportions of the design at any size. */
function StepCard({ step }: { step: (typeof STEPS)[number] }) {
  return (
    <div className="aspect-[1864/1988] w-full overflow-hidden rounded-xl bg-[#22201E] [container-type:inline-size]">
      <div style={{ paddingTop: "8cqw" }}>
        <span
          className="block leading-none text-[#D9D9D9]"
          style={{ ...DISPLAY, fontSize: "14cqw", paddingLeft: "6.7cqw" }}
        >
          {step.n}
        </span>
        <h3
          className="text-center font-normal leading-none text-[#B0A396]"
          style={{ ...DISPLAY, fontSize: "12cqw", marginTop: "4cqw" }}
        >
          {step.title}
        </h3>
        <p
          className="text-center font-body font-light text-[#8E8E8E]"
          style={{ fontSize: "7cqw", lineHeight: 1.32, marginTop: "12cqw", paddingInline: "12cqw" }}
        >
          {step.body}
        </p>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
// progress (0..1) of `p` inside the window [a, b]
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => t * t * (3 - 2 * t); // smoothstep

const DESKTOP_QUERY = "(min-width: 1024px)"; // Tailwind `lg`

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null); // desktop: upper half of the heading
  const bottomRef = useRef<HTMLDivElement>(null); // desktop: lower half of the heading
  const mobileHeadingRef = useRef<HTMLDivElement>(null); // mobile: whole heading
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  const [reduced, setReduced] = useState(false);

  /* respect prefers-reduced-motion: fall back to a static grid */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* scroll-driven animation — writes transforms straight to the DOM (no re-renders) */
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const desktop = window.matchMedia(DESKTOP_QUERY);
    let frame = 0;

    const update = () => {
      frame = 0;
      const vh = stage.clientHeight;
      const rect = section.getBoundingClientRect();
      const total = rect.height - vh;
      const p = total > 0 ? clamp(-rect.top / total) : 0;

      const top = topRef.current;
      const bottom = bottomRef.current;
      const heading = mobileHeadingRef.current;
      const cards = cardRefs.current;

      if (desktop.matches) {
        /* DESKTOP — heading splits, cards rise through the gap */
        if (heading) {
          heading.style.opacity = "";
          heading.style.transform = "";
        }

        const split = clamp(vh * 0.3, 200, 320);
        const s = ease(seg(p, 0, 0.3));
        if (top) top.style.transform = `translate3d(0, ${-split * s}px, 0)`;
        if (bottom) bottom.style.transform = `translate3d(0, ${split * s}px, 0)`;

        cards.forEach((el, i) => {
          if (!el) return;
          const start = 0.15 + i * 0.12;
          const t = ease(seg(p, start, start + 0.32));
          const offscreen = vh / 2 + el.offsetHeight / 2 + 40;
          el.style.transform = `translate3d(0, ${offscreen * (1 - t)}px, 0)`;
        });
      } else {
        /* MOBILE — heading stays put, cards stack on top of it one by one */
        if (top) top.style.transform = "";
        if (bottom) bottom.style.transform = "";

        const dim = seg(p, 0.1, 0.6);
        if (heading) {
          heading.style.opacity = String(1 - 0.65 * dim);
          heading.style.transform = `scale(${1 - 0.04 * dim})`;
        }

        const n = cards.length;
        const h = cards[0]?.offsetHeight ?? 0;
        // how much of each older card stays visible (number + title),
        // shrunk if the whole stack wouldn't fit on screen
        const peek = Math.max(40, Math.min(h * 0.34, n > 1 ? (vh * 0.88 - h) / (n - 1) : 0));

        cards.forEach((el, i) => {
          if (!el) return;
          const start = 0.08 + i * 0.21;
          const t = ease(seg(p, start, start + 0.19));
          const offscreen = vh / 2 + el.offsetHeight / 2 + 40;
          const rest = (i - (n - 1)) * peek + ((n - 1) * peek) / 2;
          const restScale = 1 - (n - 1 - i) * 0.04;
          const y = offscreen * (1 - t) + rest * t;
          const scale = 1 + (restScale - 1) * t;
          el.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
        });
      }
    };

    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    update();

    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  /* ---------- reduced motion: static layout ---------- */
  if (reduced) {
    return (
      <section id="process" className="bg-ink py-24 md:py-32">
        <div className="container-x">
          <p className="font-body text-sm tracking-wide text-mist">{EYEBROW}</p>
          <h2 className="mt-3 max-w-2xl font-body font-medium text-3xl leading-tight text-linen md:text-[2.75rem]">
            {LINE_TOP} {LINE_BOTTOM}
          </h2>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <StepCard key={step.n} step={step} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ---------- animated layout ---------- */
  return (
    <section
      ref={sectionRef}
      id="process"
      // scroll distance = section height − one screen
      className="relative h-[450svh] bg-ink lg:h-[400svh]"
    >
      <div ref={stageRef} className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Mobile heading (also the one real <h2> for screen readers on every size) */}
        <div
          ref={mobileHeadingRef}
          className="absolute inset-0 z-0 flex items-center will-change-transform"
        >
          <div className="container-x">
            <p className="font-body text-sm tracking-wide text-mist lg:hidden">{EYEBROW}</p>
            <h2 className="mt-2 font-body font-medium text-4xl leading-tight text-linen md:text-[2.75rem] lg:sr-only">
              {LINE_TOP} {LINE_BOTTOM}
            </h2>
          </div>
        </div>

        {/* Desktop split heading — visual only, hidden from assistive tech */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 hidden lg:block">
          <div ref={topRef} className="absolute inset-x-0 bottom-1/2 will-change-transform">
            <div className="container-x">
              <p className="font-body text-sm tracking-wide text-mist">{EYEBROW}</p>
              <span className="mt-3 block font-body font-medium text-[4.5rem] leading-[1.05] text-linen">
                {LINE_TOP}
              </span>
            </div>
          </div>
          <div ref={bottomRef} className="absolute inset-x-0 top-1/2 will-change-transform">
            <div className="container-x">
              <span className="block text-right font-body font-medium text-[4.5rem] leading-[1.05] text-linen">
                {LINE_BOTTOM}
              </span>
            </div>
          </div>
        </div>

        {/* Cards — above the heading on every size */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="container-x w-full">
            {/* mobile: every card shares one grid cell (a stack); desktop: 4 columns */}
            <div className="grid lg:grid-cols-4 lg:gap-x-5">
              {STEPS.map((step, i) => (
                <article
                  key={step.n}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  // initial offscreen position avoids a flash before the first frame
                  style={{ transform: "translate3d(0, 100vh, 0)" }}
                  className="col-start-1 row-start-1 mx-auto w-full max-w-[19rem] will-change-transform sm:max-w-sm lg:col-auto lg:row-auto lg:max-w-none"
                >
                  <StepCard step={step} />
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}