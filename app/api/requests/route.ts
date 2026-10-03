import { randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/prisma";
import { getPackage } from "@/lib/packages";
import {
  normalizeUrl,
  requestSchema,
  sanitizeAnswers,
  validateAll,
} from "@/lib/request-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 60_000;
const MIN_FILL_MS = 8_000; // a human cannot fill seven steps faster than this
const MAX_PER_EMAIL_PER_HOUR = 3;

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I/L
function newReference() {
  let s = "";
  for (let i = 0; i < 6; i++) s += ALPHABET[randomInt(ALPHABET.length)];
  return `ART-${s}`;
}

const orNull = (v: string) => (v.trim() === "" ? null : v.trim());

export async function POST(req: Request) {
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ ok: false, error: "Unsupported request." }, { status: 415 });
  }

  let raw: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: "Request is too large." }, { status: 413 });
    }
    raw = JSON.parse(text);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const { values, hp, startedAt, source, initialPackageId } = parsed.data;

  // Bots: pretend it worked, store nothing.
  if (hp !== "" || Date.now() - startedAt < MIN_FILL_MS) {
    return NextResponse.json({ ok: true, reference: newReference() });
  }

  // Same rules as the form, on the server.
  const errors = validateAll(values);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, error: "Please check the form.", errors }, { status: 400 });
  }
  if (!getPackage(values.packageId)) {
    return NextResponse.json({ ok: false, error: "Invalid package." }, { status: 400 });
  }

  const email = values.email.trim().toLowerCase();
  const description = values.description.trim();

  try {
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recent = await db.projectRequest.findMany({
      where: { email, createdAt: { gte: hourAgo } },
      select: { reference: true, description: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    // Double click or retry: hand back the request we already have.
    const tenMinAgo = Date.now() - 10 * 60 * 1000;
    const duplicate = recent.find((r) => r.description === description && r.createdAt.getTime() >= tenMinAgo);
    if (duplicate) return NextResponse.json({ ok: true, reference: duplicate.reference });

    if (recent.length >= MAX_PER_EMAIL_PER_HOUR) {
      return NextResponse.json(
        { ok: false, error: "You have sent several requests in a short time. Please email us at studio@artivices.com." },
        { status: 429 },
      );
    }

    const data: Prisma.ProjectRequestCreateInput = {
      reference: "",
      packageId: values.packageId,
      source,
      packageChanged: initialPackageId !== "" && initialPackageId !== values.packageId,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email,
      phone: orNull(values.phone),
      preferredContact: values.preferredContact,
      companyName: values.companyName.trim(),
      companyWebsite: orNull(normalizeUrl(values.companyWebsite)),
      industry: orNull(values.industry),
      role: orNull(values.role),
      companySize: orNull(values.companySize),
      projectType: values.projectType,
      description,
      details: sanitizeAnswers(values.projectType, values.answers),
      budget: orNull(values.budget),
      timeline: orNull(values.timeline),
      hasExistingSite: values.hasExistingSite === "" ? null : values.hasExistingSite === "yes",
      existingSiteUrl: orNull(normalizeUrl(values.existingSiteUrl)),
      inspiration: orNull(values.inspiration),
      referral: orNull(values.referral),
      privacyConsentAt: new Date(),
    };

    // The reference is random; retry on the (very unlikely) collision.
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const created = await db.projectRequest.create({
          data: { ...data, reference: newReference() },
          select: { reference: true },
        });
        return NextResponse.json({ ok: true, reference: created.reference });
      } catch (e) {
        const collision = e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";
        if (!collision) throw e;
      }
    }
    throw new Error("Could not create a unique reference");
  } catch (e) {
    console.error("[requests] failed to save", e);
    return NextResponse.json(
      { ok: false, error: "Something went wrong on our side. Please try again, or email studio@artivices.com." },
      { status: 500 },
    );
  }
}
