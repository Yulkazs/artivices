"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

type Tier = {
  name: string;
  meta: string; // pages / scope line
  prefix?: string;
  from: number;
  to?: number;
  unit?: string;
  features?: string[];
};

const WEBSITE: Tier[] = [
  {
    name: "Starter",
    meta: "1–4 pages",
    from: 1000,
    to: 1500,
    features: [
      "Custom design",
      "Responsive",
      "Contact form",
      "Basic SEO",
      "Cookie & privacy basics",
      "2 revision rounds",
    ],
  },
  {
    name: "Business",
    meta: "5–8 pages",
    from: 1750,
    to: 2750,
    features: [
      "Custom design",
      "Responsive",
      "Contact forms",
      "SEO basics",
      "CMS",
      "Google Analytics & Search Console",
      "2–3 revision rounds",
    ],
  },
  {
    name: "Professional",
    meta: "9–15 pages",
    from: 3000,
    to: 4500,
    features: [
      "Fully custom design",
      "Advanced animations & interactions",
      "Extended SEO",
      "Blog, portfolio & case studies",
      "CMS",
      "Conversion optimization",
      "3 revision rounds",
    ],
  },
  {
    name: "Custom",
    meta: "15+ pages",
    prefix: "from",
    from: 4500,
    features: [
      "Built around your requirements",
      "Scope defined together",
      "Final quote after scoping",
    ],
  },
];

const BRANDING: Tier[] = [
  { name: "Logos", meta: "Logo design", from: 50, to: 350 },
  { name: "Business", meta: "Brand essentials", from: 350, to: 500 },
  { name: "Professional", meta: "Full brand identity", from: 750, to: 1000 },
];

const CARE_FEATURES = [
  "Fast hosting",
  "SSL certificate",
  "Back-ups",
  "Technical monitoring",
  "Domain management",
  "CMS & plugin updates",
  "Security updates",
  "Small technical fixes",
  "Up to 30 min of changes per month",
];

const TABS = [
  { id: "website", label: "Website" },
  { id: "branding", label: "Branding" },
  { id: "care", label: "Hosting + Care" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const EASE = [0.22, 1, 0.36, 1] as const;

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const fmt = (n: number) => n.toLocaleString("en-US");

/** Counts up to `to` the first time it scrolls into view. */
function CountUp({ to, delay = 0 }: { to: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVal(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.4,
      delay,
      ease: EASE,
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, delay, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {fmt(val)}
    </span>
  );
}

/** Card with a soft spotlight that follows the cursor. */
function Card({
  children,
  className = "",
  index = 0,
}: {
  children: React.ReactNode;
  className?: string;
  index?: number;
}) {
  const reduce = useReducedMotion();

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: -12 }}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.09 }}
      className={`group relative overflow-hidden rounded-2xl border border-ink-line bg-ink-soft p-7 transition-colors duration-500 hover:border-clay/40 md:p-8 ${className}`}
    >
      {/* cursor spotlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(201,189,163,0.10), transparent 60%)",
        }}
      />
      <div className="relative flex h-full flex-col">{children}</div>
    </motion.div>
  );
}

function Price({ tier, delay = 0 }: { tier: Tier; delay?: number }) {
  return (
    <div>
      <div className="flex items-baseline gap-2 text-linen">
        {tier.prefix && (
          <span className="font-body text-sm text-linen-dim">{tier.prefix}</span>
        )}
        <span className="font-body text-4xl font-light md:text-5xl">
          €<CountUp to={tier.from} delay={delay} />
        </span>
        {tier.unit && (
          <span className="font-body text-sm text-linen-dim">{tier.unit}</span>
        )}
      </div>
      {tier.to && (
        <p className="mt-1 font-body text-sm text-linen-dim">
          up to €{fmt(tier.to)}
        </p>
      )}
    </div>
  );
}

function Check() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="mt-[3px] h-3.5 w-3.5 shrink-0 text-clay"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8.5l3.2 3L13 4.5" />
    </svg>
  );
}

function FeatureList({
  items,
  columns = false,
}: {
  items: string[];
  columns?: boolean;
}) {
  return (
    <motion.ul
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } } }}
      className={`mt-7 border-t border-ink-line pt-6 font-body text-sm text-linen/80 ${
        columns ? "grid gap-x-8 gap-y-3 sm:grid-cols-2" : "space-y-3"
      }`}
    >
      {items.map((f) => (
        <motion.li
          key={f}
          variants={{
            hidden: { opacity: 0, x: -8 },
            show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
          }}
          className="flex gap-2.5"
        >
          <Check />
          <span>{f}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
}

/* -------------------------------------------------------------------------- */
/*  Panels                                                                    */
/* -------------------------------------------------------------------------- */

function TierCard({ tier, index }: { tier: Tier; index: number }) {
  return (
    <Card index={index}>
      <div className="mb-8">
        <h3 className="font-body text-xl text-linen">{tier.name}</h3>
        <p className="mt-1 font-body text-sm text-linen-dim">{tier.meta}</p>
      </div>
      <Price tier={tier} delay={index * 0.09} />
      {tier.features && <FeatureList items={tier.features} />}
    </Card>
  );
}

function WebsitePanel() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
      {WEBSITE.map((t, i) => (
        <TierCard key={t.name} tier={t} index={i} />
      ))}
    </div>
  );
}

