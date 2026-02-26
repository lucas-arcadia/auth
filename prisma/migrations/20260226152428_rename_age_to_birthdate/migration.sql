-- RenameColumn
ALTER TABLE `User` RENAME COLUMN `age` TO `birthdate`;

-- AlterTable (make nullable)
ALTER TABLE `User` MODIFY COLUMN `birthdate` INTEGER NULL;
