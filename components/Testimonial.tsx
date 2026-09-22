export default function Testimonial() {
  return (
    <section className="border-t border-ink-line/70 bg-ink-soft py-24 md:py-32">
      <div className="container-x">
        <blockquote className="mx-auto max-w-3xl text-center">
          <p className="font-display text-3xl leading-snug text-linen sm:text-4xl md:text-[2.6rem]">
            "They asked harder questions about our business than most of our
            own hires do. The site that came out of it still feels like the
            sharpest thing we own."
          </p>
          <footer className="mt-8 font-body text-base text-linen/60">
            Priya Nandan, Founder — Coastal Freight Co.
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
