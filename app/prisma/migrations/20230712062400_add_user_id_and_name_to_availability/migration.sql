/*
  Warnings:

  - You are about to drop the column `user` on the `Availability` table. All the data in the column will be lost.
  - You are about to alter the column `date` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `startTime` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `endTime` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `startDate` on the `Schedule` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `endDate` on the `Schedule` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `Availability` DROP COLUMN `user`,
    ADD COLUMN `name` VARCHAR(191) NULL,
    ADD COLUMN `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Event` MODIFY `date` DATETIME NOT NULL,
    MODIFY `startTime` DATETIME NOT NULL,
    MODIFY `endTime` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `Schedule` MODIFY `startDate` DATETIME NOT NULL,
    MODIFY `endDate` DATETIME NOT NULL;
