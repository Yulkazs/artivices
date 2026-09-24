const STEPS = [
  {
    n: "1",
    title: "Discover",
    body: "Two weeks with your team to pin down what the site needs to do, for whom, and how you'll know it's working.",
  },
  {
    n: "2",
    title: "Design",
    body: "A full visual system before a line of code — pages, states and content, reviewed together until it's right.",
  },
  {
    n: "3",
    title: "Build",
    body: "Engineering in the open. You get a staging link in week one and watch the site come together from there.",
  },
  {
    n: "4",
    title: "Launch & hand off",
    body: "A documented, owned codebase your team can run without us — plus thirty days of support after go-live.",
  },
];

export default function Process() {
  return (
    <section id="process" className="border-t border-ink-line/70 bg-ink py-24 md:py-32">
      <div className="container-x">
        <p className="font-body text-sm tracking-wide text-mist">How it runs</p>
        <h2 className="mt-3 max-w-xl font-body font-medium text-4xl leading-tight text-linen md:text-[2.75rem]">
          Four stages, roughly eight weeks.
        </h2>

        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.n} className="border-t border-ink-line/70 pt-6">
              <span className="font-body font-bold text-3xl text-clay-dark">{step.n}</span>
              <h3 className="mt-4 font-body font-medium text-2xl text-linen">{step.title}</h3>
              <p className="mt-3 font-body text-base leading-relaxed text-linen/70">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
