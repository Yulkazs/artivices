"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";

type Tier = {
  name: string;
  meta: string;
  prefix?: string;
  from: number;
  to?: number;
  unit?: string;
  popular?: boolean;
  idealFor?: string[]; // maps to the "What we build" section
  features?: string[];
  copyright?: { included: boolean; note: string };
};

const WEBSITE: Tier[] = [
  {
    name: "Starter",
    meta: "1–4 pages",
    from: 1000,
    to: 1500,
    idealFor: ["Landing pages", "Small brand sites"],
    features: [
      "Custom design",
      "Responsive",
      "Contact form",
      "Basic SEO",
      "Cookie & privacy basics",
      "2 revision rounds",
    ],
    copyright: {
      included: false,
      note: "Stays with the studio. Transfer to your company is available for an additional fee.",
    },
  },
  {
    name: "Business",
    meta: "5–8 pages",
    from: 1750,
    to: 2750,
    popular: true,
    idealFor: ["Brand websites"],
    features: [
      "Custom design",
      "Responsive",
      "Contact forms",
      "SEO basics",
      "CMS",
      "Google Analytics & Search Console",
      "2–3 revision rounds",
    ],
    copyright: {
      included: false,
      note: "Stays with the studio. Optional transfer to your company for a small fee.",
    },
  },
  {
    name: "Professional",
    meta: "9–15 pages",
    from: 3000,
    to: 4500,
    idealFor: ["Brand websites", "Product & SaaS"],
    features: [
      "Fully custom design",
      "Advanced animations & interactions",
      "Extended SEO",
      "Blog, portfolio & case studies",
      "CMS",
      "Conversion optimization",
      "3 revision rounds",
    ],
    copyright: {
      included: true,
      note: "Transferred to your company as standard.",
    },
  },
  {
    name: "Custom",
    meta: "15+ pages",
    prefix: "from",
    from: 4500,
    idealFor: ["Commerce storefronts", "Internal & partner portals"],
    features: [
      "Commerce: product pages, checkout & inventory sync",
      "Portals: dashboards, access control & reporting",
      "Product & SaaS: docs, onboarding & integrations",
      "Scope and quote defined together",
    ],
    copyright: {
      included: true,
      note: "Transferred to your company as standard.",
    },
  },
];

const BRANDING: Tier[] = [
  {
    name: "Logos",
    meta: "Logo design",
    from: 50,
    to: 350,
    features: [
      "Primary logo",
      "Secondary logo",
      "Full-color, black and white versions",
      "Transparent background versions",
      "Icon only",
      "Icon + company name",
      "Company name below the icon",
      "Extra variations tailored to your brand",
    ],
  },
  {
    name: "Business",
    meta: "Visual identity & essentials",
    from: 350,
    to: 500,
    features: [
      "Everything in Logos",
      "Color palette & typography",
      "Business card design",
      "Flyer design",
      "NFC business card available",
    ],
  },
  {
    name: "Professional",
    meta: "Complete brand system",
    from: 750,
    to: 1000,
    features: [
      "Everything in Business",
      "Complete visual identity",
      "Brand guidelines document",
      "Extended collateral set",
      "NFC business card available",
    ],
  },
];

const CARE_FEATURES = [
  {
    title: "Fast, reliable hosting",
    desc: "Your site runs on infrastructure built for speed and uptime.",
  },
  {
    title: "SSL certificate",
    desc: "Encrypted HTTPS connection for every visitor.",
  },
  {
    title: "Back-ups",
    desc: "Regular back-ups so your site can be restored when needed.",
  },
  {
    title: "Technical monitoring",
    desc: "Continuous checks on availability and performance.",
  },
  {
    title: "Domain management",
    desc: "Registration and renewal handled for you.",
  },
  {
    title: "CMS & plugin updates",
    desc: "Kept current and compatible with your site.",
  },
  {
    title: "Security updates",
    desc: "Patches applied promptly to keep vulnerabilities closed.",
  },
  {
    title: "Small technical fixes",
    desc: "Minor issues resolved without a separate quote.",
  },
  {
    title: "Up to 30 min of changes per month",
    desc: "Content and small adjustments, included every month.",
  },
];

const TABS = [
  { id: "website", label: "Website" },
  { id: "branding", label: "Branding" },
  { id: "care", label: "Hosting + Care" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const EASE = [0.22, 1, 0.36, 1] as const;
const fmt = (n: number) => n.toLocaleString("en-US");

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

function Card({
  children,
  className = "",
  index = 0,
  featured = false,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
  featured?: boolean;
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
      className={`group relative overflow-hidden rounded-2xl border p-7 transition-colors duration-500 md:p-8 ${
        featured
          ? "border-clay/60 bg-gradient-to-b from-clay/[0.12] to-ink-soft hover:border-clay"
          : "border-ink-line bg-ink-soft hover:border-clay/40"
      } ${className}`}
    >
      {/* featured: slow breathing glow */}
      {featured && !reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-64 -translate-x-1/2 rounded-full bg-clay/25 blur-3xl"
          animate={{ opacity: [0.35, 0.8, 0.35] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* cursor spotlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 text-clay opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, currentColor 14%, transparent), transparent 60%)",
        }}
      />
      <div className="relative flex h-full flex-col">{children}</div>
    </motion.div>
  );
}

function PopularBadge() {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 20 }}
      className="absolute right-0 top-0 inline-flex items-center gap-1.5 rounded-full bg-clay px-3 py-1 font-body text-xs font-medium text-ink"
    >
      <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      Most popular
    </motion.span>
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

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

