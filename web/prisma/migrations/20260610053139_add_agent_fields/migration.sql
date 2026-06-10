-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "agentVersion" TEXT,
ADD COLUMN     "enriched" JSONB,
ADD COLUMN     "priority" TEXT,
ADD COLUMN     "score" INTEGER,
ADD COLUMN     "scoreReason" TEXT,
ADD COLUMN     "serviceType" TEXT,
ADD COLUMN     "suggestedMsg" TEXT;
