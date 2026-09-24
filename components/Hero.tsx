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

  // The panel is pinned to the right edge and the bottom of the screen from
  // the start (it never has a right or bottom margin — it "comes from the
  // right side"). Scrolling only pulls its left edge and top margin in
  // until it covers the whole viewport.
  const panelLeft = useTransform(
    scrollYProgress,
    [0, 1],
    [isDesktop ? "39%" : "0%", "0%"]
  );
  const panelTop = useTransform(scrollYProgress, [0, 1], [isDesktop ? 128 : 0, 0]);
  const panelRadius = useTransform(scrollYProgress, [0, 1], [isDesktop ? 28 : 0, 0]);

  const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.35], [0, -40]);

  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.5, 0.3]);

  return (
    <section id="top" ref={sectionRef} className="relative h-[240vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
        <motion.div
          className="absolute bottom-0 right-0 overflow-hidden"
          style={{
            top: panelTop,
            left: panelLeft,
            borderTopLeftRadius: panelRadius,
            borderBottomLeftRadius: panelRadius,
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
            <p className="font-body text-sm tracking-wide text-mist md:text-base">
              B2B Webdesign
            </p>
            <h1 className="mt-4 font-body text-[2.6rem] font-medium leading-[1.05] text-linen sm:text-5xl md:text-6xl lg:text-[4.2rem]">
              Websites that help{" "}
              <span className="font-logo font-normal text-clay">your</span>{" "}
              <span className="font-logo font-normal text-linen">
                business
              </span>{" "}
              grow.
            </h1>
            <p className="mt-6 max-w-sm font-body text-base leading-relaxed text-linen/70 md:text-lg">
              Your website should do more than look good. It should build
              trust, explain what you do, and turn visitors into customers.
            </p>
            <div className="mt-10">
              <a
                href="#contact"
                className="focus-ring group inline-flex items-center gap-2 font-accent text-lg text-linen"
              >
                Get Started
                <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
