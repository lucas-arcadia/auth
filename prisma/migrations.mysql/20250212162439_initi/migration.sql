-- CreateTable
CREATE TABLE `companies` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `surname` VARCHAR(256) NOT NULL,
    `ein` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `imutable` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `companies_ein_key`(`ein`),
    INDEX `companies_name_idx`(`name`),
    INDEX `companies_ein_idx`(`ein`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contacts` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `email` VARCHAR(256) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `companyId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `contacts_name_idx`(`name`),
    INDEX `contacts_email_idx`(`email`),
    INDEX `contacts_phone_idx`(`phone`),
    UNIQUE INDEX `contacts_email_companyId_key`(`email`, `companyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `email` VARCHAR(256) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `hash` LONGTEXT NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `companyId` VARCHAR(191) NOT NULL,
    `ruleId` VARCHAR(191) NOT NULL,
    `imutable` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_name_idx`(`name`),
    INDEX `users_email_idx`(`email`),
    INDEX `users_phone_idx`(`phone`),
    UNIQUE INDEX `users_email_companyId_key`(`email`, `companyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userlogins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `token` LONGTEXT NULL,
    `action` VARCHAR(191) NOT NULL,
    `fingerprint` VARCHAR(191) NULL,
    `expiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `services` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `imutable` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `services_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `policies` (
    `id` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `imutable` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `policies_action_idx`(`action`),
    UNIQUE INDEX `policies_serviceId_action_key`(`serviceId`, `action`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rules` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `description` TEXT NOT NULL,
    `imutable` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `rules_name_key`(`name`),
    INDEX `rules_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auditTrails` (
    `id` VARCHAR(191) NOT NULL,
    `action` VARCHAR(256) NOT NULL,
    `entity` VARCHAR(256) NOT NULL,
    `entityId` VARCHAR(256) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `what` TEXT NOT NULL,
    `ip` VARCHAR(256) NOT NULL,
    `previousHash` VARCHAR(256) NULL,
    `currentHash` VARCHAR(256) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `auditTrails_currentHash_key`(`currentHash`),
    INDEX `auditTrails_userId_idx`(`userId`),
    INDEX `auditTrails_action_idx`(`action`),
    INDEX `auditTrails_entity_idx`(`entity`),
    INDEX `auditTrails_entityId_idx`(`entityId`),
    INDEX `auditTrails_ip_idx`(`ip`),
    INDEX `auditTrails_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CompanyToService` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CompanyToService_AB_unique`(`A`, `B`),
    INDEX `_CompanyToService_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PolicyToRule` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PolicyToRule_AB_unique`(`A`, `B`),
    INDEX `_PolicyToRule_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_ruleId_fkey` FOREIGN KEY (`ruleId`) REFERENCES `rules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userlogins` ADD CONSTRAINT `userlogins_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `policies` ADD CONSTRAINT `policies_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CompanyToService` ADD CONSTRAINT `_CompanyToService_A_fkey` FOREIGN KEY (`A`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CompanyToService` ADD CONSTRAINT `_CompanyToService_B_fkey` FOREIGN KEY (`B`) REFERENCES `services`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PolicyToRule` ADD CONSTRAINT `_PolicyToRule_A_fkey` FOREIGN KEY (`A`) REFERENCES `policies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PolicyToRule` ADD CONSTRAINT `_PolicyToRule_B_fkey` FOREIGN KEY (`B`) REFERENCES `rules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
