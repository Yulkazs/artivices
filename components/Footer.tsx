import LogoMark from "./LogoMark";

const COLUMNS = [
  {
    heading: "Studio",
    links: [
      { label: "Home", href: "#top" },
      { label: "Work", href: "#work" },
      { label: "Process", href: "#process" },
    ],
  },
  {
    heading: "Projects",
    links: [
      { label: "Case studies", href: "#case-studies" },
      { label: "Start a project", href: "#contact" },
    ],
  },
  {
    heading: "Elsewhere",
    links: [
      { label: "LinkedIn", href: "#" },
      { label: "Instagram", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink-line/70 bg-ink py-16">
      <div className="container-x">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 text-linen">
              <LogoMark className="h-7 w-7" />
              <span className="font-display text-2xl">Artivices</span>
            </div>
            <p className="mt-4 font-body text-sm leading-relaxed text-linen/55">
              A small studio designing and building websites for businesses
              that want theirs to actually work.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:gap-16">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <p className="font-display text-lg italic text-clay-light">
                  {col.heading}
                </p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="focus-ring font-body text-sm text-linen/65 transition-colors hover:text-linen"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-ink-line/70 pt-6 font-body text-xs text-linen/40 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Artivices Studio. All rights reserved.</p>
          <p>Utrecht, Netherlands</p>
        </div>
      </div>
    </footer>
  );
}
