"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BUDGET_OPTIONS,
  CATEGORY_LABELS,
  COMPANY_SIZE_OPTIONS,
  PACKAGES,
  PROJECT_TYPES,
  REFERRAL_OPTIONS,
  TIMELINE_OPTIONS,
  getPackage,
  getProjectType,
  type PackageCategory,
  type Source,
} from "@/lib/packages";
import { QUESTIONS } from "@/lib/questions";
import {
  EMPTY_VALUES,
  STEP_IDS,
  stepForField,
  validateStep,
  type Errors,
  type FormValues,
  type StepId,
} from "@/lib/request-schema";
import { CardChoice, Field, QuestionField, SelectField, TextArea, TextField, YesNo, inputBase } from "./Fields";

const DRAFT_KEY = "artivices-request-draft-v1";
const DRAFT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const EASE = [0.22, 1, 0.36, 1] as const;

const STEP_META: Record<StepId, { label: string; title: string; text: string }> = {
  package: { label: "Package", title: "Choose your package", text: "Pick the one that fits best. You can still change it later." },
  contact: { label: "You", title: "About you", text: "So we know who we are talking to and how to reach you." },
  company: { label: "Company", title: "Your company", text: "A few details about the business behind the project." },
  project: { label: "Project", title: "Your project", text: "What would you like us to build?" },
  details: { label: "Details", title: "A few more questions", text: "These help us understand your project, so our first reply is a useful one." },
  planning: { label: "Planning", title: "Budget & timing", text: "Rough answers are fine. Nothing here is binding." },
  review: { label: "Review", title: "Check and send", text: "Have a last look. You can edit any section." },
};

const CATEGORIES: PackageCategory[] = ["website", "branding", "care", "other"];

type Draft = { values: FormValues; typeAuto: boolean; stepId: StepId; startedAt: number; savedAt: number };

function labelOf(options: { value: string; label: string }[], v: string) {
  return options.find((o) => o.value === v)?.label ?? v;
}

