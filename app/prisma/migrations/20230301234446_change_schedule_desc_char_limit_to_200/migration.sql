/*
  Warnings:

  - You are about to alter the column `startDate` on the `Schedule` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `endDate` on the `Schedule` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `Schedule` MODIFY `description` VARCHAR(200) NULL,
    MODIFY `startDate` DATETIME NOT NULL,
    MODIFY `endDate` DATETIME NOT NULL;
