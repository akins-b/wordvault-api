-- AlterTable
ALTER TABLE "users" ADD COLUMN     "pushEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "weeklyEmailEnabled" BOOLEAN NOT NULL DEFAULT true;
