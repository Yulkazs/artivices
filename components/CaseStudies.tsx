const CASES = [
  {
    client: "Halden & Fitch",
    industry: "Private wealth advisory",
    result: "Consultation requests up 3.2x within the first quarter.",
    gradient: "from-[#3a3428] via-[#1b1912] to-[#0c0a07]",
  },
  {
    client: "Coastal Freight Co.",
    industry: "Logistics platform",
    result: "Quote-to-booking time cut from four days to eleven minutes.",
    gradient: "from-[#2b3230] via-[#151714] to-[#0c0a07]",
  },
  {
    client: "Marchetti Studio",
    industry: "Furniture & interiors",
    result: "Wholesale enquiries overtook the showroom as the top channel.",
    gradient: "from-[#332a2c] via-[#181314] to-[#0c0a07]",
  },
];

export default function CaseStudies() {
  return (
    <section id="case-studies" className="border-t border-ink-line/70 bg-ink-soft py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-lg italic text-clay-light">Case studies</p>
            <h2 className="mt-3 max-w-xl font-display text-4xl leading-tight text-linen md:text-[2.75rem]">
              Recent work, and what it moved.
            </h2>
          </div>
          <a
            href="#contact"
            className="focus-ring hidden font-display text-lg text-linen/80 underline decoration-clay-dark decoration-1 underline-offset-8 transition-colors hover:text-linen md:inline-block"
          >
            Discuss a similar project
          </a>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {CASES.map((item) => (
            <a
              href="#contact"
              key={item.client}
              className="focus-ring group block overflow-hidden rounded-2xl border border-ink-line/70 bg-ink transition-colors hover:border-clay-dark/60"
            >
              <div
                className={`aspect-[4/3] w-full bg-gradient-to-br ${item.gradient} transition-transform duration-500 group-hover:scale-[1.03]`}
              />
              <div className="p-6">
                <p className="font-display text-2xl text-linen">{item.client}</p>
                <p className="mt-1 font-body text-sm text-linen/55">{item.industry}</p>
                <p className="mt-4 font-body text-base leading-relaxed text-linen/75">
                  {item.result}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
