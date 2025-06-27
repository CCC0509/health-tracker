/*
  Warnings:

  - Made the column `category` on table `Nutrient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Nutrient" ALTER COLUMN "category" SET NOT NULL;
