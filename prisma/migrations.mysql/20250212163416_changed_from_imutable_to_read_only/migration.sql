/*
  Warnings:

  - You are about to drop the column `imutable` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `imutable` on the `policies` table. All the data in the column will be lost.
  - You are about to drop the column `imutable` on the `rules` table. All the data in the column will be lost.
  - You are about to drop the column `imutable` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `imutable` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `companies` DROP COLUMN `imutable`,
    ADD COLUMN `readOnly` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `policies` DROP COLUMN `imutable`,
    ADD COLUMN `readOnly` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `rules` DROP COLUMN `imutable`,
    ADD COLUMN `readOnly` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `services` DROP COLUMN `imutable`,
    ADD COLUMN `readOnly` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `imutable`,
    ADD COLUMN `readOnly` BOOLEAN NOT NULL DEFAULT false;
