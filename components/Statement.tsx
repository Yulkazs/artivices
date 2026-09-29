"use client";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

const text = "''More than just a beautiful website. A great website looks good, but a perfect website works hard for your business. We combine strategy, design and performance to deliver real results.''";

function Word({ w, i, n, p }: { w: string; i: number; n: number; p: MotionValue<number> }) {
  const o = useTransform(p, [i / n, (i + 1) / n], [0.15, 1]);
  return <motion.span style={{ opacity: o }}>{w} </motion.span>;
}

export default function Statement() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start 0.85", "end 0.6"] });
  const words = text.split(" ");
  return (
    <section id="about" ref={ref} className="px-6 py-40 md:py-64">
      <p className="mx-auto max-w-5xl font-display text-3xl leading-[1.2] md:text-6xl">
        {words.map((w, i) => <Word key={i} w={w} i={i} n={words.length} p={p} />)}
      </p>
    </section>
  );
}