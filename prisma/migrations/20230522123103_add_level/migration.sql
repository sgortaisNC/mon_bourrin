/*
  Warnings:

  - Added the required column `currentxp` to the `Brute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `Brute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxxp` to the `Brute` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `brute` ADD COLUMN `currentxp` INTEGER NOT NULL,
    ADD COLUMN `level` INTEGER NOT NULL,
    ADD COLUMN `maxxp` INTEGER NOT NULL;
