/**
 * Validation shared by the form (per step, in the browser) and the API (whole
 * request, on the server). The server never trusts the browser: it runs the same
 * rules again.
 */

import { z } from "zod";
import {
  BUDGET_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  PACKAGE_IDS,
  PROJECT_TYPE_IDS,
  REFERRAL_OPTIONS,
  SOURCES,
  TIMELINE_OPTIONS,
  type ProjectTypeId,
} from "./packages";
import { QUESTIONS, isVisible, type Question } from "./questions";

export type Answers = Record<string, string | string[]>;
export type Errors = Record<string, string>;

export type FormValues = {
  packageId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContact: "EMAIL" | "PHONE";
  companyName: string;
  companyWebsite: string;
  industry: string;
  role: string;
  companySize: string;
  projectType: string;
  description: string;
  answers: Answers;
  budget: string;
  timeline: string;
  hasExistingSite: "" | "yes" | "no";
  existingSiteUrl: string;
  inspiration: string;
  referral: string;
  consent: boolean;
};

export const EMPTY_VALUES: FormValues = {
  packageId: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  preferredContact: "EMAIL",
  companyName: "",
  companyWebsite: "",
  industry: "",
  role: "",
  companySize: "",
  projectType: "",
  description: "",
  answers: {},
  budget: "",
  timeline: "",
  hasExistingSite: "",
  existingSiteUrl: "",
  inspiration: "",
  referral: "",
  consent: false,
};

// ---- small helpers ---------------------------------------------------------------

/** Accepts "example.com" as well as "https://example.com". Returns "" when invalid. */
export function normalizeUrl(input: string): string {
  const v = input.trim();
  if (!v) return "";
  const withProtocol = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(withProtocol);
    if (!/^https?:$/.test(u.protocol)) return "";
    if (!u.hostname.includes(".")) return "";
    return u.toString();
  } catch {
    return "";
  }
}

const isEmptyOrUrl = (v: string) => v.trim() === "" || normalizeUrl(v) !== "";
const isEmptyOrPhone = (v: string) => v.trim() === "" || /^\+?[0-9 ()\-.]{7,20}$/.test(v.trim());

const req = (label: string, max = 100) =>
  z.string().trim().min(1, `${label} is required`).max(max, "That is too long");
const opt = (max: number) => z.string().trim().max(max, "That is too long");
const urlField = z.string().trim().max(300, "That is too long").refine(isEmptyOrUrl, "Enter a valid web address");
const oneOfOrEmpty = (options: { value: string }[]) =>
  z.string().refine((v) => v === "" || options.some((o) => o.value === v), "Choose one of the options");

// ---- per-step schemas ------------------------------------------------------------

export const packageSchema = z.object({
  packageId: z.enum(PACKAGE_IDS, { error: "Choose a package, or “Not sure yet”" }),
});

export const contactSchema = z
  .object({
    firstName: req("First name", 60),
    lastName: req("Last name", 80),
    email: z.string().trim().min(1, "Email is required").max(200, "That is too long").pipe(z.email("Enter a valid email address")),
    phone: z.string().trim().max(30, "That is too long").refine(isEmptyOrPhone, "Enter a valid phone number"),
    preferredContact: z.enum(["EMAIL", "PHONE"]),
  })
  .refine((v) => v.preferredContact !== "PHONE" || v.phone.trim() !== "", {
    path: ["phone"],
    error: "Add a phone number, or choose email as your preferred contact",
  });

export const companySchema = z.object({
  companyName: req("Company name", 120),
  companyWebsite: urlField,
  industry: opt(100),
  role: opt(100),
  companySize: oneOfOrEmpty(COMPANY_SIZE_OPTIONS),
});

export const projectSchema = z.object({
  projectType: z.enum(PROJECT_TYPE_IDS, { error: "Choose the kind of project" }),
  description: z
    .string()
    .trim()
    .min(30, "Tell us a bit more (at least 30 characters)")
    .max(4000, "Please keep it under 4,000 characters"),
});

export const planningSchema = z.object({
  budget: oneOfOrEmpty(BUDGET_OPTIONS),
  timeline: oneOfOrEmpty(TIMELINE_OPTIONS),
  hasExistingSite: z.enum(["", "yes", "no"]),
  existingSiteUrl: urlField,
  inspiration: opt(2000),
  referral: oneOfOrEmpty(REFERRAL_OPTIONS),
});

// ---- tailored answers --------------------------------------------------------------

function answerEmpty(v: string | string[] | undefined) {
  return v === undefined || (Array.isArray(v) ? v.length === 0 : v.trim() === "");
}

