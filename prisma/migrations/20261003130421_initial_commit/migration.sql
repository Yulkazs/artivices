-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('NEW', 'IN_REVIEW', 'QUOTE_SENT', 'ACCEPTED', 'DECLINED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('EMAIL', 'PHONE');

-- CreateTable
CREATE TABLE "ProjectRequest" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "packageId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "packageChanged" BOOLEAN NOT NULL DEFAULT false,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "preferredContact" "ContactMethod" NOT NULL DEFAULT 'EMAIL',
    "companyName" TEXT NOT NULL,
    "companyWebsite" TEXT,
    "industry" TEXT,
    "role" TEXT,
    "companySize" TEXT,
    "projectType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "budget" TEXT,
    "timeline" TEXT,
    "hasExistingSite" BOOLEAN,
    "existingSiteUrl" TEXT,
    "inspiration" TEXT,
    "referral" TEXT,
    "privacyConsentAt" TIMESTAMP(3) NOT NULL,
    "internalNotes" TEXT,

    CONSTRAINT "ProjectRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectRequest_reference_key" ON "ProjectRequest"("reference");

-- CreateIndex
CREATE INDEX "ProjectRequest_status_createdAt_idx" ON "ProjectRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ProjectRequest_email_createdAt_idx" ON "ProjectRequest"("email", "createdAt");
