"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/**
 * Services — "What we build"
 *
 * Layout: a dark intro block, then five full-bleed bands that get lighter
 * one after the other (01 dark → 05 near-white).
 *
 * Scroll effect: the section pins to the screen and one scroll timeline plays
 * the bands in strictly one after the other. A band only starts once the one
 * above it has fully landed. Each band grows out from the bottom edge of the
 * layer above it — its top stays tucked beneath that layer while it slides
 * down. Nothing below is reserved or visible until its turn, so there are no
 * empty slots. Once the stack outgrows the screen it scrolls up with the
 * newest band, and after 05 the section un-pins and you scroll on normally.
 */

type Service = {
  index: string;
  title: string;
  tags: string[];
  body: string;
  /** band background */
  bg: string;
  /** number, title and body text colour */
  fg: string;
  /** tag line colour */
  tagFg: string;
};

const SERVICES: Service[] = [
  {
    index: "01",
    title: "Brand Websites",
    tags: ["Landing pages", "Messaging", "Conversion copy", "Analytics"],
    body: "A site that carries the same weight as your best pitch. Built to convert visitors before your team ever gets on a call.",
    bg: "#222222",
    fg: "#f2ede2",
    tagFg: "#a39b8d",
  },
  {
    index: "02",
    title: "Product & SaaS",
    tags: ["Pricing pages", "Docs", "Onboarding", "Integrations"],
    body: "Pricing pages, docs and onboarding flows that explain what your product does in the time it takes to scroll once.",
    bg: "#444444",
    fg: "#f2ede2",
    tagFg: "#b5a999",
  },
  {
    index: "03",
    title: "Commerce storefronts",
    tags: ["Product pages", "Checkout", "Inventory sync", "Performance"],
    body: "Fast, considered storefronts built on the platform that fits your catalogue, not the other way around.",
    bg: "#b0b0b0",
    fg: "#0c0a07",
    tagFg: "#4f4b43",
  },
  {
    index: "04",
    title: "Internal & partner portals",
    tags: ["Dashboards", "Access control", "Reporting", "Workflows"],
    body: "Dashboards and tools your team actually opens; scoped tightly, built to last past the first hire who requested them.",
    bg: "#d4d4d4",
    fg: "#0c0a07",
    tagFg: "#8c8375",
  },
  {
    index: "05",
    title: "Branding",
    tags: ["Logo", "Visual identity", "Guidelines", "Collateral"],
    body: "Identities that hold up on a homepage, a pitch deck and a business card. One system, applied everywhere.",
    bg: "#fafafa",
    fg: "#0c0a07",
    tagFg: "#928878",
  },
];

/** Shared horizontal padding — matches the Header so everything lines up. */
const PAD_X = "pl-6 pr-6 md:pl-14 md:pr-10 xl:pl-24 xl:pr-16";

const N = SERVICES.length;
/** Scroll distance each band gets, in viewport heights. */
const VH_PER_BAND = 0.75;
/** Portion of the timeline before the first band / after the last one. */
const START = 0.03;
const END = 0.95;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
/** Eased 0→1 progress of band `i` on the shared timeline. */
const bandProgress = (P: number, i: number) =>
  easeInOut(clamp01(((P - START) / (END - START)) * N - i));

/** Mobile browsers resize their viewport as the address bar hides/shows,
 *  which fights with a scroll-pinned, height-measuring animation like this
 *  one and is the source of the glitching seen on phones. Rather than
 *  chase that, the pinned effect is desktop-only; phones get the plain
 *  static stack below (same one reduced-motion already uses). */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isDesktop;
}

function BandContent({
  service,
  isLast,
}: {
  service: Service;
  isLast: boolean;
}) {
  return (
    <div
      className={`${PAD_X} ${
        isLast ? "pb-28 pt-14 md:pb-44 md:pt-[4.5rem]" : "py-14 md:py-[4.5rem]"
      }`}
    >
      <div className="grid items-center gap-x-10 gap-y-4 md:grid-cols-[9rem_1fr]">
        <span
          aria-hidden="true"
          className="font-logo text-[clamp(2.75rem,4.4vw,4.25rem)] font-normal leading-none opacity-90"
        >
          {service.index}
        </span>

        <div>
          <h3 className="font-accent text-[clamp(1.75rem,2.7vw,2.5rem)] font-normal leading-tight">
            <span className="sr-only">{service.index}. </span>
            {service.title}
          </h3>

          <ul
            className="mt-1.5 flex flex-wrap gap-x-2 font-body text-base md:text-[1.05rem]"
            style={{ color: service.tagFg }}
          >
            {service.tags.map((tag, i) => (
              <li key={tag}>
                {tag}
                {i < service.tags.length - 1 ? "," : ""}
              </li>
            ))}
          </ul>

          <p className="mt-7 max-w-[40rem] font-body text-base leading-relaxed opacity-90 md:mt-9">
            {service.body}
          </p>
        </div>
      </div>
    </div>
  );
}

