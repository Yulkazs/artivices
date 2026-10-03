"use client";

import { useId, type ReactNode } from "react";
import { isVisible, type Question } from "@/lib/questions";
import type { Answers } from "@/lib/request-schema";

/* Shared look. Matches the Pricing cards: ink background, #22201E panels, #ADA092 accent. */
export const inputBase =
  "w-full rounded-lg border bg-ink-soft px-4 py-3 font-body text-base text-linen placeholder:text-linen/35 transition-colors duration-200 hover:border-linen/30 focus:border-clay focus:outline-none focus-visible:ring-2 focus-visible:ring-clay/40 disabled:opacity-50";

const borderFor = (error?: string) => (error ? "border-[#d98f7c]" : "border-ink-line");

/* ---------- wrapper: label, help text, error ---------- */

export function Field({
  label,
  help,
  error,
  optional,
  htmlFor,
  children,
  className = "",
}: {
  label: string;
  help?: string;
  error?: string;
  optional?: boolean;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline justify-between gap-3 font-body text-sm text-linen">
        <span>{label}</span>
        {optional && <span className="text-xs text-linen/45">Optional</span>}
      </label>
      {help && <p id={htmlFor ? `${htmlFor}-help` : undefined} className="mb-2 font-body text-xs leading-relaxed text-linen/55">{help}</p>}
      {children}
      {error && (
        <p id={htmlFor ? `${htmlFor}-error` : undefined} role="alert" className="mt-1.5 font-body text-sm text-[#e6a493]">
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------- text-like inputs ---------- */

type BaseProps = {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  help?: string;
  optional?: boolean;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
};

export function TextField({
  name, label, value, onChange, error, help, optional, placeholder, autoComplete, className,
  type = "text", inputMode,
}: BaseProps & { type?: "text" | "email" | "tel" | "url"; inputMode?: "text" | "email" | "tel" | "url" }) {
  const id = useId();
  return (
    <Field label={label} help={help} error={error} optional={optional} htmlFor={id} className={className}>
      <input
        id={id}
        name={name}
        data-field={name}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={[help ? `${id}-help` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined}
        className={`${inputBase} ${borderFor(error)}`}
      />
    </Field>
  );
}

export function TextArea({
  name, label, value, onChange, error, help, optional, placeholder, className, rows = 5, max,
}: BaseProps & { rows?: number; max?: number }) {
  const id = useId();
  return (
    <Field label={label} help={help} error={error} optional={optional} htmlFor={id} className={className}>
      <textarea
        id={id}
        name={name}
        data-field={name}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={[help ? `${id}-help` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined}
        className={`${inputBase} resize-y leading-relaxed ${borderFor(error)}`}
      />
      {max !== undefined && (
        <p className="mt-1 text-right font-body text-xs text-linen/40" aria-hidden>
          {value.length} / {max}
        </p>
      )}
    </Field>
  );
}

export function SelectField({
  name, label, value, onChange, options, error, help, optional, className, placeholder = "Select…",
}: Omit<BaseProps, "placeholder" | "autoComplete"> & { options: { value: string; label: string }[]; placeholder?: string }) {
  const id = useId();
  return (
    <Field label={label} help={help} error={error} optional={optional} htmlFor={id} className={className}>
      <div className="relative">
        <select
          id={id}
          name={name}
          data-field={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={[help ? `${id}-help` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined}
          className={`${inputBase} appearance-none pr-10 ${value === "" ? "text-linen/45" : ""} ${borderFor(error)}`}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-ink text-linen">
              {o.label}
            </option>
          ))}
        </select>
        <svg aria-hidden viewBox="0 0 16 16" className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-linen/60" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6l4 4 4-4" />
        </svg>
      </div>
    </Field>
  );
}

/* ---------- choices ---------- */

const chip = (checked: boolean) =>
  `cursor-pointer select-none rounded-full border px-4 py-2 font-body text-sm transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-clay/60 ${
    checked ? "border-clay bg-clay text-ink" : "border-ink-line text-linen/85 hover:border-linen/40"
  }`;

export function MultiChips({
  name, label, options, value, onChange, error, help, optional, className,
}: {
  name: string; label: string; options: { value: string; label: string }[];
  value: string[]; onChange: (v: string[]) => void; error?: string; help?: string; optional?: boolean; className?: string;
}) {
  const toggle = (v: string) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  return (
    <fieldset className={className} data-field={name} data-invalid={error ? "true" : undefined}>
      <legend className="mb-1.5 flex w-full items-baseline justify-between gap-3 font-body text-sm text-linen">
        <span>{label}</span>
        {optional && <span className="text-xs text-linen/45">Optional</span>}
      </legend>
      {help && <p className="mb-2 font-body text-xs text-linen/55">{help}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const checked = value.includes(o.value);
          return (
            <label key={o.value} className="relative">
              <input type="checkbox" className="peer sr-only" checked={checked} onChange={() => toggle(o.value)} />
              <span className={`inline-block ${chip(checked)}`}>{o.label}</span>
            </label>
          );
        })}
      </div>
      {error && <p role="alert" className="mt-1.5 font-body text-sm text-[#e6a493]">{error}</p>}
    </fieldset>
  );
}

export function YesNo({
  name, label, value, onChange, error, help, optional, className,
}: {
  name: string; label: string; value: string; onChange: (v: string) => void; error?: string; help?: string; optional?: boolean; className?: string;
}) {
  const group = useId();
  return (
    <fieldset className={className} data-field={name} data-invalid={error ? "true" : undefined}>
      <legend className="mb-1.5 flex w-full items-baseline justify-between gap-3 font-body text-sm text-linen">
        <span>{label}</span>
        {optional && <span className="text-xs text-linen/45">Optional</span>}
      </legend>
      {help && <p className="mb-2 font-body text-xs text-linen/55">{help}</p>}
      <div className="flex gap-2">
        {(["yes", "no"] as const).map((v) => (
          <label key={v} className="relative">
            <input type="radio" name={group} className="peer sr-only" checked={value === v} onChange={() => onChange(v)} />
            <span className={`inline-block min-w-[4.5rem] text-center ${chip(value === v)}`}>{v === "yes" ? "Yes" : "No"}</span>
          </label>
        ))}
      </div>
      {error && <p role="alert" className="mt-1.5 font-body text-sm text-[#e6a493]">{error}</p>}
    </fieldset>
  );
}

/** Radio cards: title, optional line, optional right-hand text. Used for packages and project types. */
export function CardChoice({
  name, legend, options, value, onChange, error, columns = 1,
}: {
  name: string; legend: string;
  options: { value: string; title: string; text?: string; aside?: string; badge?: string }[];
  value: string; onChange: (v: string) => void; error?: string; columns?: 1 | 2;
}) {
  const group = useId();
  return (
    <fieldset data-field={name} data-invalid={error ? "true" : undefined}>
      <legend className="sr-only">{legend}</legend>
      <div className={`grid gap-2.5 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
        {options.map((o) => {
          const checked = value === o.value;
          return (
            <label key={o.value} className="relative block">
              <input type="radio" name={group} className="peer sr-only" checked={checked} onChange={() => onChange(o.value)} />
              <span
                className={`flex h-full cursor-pointer items-start justify-between gap-4 rounded-xl border px-4 py-3.5 transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-clay/60 ${
                  checked ? "border-clay bg-[#2b2824]" : "border-ink-line bg-[#22201E] hover:border-linen/35"
                }`}
              >
                <span className="min-w-0">
                  <span className="flex items-center gap-2 font-body text-base text-linen">
                    {o.title}
                    {o.badge && <span className="rounded-full bg-clay px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-ink">{o.badge}</span>}
                  </span>
                  {o.text && <span className="mt-0.5 block font-body text-sm text-linen/55">{o.text}</span>}
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  {o.aside && <span className="hidden text-right font-body text-sm text-linen/70 sm:block">{o.aside}</span>}
                  <span aria-hidden className={`grid h-5 w-5 place-items-center rounded-full border ${checked ? "border-clay bg-clay" : "border-linen/30"}`}>
                    {checked && <svg viewBox="0 0 12 12" className="h-3 w-3 text-ink" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.5l2.2 2.2 4.8-5" /></svg>}
                  </span>
                </span>
              </span>
            </label>
          );
        })}
      </div>
      {error && <p role="alert" className="mt-2 font-body text-sm text-[#e6a493]">{error}</p>}
    </fieldset>
  );
}

/* ---------- a tailored question, rendered from lib/questions.ts ---------- */

export function QuestionField({
  q, answers, setAnswer, error,
}: {
  q: Question; answers: Answers; setAnswer: (id: string, v: string | string[]) => void; error?: string;
}) {
  if (!isVisible(q, answers)) return null;
  const name = `answers.${q.id}`;
  const str = typeof answers[q.id] === "string" ? (answers[q.id] as string) : "";
  const arr = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];
  const optional = !q.required;
  const common = { name, label: q.label, help: q.help, error, optional };

  switch (q.kind) {
    case "text":
      return <TextField {...common} value={str} onChange={(v) => setAnswer(q.id, v)} placeholder={q.placeholder} />;
    case "url":
      return <TextField {...common} type="url" inputMode="url" value={str} onChange={(v) => setAnswer(q.id, v)} placeholder={q.placeholder ?? "example.com"} />;
    case "textarea":
      return <TextArea {...common} rows={4} value={str} onChange={(v) => setAnswer(q.id, v)} placeholder={q.placeholder} />;
    case "select":
      return <SelectField {...common} options={q.options ?? []} value={str} onChange={(v) => setAnswer(q.id, v)} />;
    case "multi":
      return <MultiChips {...common} options={q.options ?? []} value={arr} onChange={(v) => setAnswer(q.id, v)} />;
    case "yesno":
      return <YesNo {...common} value={str} onChange={(v) => setAnswer(q.id, v)} />;
  }
}
