/**
 * Tailored questions per project type.
 *
 * To add or change a question, edit this file only. The form renders it,
 * the API validates it, and the answer is stored in ProjectRequest.details
 * (JSON) under the question id. No database migration needed.
 *
 * Keep ids stable once requests exist: the portal reads them by id.
 */

import type { ProjectTypeId } from "./packages";

export type Option = { value: string; label: string };

export type Question = {
  id: string;
  label: string;
  help?: string;
  kind: "text" | "textarea" | "select" | "multi" | "yesno" | "url";
  options?: Option[];
  required?: boolean;
  placeholder?: string;
  /** only show (and require) this question when another answer matches */
  showIf?: { id: string; equals: string };
};

const o = (...labels: string[]): Option[] =>
  labels.map((label) => ({ value: label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), label }));

const pages = o(
  "Home", "About", "Services", "Portfolio / cases", "Blog / news", "Contact",
  "Pricing", "FAQ", "Team", "Careers",
);

export const QUESTIONS: Record<ProjectTypeId, Question[]> = {
  "brand-website": [
    { id: "mainGoal", label: "What is the main goal of the website?", kind: "select", required: true,
      options: o("Get more leads or enquiries", "Build trust and credibility", "Present our services", "Sell directly", "Recruit people", "Something else") },
    { id: "audience", label: "Who is the website for?", help: "Your ideal customer or visitor, in a sentence.", kind: "textarea", required: true },
    { id: "pages", label: "Which pages do you expect?", kind: "multi", options: pages },
    { id: "hasCopy", label: "Do you have the text and images ready?", kind: "select", required: true,
      options: [
        { value: "all", label: "Yes, everything" },
        { value: "some", label: "Some of it" },
        { value: "none", label: "No, I need help with it" },
      ] },
    { id: "hasBrand", label: "Do you have a logo and brand style?", kind: "select", required: true,
      options: [
        { value: "yes", label: "Yes, ready to use" },
        { value: "partly", label: "A logo, no full style" },
        { value: "no", label: "No, I need branding too" },
      ] },
    { id: "languages", label: "In which languages should the site be?", kind: "multi", options: o("Dutch", "English", "German", "French", "Other") },
    { id: "features", label: "Anything special the site must do?", kind: "multi",
      options: o("Contact form", "Booking or calendar", "Blog or news", "Newsletter signup", "Multilingual", "Own CMS access", "Integrations") },
  ],

  "product-saas": [
    { id: "productStage", label: "Where is your product now?", kind: "select", required: true,
      options: o("Idea or prototype", "Beta", "Launched, early customers", "Established product") },
    { id: "productDescription", label: "What does your product do, in one or two sentences?", kind: "textarea", required: true },
    { id: "audience", label: "Who uses it?", kind: "textarea", required: true },
    { id: "needs", label: "What do you need on the site?", kind: "multi", required: true,
      options: o("Landing page", "Pricing page", "Documentation", "Onboarding flow", "Changelog", "Integrations page", "Blog", "Signup / login links") },
    { id: "integrations", label: "Which tools should it connect to?", help: "For example your app, analytics, CRM, payment provider.", kind: "text" },
    { id: "hasDesignSystem", label: "Do you have a design system or app style we should match?", kind: "yesno" },
    { id: "designSystemUrl", label: "Link to it", kind: "url", showIf: { id: "hasDesignSystem", equals: "yes" } },
  ],

  commerce: [
    { id: "platform", label: "Which platform do you use or prefer?", kind: "select", required: true,
      options: o("Shopify", "WooCommerce", "Custom / headless", "Not sure, advise me", "Other") },
    { id: "productCount", label: "How many products?", kind: "select", required: true,
      options: o("1–10", "11–50", "51–250", "251–1,000", "1,000+") },
    { id: "hasShop", label: "Do you already have a webshop?", kind: "yesno", required: true },
    { id: "shopUrl", label: "Link to your current shop", kind: "url", showIf: { id: "hasShop", equals: "yes" } },
    { id: "payments", label: "Which payment methods?", kind: "multi", options: o("iDEAL", "Credit card", "PayPal", "Klarna", "Apple Pay", "Invoice", "Other") },
    { id: "shipping", label: "Where do you ship?", kind: "multi", options: o("Netherlands", "EU", "Worldwide", "Pickup only", "Digital products") },
    { id: "inventory", label: "Do you need stock or ERP/accounting sync?", kind: "text", placeholder: "e.g. Exact, Moneybird, own system" },
  ],

  portal: [
    { id: "portalFor", label: "Who will use the portal?", kind: "multi", required: true,
      options: o("Our team", "Clients", "Partners or suppliers", "Admins only") },
    { id: "userCount", label: "About how many users?", kind: "select", required: true,
      options: o("1–10", "11–50", "51–250", "250+") },
    { id: "portalFeatures", label: "What should it do?", kind: "multi", required: true,
      options: o("Dashboards and reports", "User accounts and roles", "Approvals and workflows", "File sharing", "Notifications", "Data import/export", "Integrations", "Payments") },
    { id: "dataSource", label: "Where does the data come from?", help: "Existing systems, spreadsheets, an API, or nothing yet.", kind: "textarea" },
    { id: "hasAuth", label: "Do you already have a login system (SSO)?", kind: "yesno" },
    { id: "security", label: "Any security or compliance requirements?", help: "For example GDPR, ISO 27001, hosting in the EU.", kind: "text" },
  ],

  branding: [
    { id: "brandStage", label: "What do you need?", kind: "select", required: true,
      options: o("A new brand from scratch", "A refresh of what I have", "Logo only", "Brand guidelines for what I have") },
    { id: "deliverables", label: "Which deliverables?", kind: "multi", required: true,
      options: o("Logo", "Colour palette", "Typography", "Business cards", "NFC business card", "Flyers", "Brand guidelines", "Social media templates") },
    { id: "brandWords", label: "Three words that describe your brand", kind: "text", required: true, placeholder: "e.g. calm, precise, warm" },
    { id: "brandAudience", label: "Who is your audience?", kind: "textarea" },
    { id: "likes", label: "Brands or styles you like (and why)", kind: "textarea" },
    { id: "dislikes", label: "Anything you definitely don't want?", kind: "text" },
    { id: "existingAssets", label: "Do you have an existing logo or materials?", kind: "yesno" },
  ],

  care: [
    { id: "careSite", label: "Link to the website", kind: "url", required: true },
    { id: "platform", label: "What is it built on?", kind: "select", required: true,
      options: o("WordPress", "Webflow", "Next.js / custom", "Wix or Squarespace", "Shopify", "Not sure") },
    { id: "currentHost", label: "Where is it hosted now?", kind: "text" },
    { id: "carePlan", label: "What do you need?", kind: "select", required: true,
      options: [
        { value: "hosting-care", label: "Hosting + maintenance (Care)" },
        { value: "hosting-only", label: "Hosting only" },
        { value: "unsure", label: "Not sure, advise me" },
      ] },
    { id: "monthlyChanges", label: "Do you expect regular content changes?", kind: "yesno" },
    { id: "issues", label: "Any known problems right now?", kind: "textarea" },
  ],

  // "Something else" has no extra questions: the project description is enough.
  other: [],
};

export function isVisible(q: Question, answers: Record<string, string | string[]>): boolean {
  if (!q.showIf) return true;
  return answers[q.showIf.id] === q.showIf.equals;
}
