/*
  Warnings:

  - You are about to alter the column `startDate` on the `Schedule` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `endDate` on the `Schedule` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `Schedule` ADD COLUMN `timezone` VARCHAR(191) NOT NULL DEFAULT 'America/Los_Angeles',
    MODIFY `startDate` DATETIME NOT NULL,
    MODIFY `endDate` DATETIME NOT NULL;
