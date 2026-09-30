"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";


// TODO: reviews 2–4 are placeholders. Replace with real client quotes.
const REVIEWS = [
  {
    quote:
      "They asked harder questions about our business than most of our own hires do. The site that came out of it still feels like the sharpest thing we own.",
    name: "Priya Nandan",
    role: "Founder",
    company: "Coastal Freight Co.",
  },
  {
    quote:
      "Our product finally makes sense in the time it takes to scroll once. The pricing page and docs do the explaining so our team doesn't have to.",
    name: "Daan Verhoeven",
    role: "Head of Marketing",
    company: "Northlight Software",
  },
  {
    quote:
      "The identity they delivered works everywhere, from the homepage to the business card in my pocket. Calm process, clear communication, no surprises.",
    name: "Sanne de Wit",
    role: "Managing Director",
    company: "Kade Interiors",
  },
  {
    quote:
      "The partner portal is something our team actually opens every day. Scoped tightly, delivered on time and handed over properly.",
    name: "Marc Jansen",
    role: "Operations Lead",
    company: "Hexa Logistics",
  },
];

const ROTATE_MS = 7000;

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

const EASE = [0.22, 1, 0.36, 1] as const;

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-clay" aria-hidden>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ClientsCard({
  inView,
  index,
  onSelect,
}: {
  inView: boolean;
  index: number;
  onSelect: (i: number) => void;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="flex h-full flex-col justify-between gap-8">
      {/* Avatar stack */}
      <div className="flex items-center pl-1">
        {REVIEWS.map((r, i) => {
          const active = i === index;
          return (
            <motion.span
              key={r.name}
              className="-ml-3 first:ml-0"
              style={{ zIndex: active ? 10 : REVIEWS.length - i }}
              initial={reduce ? false : { opacity: 0, scale: 0.4, x: -12 }}
              animate={inView ? { opacity: 1, scale: 1, x: 0 } : undefined}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.5 + i * 0.1,
              }}
            >
              <motion.button
                type="button"
                onClick={() => onSelect(i)}
                aria-label={`Show review from ${r.name}, ${r.company}`}
                aria-pressed={active}
                animate={{ y: active ? -6 : 0, scale: active ? 1.12 : 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink-soft font-body text-xs font-medium transition-colors duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay md:h-12 md:w-12 ${
                  active
                    ? "bg-clay text-ink"
                    : "bg-linen/15 text-linen hover:bg-linen/25"
                }`}
              >
                {initials(r.name)}
              </motion.button>
            </motion.span>
          );
        })}
      </div>

      <div>
        <div className="mb-3 flex gap-1" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              initial={reduce ? false : { opacity: 0, scale: 0, rotate: -40 }}
              animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 16,
                delay: 0.9 + i * 0.1,
              }}
            >
              {/* subtle twinkle that repeats every few seconds */}
              <motion.span
                className="block"
                animate={
                  reduce || !inView ? undefined : { scale: [1, 1.3, 1] }
                }
                transition={{
                  duration: 0.6,
                  delay: 2.4 + i * 0.15,
                  repeat: Infinity,
                  repeatDelay: 7,
                  ease: "easeInOut",
                }}
              >
                <Star />
              </motion.span>
            </motion.span>
          ))}
        </div>
        <p className="font-body text-lg text-linen/85 md:text-xl">
          Happy clients worldwide
        </p>
      </div>
    </div>
  );
}

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
  // 0 idle · 1 typing #1 · 2 msg #1 · 3 typing #2 · 4 msg #2
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (reduce) {
      setStep(4);
      return;
    }

    const timers: number[] = [];
    const at = (ms: number, fn: () => void) =>
      timers.push(window.setTimeout(fn, ms));

    const play = () => {
      setStep(0);
      at(900, () => setStep(1));
      at(1900, () => setStep(2));
      at(2900, () => setStep(3));
      at(4000, () => setStep(4));
      at(9500, () => setStep(0)); // hold, then clear the chat
      at(11000, play); // pause, then replay
    };
    play();

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [active, reduce]);

  const typingFirst = step === 1;
  const showFirst = step >= 2;
  const typingSecond = step === 3;
  const showSecond = step >= 4;

  const bubble =
    "rounded-2xl bg-[#e4e4e4] px-3 py-1.5 font-body text-xs text-[#0c0a07]";

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
        aria-label="Support chat preview"
      >
        <div className="flex min-h-[36px] items-end">
          <AnimatePresence>
            {(typingFirst || showFirst) && (
              <motion.div
                key="m1"
                className="flex items-end gap-2"
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4, ease: EASE }}
                style={{ transformOrigin: "left bottom" }}
              >
                <Avatar />
                <div className={`${bubble} rounded-bl-sm`}>
                  {typingFirst ? <TypingDots /> : "Hey there!"}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex min-h-[36px] items-end justify-end">
          <AnimatePresence>
            {(typingSecond || showSecond) && (
              <motion.div
                key="m2"
                className="flex items-end gap-2"
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4, ease: EASE }}
                style={{ transformOrigin: "right bottom" }}
              >
                <div className={`${bubble} rounded-br-sm`}>
                  {typingSecond ? <TypingDots /> : "How can I help you?"}
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

export default function Testimonial() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const reduce = useReducedMotion();

  // Rotation: one shared index drives the quote and the avatar stack.
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const elapsed = useRef(0);
  const progress = useMotionValue(0);

  useAnimationFrame((_, delta) => {
    if (!inView || paused) return;
    elapsed.current += Math.min(delta, 100);
    const p = Math.min(elapsed.current / ROTATE_MS, 1);
    progress.set(p);
    if (p >= 1) {
      elapsed.current = 0;
      progress.set(0);
      setIndex((i) => (i + 1) % REVIEWS.length);
    }
  });

  const goTo = (i: number) => {
    elapsed.current = 0;
    progress.set(0);
    setIndex(i);
  };

  const tile = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.8, ease: EASE, delay: 0.12 * i },
  });

  const review = REVIEWS[index];

  return (
    <section
      ref={ref}
      id="testimonials"
      className="bg-ink px-5 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-content">
        <motion.h2
          className="mb-10 max-w-[14ch] font-body text-4xl leading-[1.1] text-linen md:mb-14 md:text-5xl"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, ease: EASE }}
        >
          Proof that{" "}
          <span className="font-display text-[1.15em]">Speaks</span> volumes
        </motion.h2>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:grid-rows-[repeat(2,minmax(0,1fr))] md:gap-4">
          {/* Rotating quote */}
          <motion.figure
            {...tile(1)}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="relative flex min-h-[300px] flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-[#dcdcdc] via-[#cfcbc8] to-[#b9b2aa] p-7 md:col-span-8 md:min-h-[330px] md:p-10 lg:col-span-7"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={index}
                className="flex flex-1 flex-col justify-between"
                initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <blockquote className="m-auto max-w-[34ch] text-center font-body text-lg font-medium leading-snug text-[#0c0a07] md:text-2xl">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 text-right font-body text-[#0c0a07]">
                  <span className="block text-sm font-medium md:text-base">
                    {review.name}
                  </span>
                  <span className="block text-xs text-[#0c0a07]/70 md:text-sm">
                    {review.role}, {review.company}
                  </span>
                </figcaption>
              </motion.div>
            </AnimatePresence>

            {/* progress to next review */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-[3px] bg-[#0c0a07]/10"
            >
              <motion.span
                style={{ scaleX: progress }}
                className="block h-full origin-left bg-[#0c0a07]/60"
              />
            </div>
          </motion.figure>

          {/* Metrics */}
          <motion.div
            {...tile(2)}
            className="flex flex-col rounded-2xl bg-ink-soft p-7 md:col-span-4 md:row-span-2 md:p-8 lg:col-span-5"
          >
            <h3 className="font-body text-lg leading-snug text-linen/90 md:text-xl">
              Metrics that{" "}
              <span className="font-display text-[1.15em]">Prove</span>
              <br />
              value
            </h3>

            <dl className="mt-8 flex flex-1 flex-col justify-around gap-8 md:mt-10">
              {METRICS.map((m, i) => (
                <div key={m.label} className="flex items-center gap-5 lg:gap-6">
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

          {/* Clients */}
          <motion.div
            {...tile(3)}
            className="min-h-[200px] rounded-2xl bg-ink-soft p-7 md:col-span-4 md:min-h-0 md:p-8 lg:col-span-3"
          >
            <ClientsCard inView={inView} index={index} onSelect={goTo} />
          </motion.div>

          {/* 24/7 chat */}
          <motion.div
            {...tile(4)}
            className="min-h-[220px] rounded-2xl border border-linen/80 bg-ink p-6 md:col-span-4 md:min-h-0 lg:col-span-4"
          >
            <ChatCard active={inView} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}