/*
  Warnings:

  - You are about to alter the column `numberOfEvents` on the `Schedule` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedTinyInt`.

*/
-- AlterTable
ALTER TABLE `Schedule` ADD COLUMN `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `startDate` DATE NOT NULL,
    MODIFY `endDate` DATE NOT NULL,
    MODIFY `numberOfEvents` TINYINT UNSIGNED NOT NULL;
