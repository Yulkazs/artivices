const SERVICES = [
  {
    title: "Brand websites",
    tag: "Marketing",
    body: "A site that carries the same weight as your best pitch — built to convert visitors before your team ever gets on a call.",
  },
  {
    title: "Product & SaaS sites",
    tag: "Software",
    body: "Pricing pages, docs and onboarding flows that explain what your product does in the time it takes to scroll once.",
  },
  {
    title: "Commerce storefronts",
    tag: "Retail",
    body: "Fast, considered storefronts built on the platform that fits your catalogue, not the other way around.",
  },
  {
    title: "Internal & partner portals",
    tag: "Operations",
    body: "Dashboards and tools your team actually opens — scoped tightly, built to last past the first hire who requested them.",
  },
];

export default function Services() {
  return (
    <section id="work" className="border-t border-ink-line/70 bg-ink py-24 md:py-32">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-[minmax(0,340px)_1fr] md:gap-16">
          <div className="md:sticky md:top-32 md:self-start">
            <p className="font-display text-lg italic text-clay-light">What we build</p>
            <h2 className="mt-3 font-display text-4xl leading-tight text-linen md:text-[2.75rem]">
              Four kinds of site. One standard.
            </h2>
            <p className="mt-5 max-w-sm font-body text-base leading-relaxed text-linen/70">
              We keep a small roster of clients so every project gets the
              same attention as the last one. If your work fits one of
              these, we're likely a good match.
            </p>
          </div>

          <ul className="divide-y divide-ink-line/70 border-t border-ink-line/70 md:border-t-0">
            {SERVICES.map((service) => (
              <li
                key={service.title}
                className="group flex flex-col gap-2 py-8 first:pt-0 md:flex-row md:items-baseline md:justify-between md:gap-8"
              >
                <div className="flex items-baseline gap-4 md:w-2/5">
                  <h3 className="font-display text-2xl text-linen md:text-3xl">
                    {service.title}
                  </h3>
                </div>
                <div className="flex items-start gap-6 md:w-3/5">
                  <span className="mt-1 w-24 shrink-0 font-display text-base italic text-clay-dark">
                    {service.tag}
                  </span>
                  <p className="font-body text-base leading-relaxed text-linen/70">
                    {service.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