function checkQuestion(q: Question, v: string | string[] | undefined): string | undefined {
  if (answerEmpty(v)) return q.required ? "This question is required" : undefined;
  const first = (Array.isArray(v) ? v[0] : v) ?? "";
  switch (q.kind) {
    case "select":
      if (Array.isArray(v) || !q.options?.some((o) => o.value === v)) return "Choose one of the options";
      return;
    case "multi":
      if (!Array.isArray(v) || v.some((x) => !q.options?.some((o) => o.value === x))) return "Choose from the options";
      return;
    case "yesno":
      if (v !== "yes" && v !== "no") return "Choose yes or no";
      return;
    case "url":
      if (Array.isArray(v) || !isEmptyOrUrl(v ?? "")) return "Enter a valid web address";
      return;
    case "text":
      return first.length > 300 ? "That is too long" : undefined;
    case "textarea":
      return first.length > 2000 ? "That is too long" : undefined;
  }
}

export function validateAnswers(type: string, answers: Answers): Errors {
  const errors: Errors = {};
  for (const q of QUESTIONS[type as ProjectTypeId] ?? []) {
    if (!isVisible(q, answers)) continue;
    const msg = checkQuestion(q, answers[q.id]);
    if (msg) errors[`answers.${q.id}`] = msg;
  }
  return errors;
}

/** Keeps only known, visible questions, with trimmed and normalised values. */
export function sanitizeAnswers(type: string, answers: Answers): Answers {
  const out: Answers = {};
  for (const q of QUESTIONS[type as ProjectTypeId] ?? []) {
    if (!isVisible(q, answers)) continue;
    const v = answers[q.id];
    if (answerEmpty(v)) continue;
    if (Array.isArray(v)) out[q.id] = v;
    else out[q.id] = q.kind === "url" ? normalizeUrl(v) : v.trim();
  }
  return out;
}

// ---- steps -----------------------------------------------------------------------

export const STEP_IDS = ["package", "contact", "company", "project", "details", "planning", "review"] as const;
export type StepId = (typeof STEP_IDS)[number];

function fromZod(result: { success: boolean; error?: z.ZodError }): Errors {
  const errors: Errors = {};
  if (result.success || !result.error) return errors;
  for (const issue of result.error.issues) {
    const key = issue.path.join(".") || "form";
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

export function validateStep(step: StepId, v: FormValues): Errors {
  switch (step) {
    case "package":
      return fromZod(packageSchema.safeParse(v));
    case "contact":
      return fromZod(contactSchema.safeParse(v));
    case "company":
      return fromZod(companySchema.safeParse(v));
    case "project":
      return fromZod(projectSchema.safeParse(v));
    case "details":
      return validateAnswers(v.projectType, v.answers);
    case "planning":
      return fromZod(planningSchema.safeParse(v));
    case "review":
      return v.consent ? {} : { consent: "Please confirm so we can contact you about this request" };
  }
}

/** Which step holds a given error key. Used to jump back to the first broken step. */
export function stepForField(key: string): StepId {
  if (key === "packageId") return "package";
  if (["firstName", "lastName", "email", "phone", "preferredContact"].includes(key)) return "contact";
  if (["companyName", "companyWebsite", "industry", "role", "companySize"].includes(key)) return "company";
  if (["projectType", "description"].includes(key)) return "project";
  if (key.startsWith("answers.")) return "details";
  if (["budget", "timeline", "hasExistingSite", "existingSiteUrl", "inspiration", "referral"].includes(key)) return "planning";
  return "review";
}

// ---- whole request (API) -------------------------------------------------------------

export const requestSchema = z.object({
  values: z.object({
    packageId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string(),
    preferredContact: z.enum(["EMAIL", "PHONE"]),
    companyName: z.string(),
    companyWebsite: z.string(),
    industry: z.string(),
    role: z.string(),
    companySize: z.string(),
    projectType: z.string(),
    description: z.string(),
    answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
    budget: z.string(),
    timeline: z.string(),
    hasExistingSite: z.enum(["", "yes", "no"]),
    existingSiteUrl: z.string(),
    inspiration: z.string(),
    referral: z.string(),
    consent: z.boolean(),
  }),
  /** package the customer arrived with (to record whether they changed it) */
  initialPackageId: z.string().max(60).optional().default(""),
  source: z.enum(SOURCES).catch("direct"),
  /** honeypot: real people leave it empty */
  hp: z.string().max(500).optional().default(""),
  /** ms timestamp when the form was opened; instant submits are bots */
  startedAt: z.number().int(),
});

export type RequestPayload = z.infer<typeof requestSchema>;

/** Runs every step's rules. Returns all errors (empty object = valid). */
export function validateAll(v: FormValues): Errors {
  const errors: Errors = {};
  for (const step of STEP_IDS) Object.assign(errors, validateStep(step, v));
  return errors;
}
