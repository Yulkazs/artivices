/**
 * Packages and project types offered in the request form.
 * Prices mirror components/Pricing.tsx. If you change them there, change them here.
 */

export type PackageCategory = "website" | "branding" | "care" | "other";

export type ProjectTypeId =
  | "brand-website"
  | "product-saas"
  | "commerce"
  | "portal"
  | "branding"
  | "care"
  | "other";

export type PackageDef = {
  id: string;
  category: PackageCategory;
  name: string;
  /** one line under the name */
  meta: string;
  /** price as shown on the site */
  price: string;
  popular?: boolean;
  /** project type this package implies, if it implies exactly one */
  impliedType?: ProjectTypeId;
};

export const PACKAGES: PackageDef[] = [
  { id: "website-starter", category: "website", name: "Starter", meta: "1–4 pages", price: "€1,000 – €1,500", impliedType: "brand-website" },
  { id: "website-business", category: "website", name: "Business", meta: "5–8 pages", price: "€1,750 – €2,750", popular: true, impliedType: "brand-website" },
  { id: "website-professional", category: "website", name: "Professional", meta: "9–15 pages", price: "€3,000 – €4,500" },
  { id: "website-custom", category: "website", name: "Custom", meta: "Larger or more complex projects", price: "from €4,500" },
  { id: "branding-logos", category: "branding", name: "Logos", meta: "Logo design", price: "€50 – €350", impliedType: "branding" },
  { id: "branding-identity", category: "branding", name: "Identity", meta: "Visual identity & essentials", price: "€350 – €500", impliedType: "branding" },
  { id: "branding-signature", category: "branding", name: "Signature", meta: "Complete brand system", price: "€750 – €1,000", impliedType: "branding" },
  { id: "care-hosting-care", category: "care", name: "Hosting + Care", meta: "Hosting, maintenance and security", price: "from €50 / month", impliedType: "care" },
  { id: "care-hosting-only", category: "care", name: "Hosting only", meta: "Managed hosting", price: "€20 – €30 / month", impliedType: "care" },
  { id: "unsure", category: "other", name: "Not sure yet", meta: "Advise me on the best fit", price: "We'll recommend a package" },
];

export const PACKAGE_IDS = PACKAGES.map((p) => p.id) as [string, ...string[]];

export const CATEGORY_LABELS: Record<PackageCategory, string> = {
  website: "Website",
  branding: "Branding",
  care: "Hosting + Care",
  other: "Not sure",
};

export function getPackage(id: string | undefined | null): PackageDef | undefined {
  return PACKAGES.find((p) => p.id === id);
}

export const PROJECT_TYPES: { id: ProjectTypeId; label: string; hint: string }[] = [
  { id: "brand-website", label: "Brand website", hint: "Landing pages, company site, conversion copy" },
  { id: "product-saas", label: "Product & SaaS site", hint: "Pricing pages, docs, onboarding" },
  { id: "commerce", label: "Commerce storefront", hint: "Product pages, checkout, inventory" },
  { id: "portal", label: "Internal or partner portal", hint: "Dashboards, access control, workflows" },
  { id: "branding", label: "Branding", hint: "Logo, visual identity, guidelines" },
  { id: "care", label: "Hosting + Care", hint: "Hosting, updates, small changes" },
  { id: "other", label: "Something else", hint: "Tell us what you have in mind" },
];

export const PROJECT_TYPE_IDS = PROJECT_TYPES.map((t) => t.id) as [ProjectTypeId, ...ProjectTypeId[]];

export function getProjectType(id: string | undefined | null) {
  return PROJECT_TYPES.find((t) => t.id === id);
}

/** Where the customer clicked from. Stored with the request. */
export const SOURCES = ["pricing", "hero", "header", "case-studies", "footer", "direct"] as const;
export type Source = (typeof SOURCES)[number];

// ---- Planning options (shared by every project) --------------------------------

export const BUDGET_OPTIONS = [
  { value: "under-1000", label: "Under €1,000" },
  { value: "1000-2500", label: "€1,000 – €2,500" },
  { value: "2500-5000", label: "€2,500 – €5,000" },
  { value: "5000-10000", label: "€5,000 – €10,000" },
  { value: "10000-plus", label: "€10,000+" },
  { value: "unsure", label: "Not sure yet" },
];

export const TIMELINE_OPTIONS = [
  { value: "asap", label: "As soon as possible" },
  { value: "within-1-month", label: "Within a month" },
  { value: "1-3-months", label: "In 1–3 months" },
  { value: "3-plus-months", label: "In 3+ months" },
  { value: "flexible", label: "Flexible" },
];

export const COMPANY_SIZE_OPTIONS = [
  { value: "solo", label: "Just me" },
  { value: "2-10", label: "2–10 people" },
  { value: "11-50", label: "11–50 people" },
  { value: "51-200", label: "51–200 people" },
  { value: "200-plus", label: "200+ people" },
];

export const REFERRAL_OPTIONS = [
  { value: "search", label: "Search engine" },
  { value: "social", label: "Social media" },
  { value: "referral", label: "Recommendation" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "other", label: "Other" },
];