function BrandingPanel() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
      {BRANDING.map((t, i) => (
        <TierCard key={t.name} tier={t} index={i} />
      ))}
    </div>
  );
}

function CarePanel() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
      <Card index={0} className="md:col-span-8">
        <div className="mb-8">
          <h3 className="font-body text-xl text-linen">Hosting + Care</h3>
          <p className="mt-1 font-body text-sm text-linen-dim">
            We keep your site fast, safe and up to date
          </p>
        </div>
        <Price
          tier={{ name: "Care", meta: "", from: 50, unit: "/ month" }}
        />
        <FeatureList items={CARE_FEATURES} columns />
      </Card>

      <Card index={1} className="md:col-span-4">
        <div className="mb-8">
          <h3 className="font-body text-xl text-linen">Hosting only</h3>
          <p className="mt-1 font-body text-sm text-linen-dim">
            Just the hosting, without the care
          </p>
        </div>
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 text-linen">
            <span className="font-body text-4xl font-light md:text-5xl">
              €<CountUp to={20} delay={0.1} />
            </span>
            <span className="font-body text-sm text-linen-dim">
              – €30 / month
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function Pricing() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<TabId>("website");

  return (
    <section
      ref={ref}
      id="pricing"
      className="bg-ink px-5 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-content">
        {/* Heading + tabs */}
        <div className="mb-10 flex flex-col gap-8 md:mb-14 md:flex-row md:items-end md:justify-between">
          <motion.h2
            className="max-w-[16ch] font-body text-4xl leading-[1.1] text-linen md:text-5xl"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, ease: EASE }}
          >
            Pricing that{" "}
            <span className="font-accent text-[1.15em] italic">scales</span>{" "}
            with you
          </motion.h2>

          <motion.div
            role="tablist"
            aria-label="Pricing categories"
            className="flex w-full gap-1 self-start rounded-full border border-ink-line bg-ink-soft p-1 md:w-auto"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
          >
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className={`relative flex-1 whitespace-nowrap rounded-full px-4 py-2 font-body text-sm transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay md:flex-none md:px-5 ${
                    active ? "text-ink" : "text-linen-dim hover:text-linen"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="pricing-pill"
                      className="absolute inset-0 rounded-full bg-clay"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Panels */}
        <div role="tabpanel">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {inView && tab === "website" && <WebsitePanel />}
              {inView && tab === "branding" && <BrandingPanel />}
              {inView && tab === "care" && <CarePanel />}
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.p
          className="mt-8 font-body text-sm text-linen-faint"
          initial={reduce ? false : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          All prices are indicative.
        </motion.p>
      </div>
    </section>
  );
}