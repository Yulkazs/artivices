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

/* Every "Start with …" and "Discuss your project" button opens the request form.
   With a package id the form opens with that package selected; without one the
   customer chooses it there. Ids live in lib/packages.ts. */
const startHref = (packageId?: string) =>
  `/start?${packageId ? `package=${packageId}&` : ""}from=pricing`;

type Tier = {
  name: string;
  pages?: string; // shown as the first line of "What you get"
  meta?: string; // small subtitle under the name (when there is no page count)
  prefix?: string;
  from: number;
  to?: number;
  unit?: string;
  popular?: boolean;
  idealFor?: string[]; // maps to the "What we build" section
  features?: string[];
};

const WEBSITE: Tier[] = [
  {
    name: "Starter",
    pages: "1–4 pages",
    from: 1000,
    to: 1500,
    idealFor: ["Landing Pages", "Small Brand Sites"],
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
    pages: "5–8 pages",
    from: 1750,
    to: 2750,
    popular: true,
    idealFor: ["Brand Websites"],
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
    pages: "9–15 pages",
    from: 3000,
    to: 4500,
    idealFor: ["Brand Websites", "Product & SaaS"],
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
];

const CUSTOM = { name: "Custom", from: 4500 };

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
    name: "Identity",
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
    name: "Signature",
    meta: "Complete brand system",
    from: 750,
    to: 1000,
    features: [
      "Everything in Identity",
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

/* Design colors for the package cards */
const FEATURED_BG =
  "linear-gradient(165deg, #d9d9d9 0%, #cfcbc8 30%, #c4bab3 58%, #b3a89b 100%)";

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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.09 }}
      style={featured ? { backgroundImage: FEATURED_BG } : undefined}
      className={`group relative overflow-hidden rounded-2xl border p-6 transition-colors duration-500 md:p-7 ${
        featured
          ? "border-[#d9d9d9] text-ink"
          : "border-[#d9d9d9]/80 text-[#d9d9d9] hover:border-clay"
      } ${className}`}
    >
      {/* cursor spotlight */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${
          featured ? "text-white" : "text-clay"
        }`}
        style={{
          background:
            "radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, currentColor 18%, transparent), transparent 60%)",
        }}
      />
      <div className="relative flex h-full flex-col">{children}</div>
    </motion.div>
  );
}

function PopularBadge() {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 20 }}
      className="shrink-0 rounded-full bg-[#ADA092] px-4 py-1.5 font-body text-sm text-ink"
    >
      Most Popular
    </motion.span>
  );
}

function Price({ tier, delay = 0 }: { tier: Tier; delay?: number }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      {tier.prefix && (
        <span className="font-body text-sm opacity-60">{tier.prefix}</span>
      )}
      <span
        className="font-body text-4xl font-light md:text-5xl"
        style={{ textShadow: "0 6px 12px rgba(0,0,0,0.22)" }}
      >
        €<CountUp to={tier.from} delay={delay} />
      </span>
      {tier.to && (
        <span className="font-body text-sm opacity-60">– €{fmt(tier.to)}</span>
      )}
      {tier.unit && (
        <span className="font-body text-sm opacity-60">{tier.unit}</span>
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

function PlainList({
  items,
  featured,
}: {
  items: string[];
  featured: boolean;
}) {
  return (
    <motion.ul
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={listVariants}
      className={`mt-5 space-y-2.5 font-body text-sm md:text-base ${
        featured ? "text-ink/90" : "text-[#d9d9d9]/80"
      }`}
    >
      {items.map((f) => (
        <motion.li key={f} variants={itemVariants}>
          {f}
        </motion.li>
      ))}
    </motion.ul>
  );
}

function StartButton({
  name,
  featured,
  label,
  packageId,
}: {
  name: string;
  featured: boolean;
  label?: string;
  packageId?: string;
}) {
  return (
    <Link
      href={startHref(packageId)}
      className={`group/cta relative flex w-full items-center justify-between rounded-lg py-3.5 pl-6 pr-4 font-body text-base transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay md:text-lg ${
        featured
          ? "bg-[#57534a] text-[#d9d9d9] hover:bg-[#46433b]"
          : "bg-[#d9d9d9]/10 text-[#d9d9d9] hover:bg-[#d9d9d9]/20"
      }`}
    >
      <span
        aria-hidden
        className={`absolute left-2 top-1/2 h-[68%] w-[2px] -translate-y-1/2 rounded-full transition-transform duration-300 group-hover/cta:scale-y-125 ${
          featured ? "bg-[#d9d9d9]/80" : "bg-[#ADA092]"
        }`}
      />
      <span>{label ?? `Start with ${name}`}</span>
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="h-5 w-5 transition-transform duration-300 group-hover/cta:translate-x-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 3l5 5-5 5" />
      </svg>
    </Link>
  );
}

function TierCard({
  tier,
  index,
  category,
  className = "",
}: {
  tier: Tier;
  index: number;
  category: "website" | "branding";
  className?: string;
}) {
  const featured = !!tier.popular;
  const items = [tier.pages, ...(tier.features ?? [])].filter(
    Boolean,
  ) as string[];

  return (
    <Card index={index} featured={featured} className={className}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-logo text-3xl leading-none md:text-4xl">
            {tier.name}
          </h3>
          {tier.meta && (
            <p className="mt-2 font-body text-sm opacity-60">{tier.meta}</p>
          )}
        </div>
        {featured && <PopularBadge />}
      </div>

      <div className="mt-12 md:mt-14">
        <Price tier={tier} delay={index * 0.09} />

        {tier.idealFor && (
          <>
            <p className="mt-6 font-body text-sm opacity-70 md:text-base">
              Ideal for
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tier.idealFor.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-current px-4 py-1.5 font-body text-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-12">
        <h4 className="font-body text-lg font-medium md:text-xl">
          What you get
        </h4>
        <PlainList items={items} featured={featured} />
      </div>

      <div className="mt-auto pt-10">
        <StartButton
          name={tier.name}
          featured={featured}
          packageId={`${category}-${tier.name.toLowerCase()}`}
        />
      </div>
    </Card>
  );
}

function WebsitePanel() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
      {WEBSITE.map((t, i) => (
        <TierCard
          key={t.name}
          tier={t}
          index={i}
          category="website"
          className={i === 2 ? "md:col-span-2 lg:col-span-1" : ""}
        />
      ))}
    </div>
  );
}

function BrandingPanel() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
      {BRANDING.map((t, i) => (
        <TierCard key={t.name} tier={t} index={i} category="branding" />
      ))}
    </div>
  );
}

function CarePanel() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
      <Card index={0} className="md:col-span-8">
        <div className="mb-8">
          <h3 className="font-logo text-3xl leading-none md:text-4xl">
            Hosting + Care
          </h3>
          <p className="mt-3 max-w-[46ch] font-body text-sm opacity-70">
            Fully managed hosting, maintenance and security, so your website
            stays fast, secure and up to date.
          </p>
        </div>

        <Price tier={{ name: "Care", from: 50, unit: "/ month" }} />

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={listVariants}
          className="mt-7 grid gap-x-8 gap-y-5 border-t border-[#d9d9d9]/20 pt-6 sm:grid-cols-2"
        >
          {CARE_FEATURES.map((f) => (
            <motion.li
              key={f.title}
              variants={itemVariants}
              className="flex gap-2.5"
            >
              <Check />
              <span>
                <span className="block font-body text-sm">{f.title}</span>
                <span className="block font-body text-xs leading-relaxed opacity-60">
                  {f.desc}
                </span>
              </span>
            </motion.li>
          ))}
        </motion.ul>

        <p className="mt-7 border-t border-[#d9d9d9]/20 pt-5 font-body text-xs opacity-60">
          Every website includes thirty days of support after go-live.
        </p>

        <div className="mt-auto pt-8">
          <StartButton name="Hosting + Care" featured={false} packageId="care-hosting-care" />
        </div>
      </Card>

      <Card index={1} className="md:col-span-4">
        <div className="mb-8">
          <h3 className="font-logo text-3xl leading-none md:text-4xl">
            Hosting only
          </h3>
          <p className="mt-3 font-body text-sm opacity-70">
            Managed hosting for teams that handle site maintenance themselves.
          </p>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-2">
          <span
            className="font-body text-4xl font-light md:text-5xl"
            style={{ textShadow: "0 6px 12px rgba(0,0,0,0.22)" }}
          >
            €<CountUp to={20} delay={0.1} />
          </span>
          <span className="font-body text-sm opacity-60">– €30 / month</span>
        </div>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={listVariants}
          className="mt-7 space-y-2.5 border-t border-[#d9d9d9]/20 pt-6 font-body text-sm"
        >
          {["Fast, reliable hosting", "SSL certificate"].map((f) => (
            <motion.li key={f} variants={itemVariants} className="flex gap-2.5">
              <Check />
              <span>{f}</span>
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-auto pt-8">
          <StartButton name="Hosting only" featured={false} packageId="care-hosting-only" />
        </div>
      </Card>
    </div>
  );
}

function NotSureCard({ compact }: { compact: boolean }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="flex rounded-3xl bg-[#22201E] p-7 md:p-10"
    >
      <div
        className={`flex w-full flex-col gap-8 ${
          compact
            ? "justify-between"
            : "md:flex-row md:items-center md:justify-between md:gap-12"
        }`}
      >
        <div className="max-w-[58ch]">
          <h3 className="font-body text-2xl text-linen md:text-3xl">
            Not sure which package fits?
          </h3>
          <p className="mt-5 font-body text-base leading-relaxed text-linen/90 md:mt-8 md:text-lg md:leading-relaxed">
            Every project is different, and so is every budget. Our prices are
            a starting point and always open for discussion. Tell us about your
            project and we&apos;ll shape a proposal around it.
          </p>
        </div>

        <Link
          href={startHref()}
          className="group/cta inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-full bg-[#ADA092] px-7 py-3.5 font-body text-base text-ink transition-all duration-300 hover:bg-clay-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay md:px-8 md:py-4 md:text-lg"
        >
          Discuss your project
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            className="h-5 w-5 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12L12 4M5.5 4H12v6.5" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}

function CustomCard() {
  return (
    <Card index={3} className="md:p-10">
      <h3 className="font-logo text-3xl leading-none md:text-4xl">
        {CUSTOM.name}
      </h3>

      <div className="mt-8">
        <Price
          tier={{ name: CUSTOM.name, prefix: "from", from: CUSTOM.from }}
          delay={0.3}
        />
      </div>

      <p className="mt-6 max-w-[48ch] font-body text-sm leading-relaxed opacity-75 md:text-base md:leading-relaxed">
        Need more than the packages above? Whether you need extra pages,
        specific features or a larger scope, we&apos;ll build a custom quote
        around your project. Tell us what you have in mind and we&apos;ll come
        back with a clear proposal.
      </p>

      <div className="mt-auto pt-10">
        <StartButton
          name={CUSTOM.name}
          featured={false}
          label="Contact us for a custom quote"
          packageId="website-custom"
        />
      </div>
    </Card>
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
              <span className="font-logo text-[1.15em]">scales</span> with
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
            className="flex w-full gap-1 self-start rounded-full border border-ink-line bg-[#22201E] p-1 md:w-auto"
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
                      className="absolute inset-0 rounded-full bg-[#ADA092]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Panels are always in the HTML (good for SEO); each card reveals
            itself as it scrolls into view. */}
        <div role="tabpanel">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {tab === "website" && <WebsitePanel />}
              {tab === "branding" && <BrandingPanel />}
              {tab === "care" && <CarePanel />}
            </motion.div>
          </AnimatePresence>
        </div>

        {tab === "website" ? (
          <div className="mt-3 grid grid-cols-1 gap-3 md:mt-4 md:grid-cols-2 md:gap-4">
            <NotSureCard compact />
            <CustomCard />
          </div>
        ) : (
          <div className="mt-3 md:mt-4">
            <NotSureCard compact={false} />
          </div>
        )}
      </div>
    </section>
  );
}