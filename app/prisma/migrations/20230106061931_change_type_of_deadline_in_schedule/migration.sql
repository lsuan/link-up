/*
  Warnings:

  - You are about to alter the column `deadline` on the `Schedule` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `Schedule` MODIFY `deadline` DATETIME(3) NULL;
