/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `phoneNumber`,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    MODIFY `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `roles` VARCHAR(191) NOT NULL DEFAULT 'user';
