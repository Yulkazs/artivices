"use client";

import { motion } from "framer-motion";

type Case = {
  name: string;
  body: string;
  /** path in /public, e.g. "/images/cases/halden.jpg". Empty → placeholder. */
  image?: string;
  href: string;
};

// Add more entries and each one renders as its own row.
const CASES: Case[] = [
  {
    name: "Company name",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    href: "#",
  },
];

const PAD_X = "pl-6 pr-6 md:pl-14 md:pr-10 xl:pl-24 xl:pr-24";

function ImagePlaceholderIcon() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="38" height="38" rx="6" />
      <path d="M3 32l10-10 8 8 6-6 14 12" />
      <circle cx="29" cy="14" r="0.6" fill="#fff" />
    </svg>
  );
}

function CaseRow({ item }: { item: Case }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative flex flex-col gap-6 [container-type:inline-size] md:grid md:grid-cols-[36.5%_63.5%] md:gap-0"
    >
      {/* Title spans the whole row so it can run over the image */}
      <h3 className="case-title order-1 whitespace-nowrap font-body text-[clamp(2.25rem,10vw,3.5rem)] font-light uppercase leading-none md:absolute md:left-0 md:top-[2.8cqw] md:z-10 md:w-full md:text-[5.8cqw]">
        {item.name}
      </h3>

      <div className="order-2 aspect-[16/10] overflow-hidden rounded-2xl bg-[#9b9b9b] md:col-start-2 md:row-start-1 md:aspect-[1.76/1]">
        {item.image ? (
          <img
            src={item.image}
            alt={`${item.name} website`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImagePlaceholderIcon />
          </div>
        )}
      </div>

      <div className="order-3 flex flex-col md:col-start-1 md:row-start-1 md:pr-5 md:pt-[12cqw]">
        <p className="font-body text-sm leading-relaxed text-ink/80 md:ml-auto md:max-w-[24rem] md:text-right md:text-base">
          {item.body}
        </p>
        <a
          href={item.href}
          className="focus-ring mt-6 font-body text-lg font-medium text-ink md:text-xl underline decoration-transparent decoration-1 underline-offset-8 transition-colors hover:decoration-ink md:ml-auto md:mt-auto md:pb-3"
        >
          View Case Study
        </a>
      </div>
    </motion.article>
  );
}

export default function CaseStudies() {
  return (
    <section
      id="case-studies"
      aria-labelledby="case-studies-heading"
      className="relative overflow-hidden bg-[#fafafa] text-ink"
    >
      <div className={`${PAD_X} pt-20 md:pt-32 xl:pt-40`}>
        {/* Heading row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="font-accent text-base tracking-wide text-[#8a8578]">
              Case Studies
            </p>
            <h2
              id="case-studies-heading"
              className="mt-4 font-accent text-[clamp(2.25rem,3.4vw,3.25rem)] font-normal leading-[1.05]"
            >
              Recent work &amp;
              <br className="hidden md:block" /> what it moved.
            </h2>
          </div>
          <p className="max-w-[38rem] font-body text-base leading-relaxed text-[#75716a] md:pb-2 md:text-right md:text-[1.05rem]">
            Explore a selection of websites we&apos;ve designed and built for
            businesses across different industries. Each project is tailored to
            reflect the client&apos;s brand, goals, and audience.
          </p>
        </motion.div>

        {/* Cases */}
        <div className="mt-20 flex flex-col gap-24 md:mt-40 md:gap-36">
          {CASES.map((item) => (
            <CaseRow key={item.name} item={item} />
          ))}
        </div>
      </div>

      {/* Looper lines fading into the dark section below. The SVG is cropped
          to its visible content, so it shows in full. Desktop: capped width,
          natural ratio. Mobile: taller strip, cropped sideways around the
          crest so the lines stay readable. The fade is a fixed height so it
          never covers the whole drawing. */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative mx-auto mt-28 h-[22rem] w-full max-w-[1500px] md:mt-44 md:h-auto md:aspect-[1920/696] looper-mask"
      >
        <img
          src="/images/LooperGroup.svg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[38%_100%]"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-px h-32 md:h-52 lg:h-64"
        style={{
          background:
            "linear-gradient(to bottom, rgba(12,10,7,0) 0%, rgba(12,10,7,0.06) 18%, rgba(12,10,7,0.22) 40%, rgba(12,10,7,0.55) 62%, rgba(12,10,7,0.88) 84%, #0c0a07 100%)",
        }}
      />
    </section>
  );
}