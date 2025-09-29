-- AlterTable
ALTER TABLE `user` ADD COLUMN `createdAt` DATETIME(3) NULL,
    ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `updatedAt` DATETIME(3) NULL;
