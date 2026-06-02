-- AlterTable
ALTER TABLE "entries" ADD COLUMN     "antonyms" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "synonyms" TEXT[] DEFAULT ARRAY[]::TEXT[];
