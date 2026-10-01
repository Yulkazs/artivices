"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

const NAV = [
  { label: "Home", href: "#top" },
  { label: "Case Studies", href: "#case-studies" },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7 md:h-8 md:w-8" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7 md:h-8 md:w-8" fill="currentColor" aria-hidden>
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11.5H3V9.75zm6.5 0h3.83v1.57h.05c.53-1 1.84-2.07 3.79-2.07 4.05 0 4.8 2.67 4.8 6.13v5.87h-4v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75v5.29h-4V9.75z" />
      </svg>
    ),
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const WORDMARK = "ARTIVICES".split("");

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();

  // The half logo rises into place as the footer scrolls into view.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const markY = useTransform(scrollYProgress, [0, 1], ["45%", "0%"]);
  const markOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: inView ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.8, ease: EASE, delay },
  });

  return (
    <footer ref={ref} className="relative overflow-hidden bg-ink md:mt-16 lg:mt-40">
      {/* Half logo, centered on the page and flush with the bottom edge.
          The outer div does the centering, so Framer's transform on the inner
          one can't override it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center"
      >
        <motion.div
          style={reduce ? undefined : { y: markY, opacity: markOpacity }}
          className="w-[90vw] md:w-[70vw] lg:w-[40vw] xl:w-[48vw] xl:max-w-[900px]"
        >
          <Image
            src="/images/Logo_Half_v2.svg"
            alt=""
            width={510}
            height={255}
            unoptimized
            className="block h-auto w-full"
          />
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[2000px] flex-col justify-between gap-16 px-6 md:px-10 xl:px-16 2xl:px-24 pb-[calc(45vw+2rem)] pt-20 md:pb-[calc(35vw+2rem)] lg:min-h-[720px] lg:pb-14 lg:pt-24">
        {/* Top row */}
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div>
            <h2
              aria-label="Artivices"
              className="flex pt-3 font-logo text-[clamp(3.5rem,9vw,9rem)] leading-[1.05] tracking-tight text-linen"
            >
              {WORDMARK.map((ch, i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  className="inline-block"
                  initial={reduce ? false : { opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.05 * i }}
                >
                  {ch}
                </motion.span>
              ))}
            </h2>

            <motion.p
              {...fade(0.55)}
              className="mt-5 max-w-[34ch] font-body text-sm leading-relaxed text-linen/55 md:text-base"
            >
              We design and build modern websites for B2B companies that want
              to grow.
            </motion.p>
          </div>

          <motion.nav
            {...fade(0.4)}
            aria-label="Footer navigation"
            className="pt-3"
          >
            <p className="font-body text-sm uppercase tracking-wide text-linen">
              Navigation
            </p>
            <ul className="mt-5 space-y-5">
              {NAV.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="focus-ring group relative inline-block font-body text-sm text-linen/75 transition-colors duration-300 hover:text-linen"
                  >
                    {l.label}
                    <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-linen transition-transform duration-500 ease-out group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <motion.ul {...fade(0.7)} className="flex items-center gap-6">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  className="focus-ring inline-block text-linen transition-all duration-300 hover:-translate-y-0.5 hover:text-clay"
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </motion.ul>

          <motion.p {...fade(0.8)} className="font-body text-sm text-linen/80">
            © {new Date().getFullYear()} Artivices, All Rights Reserved
          </motion.p>
        </div>
      </div>
    </footer>
  );
}