-- AlterTable: dobrowolna zgoda na marketing e-mail
ALTER TABLE "User" ADD COLUMN "marketingConsent" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "marketingConsentAt" TIMESTAMP(3);
