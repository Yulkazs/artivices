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
      className="relative flex flex-col gap-6 md:grid md:grid-cols-[36.5%_63.5%] md:gap-0"
    >
      {/* Title spans the whole row so it can run over the image */}
      <h3 className="case-title order-1 whitespace-nowrap font-body text-[clamp(2.25rem,4.8vw,4.5rem)] font-light uppercase leading-none md:absolute md:left-0 md:top-8 md:z-10 md:w-full">
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

      <div className="order-3 flex flex-col md:col-start-1 md:row-start-1 md:pr-5 md:pt-[clamp(6.5rem,9vw,9rem)]">
        <p className="font-body text-sm leading-relaxed text-ink/80 md:ml-auto md:max-w-[24rem] md:text-right md:text-base">
          {item.body}
        </p>
        <a
          href={item.href}
          className="focus-ring mt-6 font-body text-base font-medium text-ink underline decoration-transparent decoration-1 underline-offset-8 transition-colors hover:decoration-ink md:ml-auto md:mt-auto md:pb-3"
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
      <div className={`${PAD_X} pt-8 md:pt-12`}>
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

      {/* Looper lines fading into the dark section below. The SVG is 1920px
          wide with empty space at the top, so it's pinned to the bottom of a
          fixed-height strip and the empty part is cropped off. */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative mt-24 h-[clamp(16rem,30vw,28rem)] md:mt-32"
      >
        <img
          src="/images/LooperGroup.svg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink" />
      </div>
    </section>
  );
}