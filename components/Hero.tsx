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

  const panelLeft = useTransform(
    scrollYProgress,
    [0, 1],
    [isDesktop ? "39%" : "0%", "0%"]
  );
  const panelTop = useTransform(scrollYProgress, [0, 1], [isDesktop ? "22%" : "0%", "0%"]);
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
          className="relative z-10 flex h-full items-center pl-6 pr-6 md:pl-14 md:pr-10 md:pt-24 xl:pl-24"
        >
          <div className="min-w-0 max-w-[clamp(16rem,84vw,20rem)] pt-20 md:max-w-[min(33vw,34rem)] md:pt-0 xl:max-w-[min(calc(39vw-8rem),36rem)]">
            <p className="font-body text-[clamp(0.85rem,1.75vw,1.15rem)] tracking-wide text-mist">
              B2B Webdesign
            </p>
            <h1 className="mt-4 font-body text-[clamp(2.75rem,7.5vw,4.3rem)] font-medium leading-[1.08] text-linen md:text-[clamp(2rem,min(3.9vw,9vh),4.3rem)]">
              Websites that help{" "}
              <span className="font-logo font-normal text-clay">your</span>{" "}
              <span className="font-logo font-normal text-clay">
                business
              </span>{" "}
              grow.
            </h1>
            <p className="mt-6 max-w-[clamp(13rem,27vw,33rem)] font-body text-[clamp(0.9rem,1vw,1.05rem)] leading-relaxed text-linen/70 md:mt-[clamp(1rem,3.5vh,1.5rem)] md:max-w-full">
              Your website should do more than look good. It should build
              trust, explain what you do, and turn visitors into customers.
            </p>
            <div className="mt-10 md:mt-[clamp(1.25rem,5vh,2.5rem)]">
              <a
                href="#contact"
                className="focus-ring group inline-flex items-center gap-2 font-accent text-[clamp(0.95rem,1.6vw,1.3rem)] text-linen"
              >
                Get Started
                <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  {"\u2197\uFE0E"}
                </span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}