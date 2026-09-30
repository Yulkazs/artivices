"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

const QUOTE = {
  text: "They asked harder questions about our business than most of our own hires do. The site that came out of it still feels like the sharpest thing we own.",
  author: "Name",
};

const METRICS = [
  {
    value: 100,
    suffix: "+",
    label: "Projects delivered with bold strategy and sharp precision.",
  },
  {
    value: 98,
    suffix: "%",
    label: "Clients stay for our unmatched quality and proven results.",
  },
  {
    value: 86,
    suffix: "+",
    label: "Building impactful brands that perform globally.",
  },
];

const CHAT = [
  { id: 1, from: "them", text: "Hey there!" },
  { id: 2, from: "us", text: "How can I help you?" },
] as const;

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const EASE = [0.22, 1, 0.36, 1] as const;

/** Counts from 0 to `to` once `start` becomes true. */
function useCountUp(to: number, start: boolean, duration = 1800, delay = 0) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (reduce) {
      setValue(to);
      return;
    }

    let raf = 0;
    let t0 = 0;
    const timeout = window.setTimeout(() => {
      const tick = (now: number) => {
        if (!t0) t0 = now;
        const p = Math.min((now - t0) / duration, 1);
        // easeOutExpo
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        setValue(Math.round(eased * to));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [start, to, duration, delay, reduce]);

  return value;
}

function Counter({
  to,
  suffix,
  start,
  delay,
}: {
  to: number;
  suffix: string;
  start: boolean;
  delay: number;
}) {
  const n = useCountUp(to, start, 1800, delay);
  return (
    <span className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Chat card                                                                 */
/* -------------------------------------------------------------------------- */

function Avatar() {
  return (
    <span
      aria-hidden
      className="h-8 w-8 shrink-0 rounded-full bg-[#d9d9d9] md:h-9 md:w-9"
    />
  );
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 px-1 py-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-[#0c0a07]/60"
          animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

function ChatCard({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  // step 0 = nothing, 1 = typing #1, 2 = msg #1, 3 = typing #2, 4 = msg #2
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (reduce) {
      setStep(4);
      return;
    }
    const timers = [
      window.setTimeout(() => setStep(1), 900),
      window.setTimeout(() => setStep(2), 1900),
      window.setTimeout(() => setStep(3), 2900),
      window.setTimeout(() => setStep(4), 4000),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [active, reduce]);

  const showFirst = step >= 2;
  const showSecond = step >= 4;
  const typingFirst = step === 1;
  const typingSecond = step === 3;

  return (
    <div className="flex h-full flex-col justify-between gap-6">
      <div>
        <p className="font-body text-lg leading-tight text-linen md:text-xl">
          24/7
        </p>
        <p className="font-body text-sm text-linen/70 md:text-base">
          Always-on Support
        </p>
      </div>

      <div
        className="flex min-h-[110px] flex-col gap-3"
        aria-live="polite"
        aria-label="Support chat preview"
      >
        {/* Message 1 — incoming */}
        <div className="flex min-h-[36px] items-end gap-2">
          <AnimatePresence mode="wait" initial={false}>
            {(typingFirst || showFirst) && (
              <motion.div
                key="m1-row"
                className="flex items-end gap-2"
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
                style={{ transformOrigin: "left bottom" }}
              >
                <Avatar />
                <div className="rounded-2xl rounded-bl-sm bg-[#e4e4e4] px-3 py-1.5 font-body text-xs text-[#0c0a07]">
                  {typingFirst ? <TypingDots /> : CHAT[0].text}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Message 2 — outgoing */}
        <div className="flex min-h-[36px] items-end justify-end gap-2">
          <AnimatePresence mode="wait" initial={false}>
            {(typingSecond || showSecond) && (
              <motion.div
                key="m2-row"
                className="flex items-end gap-2"
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
                style={{ transformOrigin: "right bottom" }}
              >
                <div className="rounded-2xl rounded-br-sm bg-[#e4e4e4] px-3 py-1.5 font-body text-xs text-[#0c0a07]">
                  {typingSecond ? <TypingDots /> : CHAT[1].text}
                </div>
                <Avatar />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function Testimonial() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const reduce = useReducedMotion();

  // One orchestrated reveal: each tile fades in on a short stagger.
  const tile = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.8, ease: EASE, delay: 0.12 * i },
  });

  return (
    <section
      ref={ref}
      id="testimonials"
      className="bg-[#0a0a06] px-5 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-content">
        {/* Heading */}
        <motion.h2
          className="mb-10 max-w-[14ch] font-body text-4xl leading-[1.1] text-linen md:mb-14 md:text-5xl"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, ease: EASE }}
        >
          Proof that{" "}
          <span className="font-accent text-[1.15em] italic">Speaks</span>{" "}
          volumes
        </motion.h2>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:grid-rows-[repeat(2,minmax(0,1fr))] md:gap-4">
          {/* Quote — big light tile */}
          <motion.figure
            {...tile(1)}
            className="relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#dcdcdc] via-[#cfcbc8] to-[#b9b2aa] p-7 md:col-span-8 md:min-h-[300px] md:p-10 lg:col-span-7"
          >
            <blockquote className="m-auto max-w-[34ch] text-center font-body text-lg font-medium leading-snug text-[#0c0a07] md:text-2xl">
              <motion.span
                className="block"
                initial={reduce ? false : { opacity: 0 }}
                animate={inView ? { opacity: 1 } : undefined}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
              >
                &ldquo;{QUOTE.text}&rdquo;
              </motion.span>
            </blockquote>
            <figcaption className="mt-6 text-right font-body text-sm text-[#0c0a07]/80 md:text-base">
              &ndash; {QUOTE.author}
            </figcaption>
          </motion.figure>

          {/* Metrics — tall tile on the right */}
          <motion.div
            {...tile(2)}
            className="flex flex-col rounded-2xl bg-[#1f1f1e] p-7 md:col-span-4 md:row-span-2 md:p-8 lg:col-span-5"
          >
            <h3 className="font-body text-lg leading-snug text-linen/90 md:text-xl">
              Metrics that{" "}
              <span className="font-accent text-[1.15em] italic">Prove</span>
              <br />
              value
            </h3>

            <dl className="mt-8 flex flex-1 flex-col justify-around gap-8 md:mt-10">
              {METRICS.map((m, i) => (
                <div
                  key={m.label}
                  className="flex items-center gap-5 lg:gap-6"
                >
                  <dt className="min-w-[4.5ch] font-body text-4xl font-light text-linen md:text-5xl">
                    <Counter
                      to={m.value}
                      suffix={m.suffix}
                      start={inView}
                      delay={500 + i * 250}
                    />
                  </dt>
                  <dd className="max-w-[28ch] font-body text-xs leading-relaxed text-linen/65 md:text-sm">
                    {m.label}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* Happy clients */}
          <motion.div
            {...tile(3)}
            className="flex min-h-[160px] items-center rounded-2xl bg-[#1f1f1e] p-7 md:col-span-4 md:min-h-0 md:p-8 lg:col-span-3"
          >
            <p className="font-body text-lg text-linen/85 md:text-xl">
              Happy clients worldwide
            </p>
          </motion.div>

          {/* 24/7 chat */}
          <motion.div
            {...tile(4)}
            className="min-h-[220px] rounded-2xl border border-linen/80 bg-[#0a0a06] p-6 md:col-span-4 md:min-h-0 lg:col-span-4"
          >
            <ChatCard active={inView} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}