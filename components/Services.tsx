"use client";

import { motion } from "framer-motion";

const SERVICES = [
  {
    index: "01",
    title: "Brand websites",
    tags: ["Landing pages", "Messaging", "Conversion copy", "Analytics"],
    body: "A site that carries the same weight as your best pitch — built to convert visitors before your team ever gets on a call.",
    gradient: "from-[#3a3428] via-[#1b1912] to-[#0c0a07]",
  },
  {
    index: "02",
    title: "Product & SaaS sites",
    tags: ["Pricing pages", "Docs", "Onboarding", "Integrations"],
    body: "Pricing pages, docs and onboarding flows that explain what your product does in the time it takes to scroll once.",
    gradient: "from-[#2b3230] via-[#151714] to-[#0c0a07]",
  },
  {
    index: "03",
    title: "Commerce storefronts",
    tags: ["Product pages", "Checkout", "Inventory sync", "Performance"],
    body: "Fast, considered storefronts built on the platform that fits your catalogue, not the other way around.",
    gradient: "from-[#332a2c] via-[#181314] to-[#0c0a07]",
  },
  {
    index: "04",
    title: "Internal & partner portals",
    tags: ["Dashboards", "Access control", "Reporting", "Workflows"],
    body: "Dashboards and tools your team actually opens — scoped tightly, built to last past the first hire who requested them.",
    gradient: "from-[#2d2a24] via-[#171510] to-[#0c0a07]",
  },
];

export default function Services() {
  return (
    <section
      id="work"
      aria-labelledby="services-heading"
      className="border-t border-ink-line/70 bg-ink py-32 md:py-48"
    >
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <p className="font-body text-sm tracking-wide text-mist">
            What we build
          </p>
          <h2
            id="services-heading"
            className="mt-3 font-body text-4xl font-medium leading-tight text-linen md:text-[2.75rem]"
          >
            Four kinds of site. One standard.
          </h2>
          <p className="mt-5 max-w-sm font-body text-base leading-relaxed text-linen/70">
            We keep a small roster of clients so every project gets the same
            attention as the last one. If your work fits one of these, we're
            likely a good match.
          </p>
        </motion.div>

        {/* Sticky stacking cards — each card catches at the top of the
            viewport and the next one slides over it, layer by layer, as
            you scroll. Only enabled at md+; mobile gets a plain stacked
            list since the effect needs room to breathe. */}
        <div className="relative mt-16 md:mt-24">
          {SERVICES.map((service, i) => (
            <div
              key={service.title}
              className="md:relative md:h-[78vh]"
              style={{ zIndex: i + 1 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-6 rounded-3xl border border-ink-line/70 bg-ink-soft px-6 py-10 shadow-[0_-24px_48px_-32px_rgba(0,0,0,0.7)] md:sticky md:top-24 md:mb-0 md:rounded-t-3xl md:rounded-b-none md:border-b-0 md:px-14 md:py-14"
              >
                <div className="grid gap-8 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-12">
                  <span className="font-body text-2xl font-medium text-clay-dark md:text-3xl">
                    {service.index}
                  </span>

                  <div>
                    <h3 className="font-body text-2xl font-medium text-linen md:text-3xl">
                      {service.title}
                    </h3>
                    <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-1 font-body text-sm text-clay-dark/90">
                      {service.tags.map((tag, idx) => (
                        <li key={tag}>
                          {tag}
                          {idx < service.tags.length - 1 ? "," : ""}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 max-w-md font-body text-base leading-relaxed text-linen/70">
                      {service.body}
                    </p>
                  </div>

                  <div
                    aria-hidden="true"
                    className={`hidden h-40 w-56 shrink-0 rounded-2xl bg-gradient-to-br md:block ${service.gradient}`}
                  />
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}