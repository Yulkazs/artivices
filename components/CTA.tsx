export default function CTA() {
  return (
    <section id="contact" className="border-t border-ink-line/70 bg-ink py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-10 rounded-3xl border border-ink-line/70 bg-ink-soft px-8 py-14 md:flex-row md:items-center md:px-16">
          <div className="max-w-xl">
            <h2 className="font-display text-4xl leading-tight text-linen md:text-5xl">
              Tell us about the site you need.
            </h2>
            <p className="mt-4 font-body text-base leading-relaxed text-linen/70 md:text-lg">
              We take on a handful of new projects each quarter. Send a few
              lines about your business and timeline — we reply within two
              working days.
            </p>
          </div>
          <a
            href="mailto:studio@artivices.com"
            className="focus-ring inline-flex shrink-0 items-center rounded-md bg-clay px-8 py-4 font-display text-xl text-ink transition-colors hover:bg-clay-light"
          >
            studio@artivices.com
          </a>
        </div>
      </div>
    </section>
  );
}
