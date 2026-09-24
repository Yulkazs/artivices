"use client";

import { useState } from "react";
import LogoMark from "./LogoMark";

const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "Case Studies", href: "#case-studies" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/80 via-ink/30 to-transparent" />
      <div className="container-x relative flex h-20 items-center justify-between md:h-24">
        <a
          href="#top"
          className="focus-ring flex items-center gap-3 text-linen"
        >
          <LogoMark className="h-7 w-7 text-linen md:h-8 md:w-8" />
          <span className="font-logo text-2xl tracking-wide md:text-[1.7rem]">
            Artivices
          </span>
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="focus-ring font-accent text-lg text-linen/90 transition-colors hover:text-linen"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="#contact"
            className="focus-ring inline-flex items-center rounded-md bg-clay px-6 py-2.5 font-accent text-lg text-ink transition-colors hover:bg-clay-light"
          >
            Get Started
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="focus-ring flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-px w-6 bg-linen transition-transform ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-linen transition-opacity ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-px w-6 bg-linen transition-transform ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`overflow-hidden bg-ink/98 backdrop-blur transition-[max-height] duration-300 ease-in-out md:hidden ${
          open ? "max-h-80" : "max-h-0"
        }`}
      >
        <nav className="container-x flex flex-col gap-1 pb-6 pt-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="focus-ring border-b border-ink-line/60 py-3 font-accent text-xl text-linen/90"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="focus-ring mt-4 inline-flex items-center justify-center rounded-md bg-clay px-6 py-3 font-accent text-lg text-ink"
          >
            Get Started
          </a>
        </nav>
      </div>
    </header>
  );
}