function Intro() {
  return (
    <div className={`${PAD_X} pb-24 pt-32 md:pb-36 md:pt-44`}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="font-accent text-base tracking-wide text-linen/55">
          What we build
        </p>
        <h2
          id="services-heading"
          className="mt-6 max-w-[16ch] font-logo text-[clamp(2.25rem,3.6vw,3.25rem)] font-normal uppercase leading-[1.02] text-linen md:max-w-[22ch]"
        >
          Five kinds of work. One standard.
        </h2>
        <p className="mt-12 max-w-[24rem] font-body text-base leading-relaxed text-linen/85 md:mt-16">
          We keep a small roster of clients so every project gets the same
          attention as the last one. If your work fits one of these, we&apos;re
          likely a good match.
        </p>
      </motion.div>
    </div>
  );
}

/** One band. Its slot grows from 0 to its natural height while the band
 *  slides down inside it, so it always emerges from under the layer above. */
function Band({
  service,
  index,
  progress,
  heights,
}: {
  service: Service;
  index: number;
  progress: MotionValue<number>;
  heights: React.MutableRefObject<number[]>;
}) {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const measure = () => {
      heights.current[index] = el.offsetHeight;
      // nudge the scroll timeline so it re-reads the new height
      window.dispatchEvent(new Event("scroll"));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [heights, index]);

  const p = useTransform(progress, (P) => bandProgress(P, index));
  const height = useTransform(p, (v) => v * (heights.current[index] || 0));
  const y = useTransform(p, (v) => -(1 - v) * (heights.current[index] || 0));
  // shadow cast by the layer above; fades as the band lands
  const shadow = useTransform(p, (v) => (v > 0 ? 1 - v * 0.88 : 0));

  return (
    <motion.li className="relative overflow-hidden" style={{ height }}>
      <motion.div
        ref={innerRef}
        style={{
          y,
          backgroundColor: service.bg,
          color: service.fg,
          willChange: "transform",
        }}
      >
        <BandContent service={service} isLast={index === N - 1} />
      </motion.div>
      <motion.div
        aria-hidden="true"
        style={{ opacity: shadow }}
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-black/45 to-transparent"
      />
    </motion.li>
  );
}

function PinnedServices() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const heights = useRef<number[]>(Array(N).fill(0));
  const introH = useRef(0);
  const stageH = useRef(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const measure = () => {
      introH.current = introRef.current?.offsetHeight ?? 0;
      stageH.current = stageRef.current?.clientHeight ?? 0;
      window.dispatchEvent(new Event("scroll"));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (introRef.current) ro.observe(introRef.current);
    if (stageRef.current) ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, []);

  // Once the stack is taller than the screen, keep its bottom edge in view.
  const stackY = useTransform(scrollYProgress, (P) => {
    let total = introH.current;
    for (let i = 0; i < N; i++) {
      total += bandProgress(P, i) * (heights.current[i] || 0);
    }
    return Math.min(0, stageH.current - total);
  });

  return (
    <div
      ref={trackRef}
      style={{ height: `${100 + N * VH_PER_BAND * 100}vh` }}
      className="relative"
    >
      <div ref={stageRef} className="sticky top-0 h-screen overflow-hidden bg-ink">
        <motion.div style={{ y: stackY, willChange: "transform" }}>
          <div ref={introRef}>
            <Intro />
          </div>
          <ol>
            {SERVICES.map((service, i) => (
              <Band
                key={service.index}
                service={service}
                index={i}
                progress={scrollYProgress}
                heights={heights}
              />
            ))}
          </ol>
        </motion.div>
      </div>
    </div>
  );
}

/** Reduced motion: plain, static stack — no pinning, no movement. */
function StaticServices() {
  return (
    <>
      <Intro />
      <ol>
        {SERVICES.map((service, i) => (
          <motion.li
            key={service.index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ backgroundColor: service.bg, color: service.fg }}
          >
            <BandContent service={service} isLast={i === N - 1} />
          </motion.li>
        ))}
      </ol>
    </>
  );
}

export default function Services() {
  const reduceMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  return (
    <section id="work" aria-labelledby="services-heading" className="bg-ink">
      {reduceMotion || !isDesktop ? <StaticServices /> : <PinnedServices />}
    </section>
  );
}