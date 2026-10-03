import type { Metadata } from "next";
import Link from "next/link";
import LogoMark from "@/components/LogoMark";
import StartForm from "@/components/start/StartForm";
import { SOURCES, getPackage, type Source } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Start your project",
  description: "Tell us about your project in a few steps. We reply within two working days.",
  alternates: { canonical: "/start" },
  robots: { index: false, follow: true }, // a form is not a landing page
};

type Search = { [key: string]: string | string[] | undefined };
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default function StartPage({ searchParams }: { searchParams: Search }) {
  const pkg = getPackage(first(searchParams.package));
  const from = first(searchParams.from);
  const source: Source = (SOURCES as readonly string[]).includes(from) ? (from as Source) : "direct";

  return (
    <div className="min-h-screen bg-ink">
      <header className="mx-auto flex h-20 max-w-3xl items-center justify-between px-6 md:h-24">
        <Link href="/" className="focus-ring flex items-center gap-3 text-linen">
          <LogoMark className="h-10 w-10 shrink-0 -translate-y-[5px] text-linen" />
          <span className="font-logo text-3xl leading-none tracking-wide">Artivices</span>
        </Link>
        <Link href="/" className="focus-ring font-body text-sm text-linen/60 transition-colors hover:text-linen">
          Back to site
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24 pt-6 md:pb-32 md:pt-10">
        <StartForm initialPackageId={pkg?.id ?? ""} source={source} />
      </main>
    </div>
  );
}
