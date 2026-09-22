"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Panel geometry: starts as a padded card on the right half (matches the
  // brand's standard layout), then grows edge-to-edge to fill the screen.
  const panelLeft = useTransform(
    scrollYProgress,
    [0, 1],
    [isDesktop ? "46%" : "0%", "0%"]
  );
  const panelTop = useTransform(scrollYProgress, [0, 1], [isDesktop ? 112 : 0, 0]);
  const panelRight = useTransform(scrollYProgress, [0, 1], [isDesktop ? 56 : 0, 0]);
  const panelBottom = useTransform(scrollYProgress, [0, 1], [isDesktop ? 56 : 0, 0]);
  const panelRadius = useTransform(scrollYProgress, [0, 1], [isDesktop ? 26 : 0, 0]);

  const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.35], [0, -40]);

  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 0.35]);

  return (
    <section id="top" ref={sectionRef} className="relative h-[240vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
        <motion.div
          className="absolute overflow-hidden"
          style={{
            top: panelTop,
            right: panelRight,
            bottom: panelBottom,
            left: panelLeft,
            borderRadius: panelRadius,
          }}
        >
          <img
            src="/images/background-hero.png"
            alt="A moonlit river landscape beneath a wide night sky"
            className="h-full w-full object-cover"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/10"
            style={{ opacity: overlayOpacity }}
          />
          <div className="absolute inset-x-0 top-0 h-[70%] bg-gradient-to-b from-ink/90 via-ink/45 to-transparent md:h-[55%] md:from-ink/60 md:via-ink/20" />
        </motion.div>

        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="container-x relative z-10 flex h-full items-center"
        >
          <div className="max-w-[19rem] pt-20 sm:max-w-md md:max-w-lg md:pt-0">
            <p className="font-display text-lg italic text-clay-light md:text-xl">
              A studio for websites
            </p>
            <h1 className="mt-3 font-display text-[2.6rem] leading-[1.05] text-linen sm:text-5xl md:text-6xl lg:text-[4.2rem]">
              We build the websites businesses put their name on.
            </h1>
            <p className="mt-6 max-w-sm font-body text-base leading-relaxed text-linen/75 md:text-lg">
              Artivices designs and ships bespoke websites for companies that
              want their site to work as hard as the rest of the business
              does — strategy, design and code, delivered as one piece.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="focus-ring inline-flex items-center rounded-md bg-clay px-7 py-3 font-display text-lg text-ink transition-colors hover:bg-clay-light"
              >
                Start a project
              </a>
              <a
                href="#work"
                className="focus-ring inline-flex items-center rounded-md border border-linen/30 px-7 py-3 font-display text-lg text-linen transition-colors hover:border-linen/70"
              >
                See our work
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