function FeatureList({ items }: { items: string[] }) {
  return (
    <motion.ul
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={listVariants}
      className="mt-7 space-y-3 border-t border-ink-line pt-6 font-body text-sm text-linen/80"
    >
      {items.map((f) => (
        <motion.li key={f} variants={itemVariants} className="flex gap-2.5">
          <Check />
          <span>{f}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
}

function CopyrightNote({
  included,
  note,
}: {
  included: boolean;
  note: string;
}) {
  return (
    <div
      className={`mt-auto rounded-xl border p-3.5 ${
        included
          ? "border-clay/40 bg-clay/[0.08]"
          : "border-ink-line bg-ink/60"
      }`}
    >
      <div className="mb-1.5 flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-body text-xs font-medium uppercase tracking-wider text-linen/90">
          <span
            aria-hidden
            className="flex h-4 w-4 items-center justify-center rounded-full border border-current text-[9px] leading-none"
          >
            c
          </span>
          Copyright
        </span>
        {included && (
          <span className="font-body text-[11px] text-clay">Included</span>
        )}
      </div>
      <p className="font-body text-xs leading-relaxed text-linen-dim">{note}</p>
    </div>
  );
}

function TierCard({ tier, index }: { tier: Tier; index: number }) {
  return (
    <Card index={index} featured={tier.popular}>
      {tier.popular && <PopularBadge />}

      <div className="mb-8">
        <h3 className="font-body text-xl text-linen">{tier.name}</h3>
        <p className="mt-1 font-body text-sm text-linen-dim">{tier.meta}</p>
      </div>

      <Price tier={tier} delay={index * 0.09} />

      {tier.idealFor && (
        <div className="mt-6">
          <p className="mb-2 font-body text-[11px] uppercase tracking-wider text-linen-faint">
            Ideal for
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tier.idealFor.map((t) => (
              <span
                key={t}
                className="rounded-full border border-ink-line px-2.5 py-1 font-body text-xs text-linen/80"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {tier.features && <FeatureList items={tier.features} />}

      {tier.copyright && (
        <div className="mt-7 flex flex-1 flex-col justify-end">
          <CopyrightNote {...tier.copyright} />
        </div>
      )}
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
          <p className="mt-1 max-w-[46ch] font-body text-sm text-linen-dim">
            Fully managed hosting, maintenance and security, so your website
            stays fast, secure and up to date.
          </p>
        </div>

        <Price tier={{ name: "Care", meta: "", from: 50, unit: "/ month" }} />

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={listVariants}
          className="mt-7 grid gap-x-8 gap-y-5 border-t border-ink-line pt-6 sm:grid-cols-2"
        >
          {CARE_FEATURES.map((f) => (
            <motion.li
              key={f.title}
              variants={itemVariants}
              className="flex gap-2.5"
            >
              <Check />
              <span>
                <span className="block font-body text-sm text-linen">
                  {f.title}
                </span>
                <span className="block font-body text-xs leading-relaxed text-linen-dim">
                  {f.desc}
                </span>
              </span>
            </motion.li>
          ))}
        </motion.ul>

        <p className="mt-7 border-t border-ink-line pt-5 font-body text-xs text-linen-dim">
          Every website includes thirty days of support after go-live.
        </p>
      </Card>

      <Card index={1} className="md:col-span-4">
        <div className="mb-8">
          <h3 className="font-body text-xl text-linen">Hosting only</h3>
          <p className="mt-1 font-body text-sm text-linen-dim">
            Managed hosting for teams that handle site maintenance themselves.
          </p>
        </div>

        <div className="flex items-baseline gap-2 text-linen">
          <span className="font-body text-4xl font-light md:text-5xl">
            €<CountUp to={20} delay={0.1} />
          </span>
          <span className="font-body text-sm text-linen-dim">
            – €30 / month
          </span>
        </div>

        <FeatureList items={["Fast, reliable hosting", "SSL certificate"]} />
      </Card>
    </div>
  );
}

function ContactCard() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="relative mt-3 overflow-hidden rounded-2xl border border-ink-line bg-ink-soft p-7 md:mt-4 md:p-10"
    >
      {/* drifting glow */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-clay/20 blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, 30, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-[52ch]">
          <h3 className="font-body text-2xl text-linen md:text-3xl">
            Not sure which package fits?
          </h3>
          <p className="mt-3 font-body text-sm leading-relaxed text-linen/70 md:text-base">
            Every project is different, and so is every budget. Our prices are
            a starting point and always open for discussion. Tell us about your
            project and we&apos;ll shape a proposal around it.
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3">
          <Link
            href="/contact"
            className="group/cta inline-flex items-center gap-2.5 rounded-full bg-clay px-6 py-3 font-body text-sm font-medium text-ink transition-transform duration-300 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
          >
            Discuss your project
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover/cta:translate-x-1"
            >
              →
            </span>
          </Link>
          <p className="font-body text-xs text-linen-dim">
            Or email{" "}
            <a
              href="mailto:studio@artivices.com"
              className="text-linen underline-offset-4 hover:underline"
            >
              studio@artivices.com
            </a>{" "}
            · We reply within two working days.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

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
        <div className="mb-10 flex flex-col gap-8 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.h2
              className="max-w-[16ch] font-body text-4xl leading-[1.1] text-linen md:text-5xl"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8, ease: EASE }}
            >
              Pricing that{" "}
              <span className="font-display text-[1.15em]">scales</span> with
              you
            </motion.h2>
            <motion.p
              className="mt-4 max-w-[52ch] font-body text-sm leading-relaxed text-linen/65 md:text-base"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            >
              From a focused landing page to a full portal, every project starts
              from one of these packages. Final pricing depends on scope.
            </motion.p>
          </div>

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

        <ContactCard />
      </div>
    </section>
  );
}