export default function StartForm({
  initialPackageId,
  source,
}: {
  /** package from the URL (?package=…), "" when the customer did not pick one yet */
  initialPackageId: string;
  source: Source;
}) {
  const reduce = useReducedMotion();
  const initialPkg = getPackage(initialPackageId);

  const [values, setValues] = useState<FormValues>({
    ...EMPTY_VALUES,
    packageId: initialPkg?.id ?? "",
    projectType: initialPkg?.impliedType ?? "",
  });
  /** true while the project type came from the package (so changing the package may change it) */
  const [typeAuto, setTypeAuto] = useState(!!initialPkg?.impliedType);
  const [category, setCategory] = useState<PackageCategory>(initialPkg?.category ?? "website");
  const [stepId, setStepId] = useState<StepId>("package");
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [errorTick, setErrorTick] = useState(0);
  const [hp, setHp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [done, setDone] = useState<{ reference: string; firstName: string } | null>(null);
  const [resumed, setResumed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const startedAt = useRef(Date.now());
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const firstRender = useRef(true);

  /* "Something else" has no tailored questions, so that step is skipped. */
  const steps = useMemo(
    () => STEP_IDS.filter((s) => s !== "details" || (QUESTIONS[values.projectType as keyof typeof QUESTIONS]?.length ?? 1) > 0),
    [values.projectType],
  );
  const index = Math.max(0, steps.indexOf(stepId));
  const meta = STEP_META[stepId];
  const pkg = getPackage(values.packageId);
  const type = getProjectType(values.projectType);

  /* ---------- restore a saved draft ---------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw) as Draft;
        if (d && Date.now() - d.savedAt < DRAFT_MAX_AGE_MS && d.values) {
          const merged: FormValues = { ...EMPTY_VALUES, ...d.values, answers: d.values.answers ?? {}, consent: false };
          let auto = !!d.typeAuto;
          if (initialPkg) {
            // arriving from a package button: that package wins over the saved one
            merged.packageId = initialPkg.id;
            if (merged.projectType === "" || auto) {
              merged.projectType = initialPkg.impliedType ?? "";
              auto = !!initialPkg.impliedType;
            }
          }
          setValues(merged);
          setTypeAuto(auto);
          setCategory(getPackage(merged.packageId)?.category ?? "website");
          if (!initialPkg && d.stepId && d.stepId !== "package") {
            setStepId(d.stepId);
            setResumed(true);
          } else if (merged.firstName || merged.companyName || merged.description) {
            setResumed(true);
          }
          startedAt.current = d.startedAt || Date.now();
        }
      }
    } catch {
      /* private mode or corrupt draft: start fresh */
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- save the draft (never the consent) ---------- */
  useEffect(() => {
    if (!hydrated || done) return;
    const t = setTimeout(() => {
      try {
        const draft: Draft = { values: { ...values, consent: false }, typeAuto, stepId, startedAt: startedAt.current, savedAt: Date.now() };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      } catch {
        /* storage full or blocked */
      }
    }, 400);
    return () => clearTimeout(t);
  }, [values, typeAuto, stepId, hydrated, done]);

  /* ---------- move focus to the new step's heading ---------- */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    const top = formRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0 || top > window.innerHeight * 0.4) {
      window.scrollTo({ top: window.scrollY + top - 96, behavior: reduce ? "auto" : "smooth" });
    }
  }, [stepId, done, reduce]);

  /* ---------- after a failed "Next", focus the first broken field ---------- */
  useEffect(() => {
    if (errorTick === 0) return;
    const el = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], [data-invalid="true"]');
    if (!el) return;
    const target = el.matches("input,select,textarea") ? el : el.querySelector<HTMLElement>("input,select,textarea");
    target?.focus();
  }, [errorTick]);

  /* ---------- state helpers ---------- */
  const clearError = useCallback((key: string) => {
    setErrors((e) => {
      if (!(key in e)) return e;
      const { [key]: _removed, ...rest } = e;
      return rest;
    });
  }, []);

  const setField = useCallback(
    <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
      setValues((v) => ({ ...v, [key]: value }));
      clearError(key as string);
    },
    [clearError],
  );

  const setAnswer = useCallback(
    (id: string, v: string | string[]) => {
      setValues((s) => ({ ...s, answers: { ...s.answers, [id]: v } }));
      clearError(`answers.${id}`);
    },
    [clearError],
  );

  const selectPackage = (id: string) => {
    const p = getPackage(id);
    setValues((v) => {
      const next = { ...v, packageId: id };
      if (p && (v.projectType === "" || typeAuto) && v.projectType !== (p.impliedType ?? "")) {
        next.projectType = p.impliedType ?? "";
        next.answers = {};
      }
      return next;
    });
    if (p && (values.projectType === "" || typeAuto)) setTypeAuto(!!p.impliedType);
    clearError("packageId");
  };

  const selectType = (id: string) => {
    if (id === values.projectType) return;
    setTypeAuto(false);
    setValues((v) => ({ ...v, projectType: id, answers: {} })); // answers belong to one type
    clearError("projectType");
  };

  /* ---------- navigation ---------- */
  const goTo = (target: StepId, dir: number) => {
    setDirection(dir);
    setErrors({});
    setSubmitError("");
    setStepId(target);
  };

  const back = () => {
    if (index > 0) goTo(steps[index - 1], -1);
  };

  const submit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values, initialPackageId: initialPkg?.id ?? "", source, hp, startedAt: startedAt.current }),
      });
      const data = (await res.json().catch(() => null)) as { ok: boolean; reference?: string; error?: string; errors?: Errors } | null;
      if (res.ok && data?.ok && data.reference) {
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch {
          /* ignore */
        }
        setDone({ reference: data.reference, firstName: values.firstName.trim() });
        return;
      }
      if (data?.errors && Object.keys(data.errors).length) {
        const first = Object.keys(data.errors)[0];
        setErrors(data.errors);
        setErrorTick((t) => t + 1);
        const target = stepForField(first);
        setDirection(-1);
        setStepId(steps.includes(target) ? target : "review");
        return;
      }
      setSubmitError(data?.error ?? "Something went wrong. Please try again, or email studio@artivices.com.");
    } catch {
      setSubmitError("We could not reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const next = () => {
    const found = validateStep(stepId, values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setErrorTick((t) => t + 1);
      return;
    }
    setErrors({});
    if (stepId === "review") void submit();
    else goTo(steps[index + 1], 1);
  };

  const startOver = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    setValues({ ...EMPTY_VALUES, packageId: initialPkg?.id ?? "", projectType: initialPkg?.impliedType ?? "" });
    setTypeAuto(!!initialPkg?.impliedType);
    setCategory(initialPkg?.category ?? "website");
    setResumed(false);
    goTo("package", -1);
  };

  /* ---------- success ---------- */
  if (done) {
    return (
      <div className="rounded-3xl bg-[#22201E] p-8 md:p-12">
        <p className="font-body text-sm text-clay">Request received</p>
        <h1 ref={headingRef} tabIndex={-1} className="mt-3 font-body text-3xl leading-tight text-linen outline-none md:text-5xl">
          Thank you{done.firstName ? `, ${done.firstName}` : ""}.
        </h1>
        <p className="mt-5 max-w-[52ch] font-body text-base leading-relaxed text-linen/80 md:text-lg">
          We read every request personally and reply within two working days, using the contact method you chose. Keep your reference handy in case you want to follow up.
        </p>
        <div className="mt-8 inline-block rounded-xl border border-ink-line bg-ink-soft px-5 py-4">
          <p className="font-body text-xs uppercase tracking-wider text-linen/50">Your reference</p>
          <p className="mt-1 font-body text-2xl tracking-wider text-linen">{done.reference}</p>
        </div>
        <div className="mt-10">
          <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded-full bg-[#ADA092] px-7 py-3.5 font-body text-base text-ink transition-colors hover:bg-clay-light">
            Back to the website
          </Link>
        </div>
      </div>
    );
  }

  /* ---------- step bodies ---------- */
  const e = errors;

  const packageStep = (
    <div>
      {initialPkg && values.packageId === initialPkg.id ? (
        <p className="mb-5 rounded-lg border border-clay/30 bg-clay/10 px-4 py-3 font-body text-sm text-linen/90">
          You chose <strong className="font-medium text-linen">{initialPkg.name}</strong> on our pricing. Not what you had in mind? Pick another below.
        </p>
      ) : (
        <p className="mb-5 font-body text-sm text-linen/60">Not sure? Choose “Not sure yet” and we will recommend a package.</p>
      )}

      <div role="tablist" aria-label="Package type" className="mb-4 grid grid-cols-2 gap-1 rounded-2xl border border-ink-line bg-[#22201E] p-1 sm:grid-cols-4 sm:rounded-full">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={category === c}
            onClick={() => setCategory(c)}
            className={`whitespace-nowrap rounded-full px-3 py-2 font-body text-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay sm:px-4 ${
              category === c ? "bg-[#ADA092] text-ink" : "text-linen-dim hover:text-linen"
            }`}
          >
            {CATEGORY_LABELS[c]}
            {values.packageId && getPackage(values.packageId)?.category === c && category !== c && (
              <span aria-label="(selected)" className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-clay align-middle" />
            )}
          </button>
        ))}
      </div>

      <CardChoice
        name="packageId"
        legend="Package"
        value={values.packageId}
        onChange={selectPackage}
        error={e.packageId}
        options={PACKAGES.filter((p) => p.category === category).map((p) => ({
          value: p.id,
          title: p.name,
          text: p.meta,
          aside: p.price,
          badge: p.popular ? "Popular" : undefined,
        }))}
      />
      {values.packageId && pkg && pkg.category !== category && (
        <p className="mt-3 font-body text-sm text-linen/60">
          Selected: <span className="text-linen">{pkg.name}</span> ({CATEGORY_LABELS[pkg.category]})
        </p>
      )}
    </div>
  );

  const contactStep = (
    <div className="grid gap-5 sm:grid-cols-2">
      <TextField name="firstName" label="First name" autoComplete="given-name" value={values.firstName} onChange={(v) => setField("firstName", v)} error={e.firstName} />
      <TextField name="lastName" label="Last name" autoComplete="family-name" value={values.lastName} onChange={(v) => setField("lastName", v)} error={e.lastName} />
      <TextField className="sm:col-span-2" name="email" type="email" inputMode="email" label="Email" autoComplete="email" placeholder="you@company.com" value={values.email} onChange={(v) => setField("email", v)} error={e.email} />
      <TextField className="sm:col-span-2" name="phone" type="tel" inputMode="tel" label="Phone" optional={values.preferredContact !== "PHONE"} autoComplete="tel" placeholder="+31 6 12345678" value={values.phone} onChange={(v) => setField("phone", v)} error={e.phone} />
      <div className="sm:col-span-2">
        <p className="mb-1.5 font-body text-sm text-linen">How should we reach you first?</p>
        <CardChoice
          name="preferredContact"
          legend="Preferred contact"
          columns={2}
          value={values.preferredContact}
          onChange={(v) => setField("preferredContact", v as "EMAIL" | "PHONE")}
          options={[{ value: "EMAIL", title: "Email" }, { value: "PHONE", title: "Phone call" }]}
        />
      </div>
    </div>
  );

  const companyStep = (
    <div className="grid gap-5 sm:grid-cols-2">
      <TextField className="sm:col-span-2" name="companyName" label="Company name" autoComplete="organization" value={values.companyName} onChange={(v) => setField("companyName", v)} error={e.companyName} />
      <TextField name="companyWebsite" type="url" inputMode="url" label="Company website" optional autoComplete="url" placeholder="example.com" value={values.companyWebsite} onChange={(v) => setField("companyWebsite", v)} error={e.companyWebsite} />
      <TextField name="industry" label="Industry" optional placeholder="e.g. logistics, healthcare" value={values.industry} onChange={(v) => setField("industry", v)} error={e.industry} />
      <TextField name="role" label="Your role" optional autoComplete="organization-title" placeholder="e.g. Marketing manager" value={values.role} onChange={(v) => setField("role", v)} error={e.role} />
      <SelectField name="companySize" label="Company size" optional options={COMPANY_SIZE_OPTIONS} value={values.companySize} onChange={(v) => setField("companySize", v)} error={e.companySize} />
    </div>
  );

  const projectStep = (
    <div className="space-y-6">
      <div>
        <p className="mb-2 font-body text-sm text-linen">What kind of project is it?</p>
        {typeAuto && pkg && type && (
          <p className="mb-3 font-body text-xs text-linen/55">Based on your {pkg.name} package. Change it if that is not right.</p>
        )}
        <CardChoice
          name="projectType"
          legend="Project type"
          columns={2}
          value={values.projectType}
          onChange={selectType}
          error={e.projectType}
          options={PROJECT_TYPES.map((t) => ({ value: t.id, title: t.label, text: t.hint }))}
        />
      </div>
      <TextArea
        name="description"
        label="Describe your project"
        help="What do you want to achieve? What is the situation today? Anything we should know?"
        rows={7}
        max={4000}
        value={values.description}
        onChange={(v) => setField("description", v)}
        error={e.description}
      />
    </div>
  );

  const detailsStep = (
    <div className="space-y-6">
      {(QUESTIONS[values.projectType as keyof typeof QUESTIONS] ?? []).map((q) => (
        <QuestionField key={q.id} q={q} answers={values.answers} setAnswer={setAnswer} error={e[`answers.${q.id}`]} />
      ))}
    </div>
  );

  const planningStep = (
    <div className="grid gap-5 sm:grid-cols-2">
      <SelectField name="budget" label="Budget" optional options={BUDGET_OPTIONS} value={values.budget} onChange={(v) => setField("budget", v)} error={e.budget} help="Our packages are a starting point. This helps us shape a fitting proposal." />
      <SelectField name="timeline" label="When should it be live?" optional options={TIMELINE_OPTIONS} value={values.timeline} onChange={(v) => setField("timeline", v)} error={e.timeline} />
      <div className="sm:col-span-2">
        <YesNo name="hasExistingSite" label="Do you have a website today?" optional value={values.hasExistingSite} onChange={(v) => setField("hasExistingSite", v as "yes" | "no")} error={e.hasExistingSite} />
      </div>
      {values.hasExistingSite === "yes" && (
        <TextField className="sm:col-span-2" name="existingSiteUrl" type="url" inputMode="url" label="Link to it" optional placeholder="example.com" value={values.existingSiteUrl} onChange={(v) => setField("existingSiteUrl", v)} error={e.existingSiteUrl} />
      )}
      <TextArea className="sm:col-span-2" name="inspiration" label="Websites or brands you like" optional rows={3} help="Links are welcome. Tell us what you like about them." value={values.inspiration} onChange={(v) => setField("inspiration", v)} error={e.inspiration} />
      <SelectField className="sm:col-span-2" name="referral" label="How did you find us?" optional options={REFERRAL_OPTIONS} value={values.referral} onChange={(v) => setField("referral", v)} error={e.referral} />
    </div>
  );

  const questions = QUESTIONS[values.projectType as keyof typeof QUESTIONS] ?? [];
  const detailLines = questions
    .filter((q) => {
      const v = values.answers[q.id];
      if (q.showIf && values.answers[q.showIf.id] !== q.showIf.equals) return false;
      return v !== undefined && (Array.isArray(v) ? v.length > 0 : v.trim() !== "");
    })
    .map((q) => {
      const v = values.answers[q.id];
      const text = Array.isArray(v) ? v.map((x) => labelOf(q.options ?? [], x)).join(", ") : q.kind === "select" ? labelOf(q.options ?? [], v) : q.kind === "yesno" ? (v === "yes" ? "Yes" : "No") : v;
      return [q.label, text] as const;
    });

  const Summary = ({ title, step, rows }: { title: string; step: StepId; rows: (readonly [string, string])[] }) => (
    <section className="rounded-xl border border-ink-line bg-[#22201E] p-4 md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-body text-sm uppercase tracking-wider text-linen/50">{title}</h3>
        <button type="button" onClick={() => goTo(step, -1)} className="font-body text-sm text-clay underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay">
          Edit
        </button>
      </div>
      <dl className="grid gap-x-6 gap-y-2.5 sm:grid-cols-[minmax(0,12rem)_1fr]">
        {rows.filter(([, v]) => v).map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="font-body text-sm text-linen/55">{k}</dt>
            <dd className="whitespace-pre-line break-words font-body text-sm text-linen">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );

  const reviewStep = (
    <div className="space-y-3">
      <Summary title="Package" step="package" rows={[["Package", pkg ? `${pkg.name} · ${pkg.price}` : "—"]]} />
      <Summary
        title="You"
        step="contact"
        rows={[
          ["Name", `${values.firstName} ${values.lastName}`.trim()],
          ["Email", values.email],
          ["Phone", values.phone],
          ["Preferred contact", values.preferredContact === "PHONE" ? "Phone call" : "Email"],
        ]}
      />
      <Summary
        title="Company"
        step="company"
        rows={[
          ["Company", values.companyName],
          ["Website", values.companyWebsite],
          ["Industry", values.industry],
          ["Role", values.role],
          ["Size", values.companySize ? labelOf(COMPANY_SIZE_OPTIONS, values.companySize) : ""],
        ]}
      />
      <Summary title="Project" step="project" rows={[["Type", type?.label ?? ""], ["Description", values.description.trim()]]} />
      {detailLines.length > 0 && <Summary title="Details" step="details" rows={detailLines.map(([k, v]) => [k, v] as const)} />}
      <Summary
        title="Planning"
        step="planning"
        rows={[
          ["Budget", values.budget ? labelOf(BUDGET_OPTIONS, values.budget) : ""],
          ["Live by", values.timeline ? labelOf(TIMELINE_OPTIONS, values.timeline) : ""],
          ["Current site", values.hasExistingSite === "yes" ? values.existingSiteUrl || "Yes" : values.hasExistingSite === "no" ? "No" : ""],
          ["Inspiration", values.inspiration.trim()],
          ["Found us via", values.referral ? labelOf(REFERRAL_OPTIONS, values.referral) : ""],
        ]}
      />

      {/* honeypot: invisible to people, tempting to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="company_url_confirm" tabIndex={-1} autoComplete="off" value={hp} onChange={(ev) => setHp(ev.target.value)} />
        </label>
      </div>

      <div className="pt-3">
        <label className="flex cursor-pointer items-start gap-3" data-invalid={e.consent ? "true" : undefined}>
          <input
            type="checkbox"
            checked={values.consent}
            onChange={(ev) => setField("consent", ev.target.checked)}
            aria-invalid={e.consent ? true : undefined}
            className="mt-1 h-4 w-4 shrink-0 accent-[#c9bda3]"
          />
          <span className="font-body text-sm leading-relaxed text-linen/85">
            I agree that Artivices stores the information above to respond to my request. We do not share it with third parties.
          </span>
        </label>
        {e.consent && <p role="alert" className="mt-1.5 font-body text-sm text-[#e6a493]">{e.consent}</p>}
      </div>
    </div>
  );

  const bodies: Record<StepId, React.ReactNode> = {
    package: packageStep,
    contact: contactStep,
    company: companyStep,
    project: projectStep,
    details: detailsStep,
    planning: planningStep,
    review: reviewStep,
  };

  const title = stepId === "details" && type ? `Questions about your ${type.label.toLowerCase()}` : meta.title;
  const isLast = stepId === "review";

  return (
    <div>
      {/* progress */}
      <nav aria-label="Progress" className="mb-8">
        <ol className="flex gap-1.5">
          {steps.map((s, i) => {
            const state = i < index ? "done" : i === index ? "current" : "todo";
            return (
              <li key={s} className="flex-1">
                <button
                  type="button"
                  disabled={state !== "done"}
                  onClick={() => goTo(s, -1)}
                  aria-current={state === "current" ? "step" : undefined}
                  aria-label={`${STEP_META[s].label}${state === "done" ? " (completed, go back)" : ""}`}
                  className="group block w-full py-2 disabled:cursor-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay"
                >
                  <span className={`block h-1 rounded-full transition-colors duration-300 ${state === "todo" ? "bg-ink-line" : state === "current" ? "bg-clay" : "bg-clay/60 group-hover:bg-clay"}`} />
                </button>
              </li>
            );
          })}
        </ol>
        <p className="mt-2 font-body text-sm text-linen/55" aria-live="polite">
          Step {index + 1} of {steps.length} · {meta.label}
        </p>
      </nav>

      {resumed && stepId !== "review" && (
        <p className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-sm text-linen/60">
          We saved your progress on this device.
          <button type="button" onClick={startOver} className="text-clay underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay">
            Start over
          </button>
        </p>
      )}

      <form
        ref={formRef}
        noValidate
        onSubmit={(ev) => {
          ev.preventDefault();
          next();
        }}
      >
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={stepId}
            initial={reduce ? false : { opacity: 0, x: direction * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: direction * -28 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            <h1 ref={headingRef} tabIndex={-1} className="font-body text-3xl leading-tight text-linen outline-none md:text-4xl">
              {title}
            </h1>
            <p className="mb-8 mt-2 max-w-[56ch] font-body text-base text-linen/65">{meta.text}</p>
            {bodies[stepId]}
          </motion.div>
        </AnimatePresence>

        {submitError && (
          <p role="alert" className="mt-6 rounded-lg border border-[#d98f7c]/50 bg-[#d98f7c]/10 px-4 py-3 font-body text-sm text-[#f0b9aa]">
            {submitError}
          </p>
        )}

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-ink-line pt-6">
          {index > 0 ? (
            <button type="button" onClick={back} disabled={submitting} className="focus-ring inline-flex items-center gap-2 rounded-full border border-ink-line px-6 py-3 font-body text-base text-linen transition-colors hover:border-linen/40 disabled:opacity-50">
              <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3L5 8l5 5" /></svg>
              Back
            </button>
          ) : (
            <span />
          )}
          <button type="submit" disabled={submitting} className="focus-ring inline-flex items-center gap-3 rounded-full bg-[#ADA092] px-7 py-3.5 font-body text-base text-ink transition-colors hover:bg-clay-light disabled:opacity-60">
            {submitting ? "Sending…" : isLast ? "Send request" : "Continue"}
            {!submitting && (
              <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3l5 5-5 5" /></svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
