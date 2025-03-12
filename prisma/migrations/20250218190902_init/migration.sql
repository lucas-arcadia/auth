-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "ein" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "readOnly" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "companyId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "contacts_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "companyId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "readOnly" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "users_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "rules" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "userlogins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "token" TEXT,
    "action" TEXT NOT NULL,
    "fingerprint" TEXT,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "userlogins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "readOnly" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "policies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "readOnly" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "policies_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "readOnly" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "auditTrails" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "what" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "previousHash" TEXT,
    "currentHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_CompanyToService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CompanyToService_A_fkey" FOREIGN KEY ("A") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CompanyToService_B_fkey" FOREIGN KEY ("B") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PolicyToRule" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PolicyToRule_A_fkey" FOREIGN KEY ("A") REFERENCES "policies" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PolicyToRule_B_fkey" FOREIGN KEY ("B") REFERENCES "rules" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_ein_key" ON "companies"("ein");

-- CreateIndex
CREATE INDEX "companies_name_idx" ON "companies"("name");

-- CreateIndex
CREATE INDEX "companies_ein_idx" ON "companies"("ein");

-- CreateIndex
CREATE INDEX "contacts_name_idx" ON "contacts"("name");

-- CreateIndex
CREATE INDEX "contacts_email_idx" ON "contacts"("email");

-- CreateIndex
CREATE INDEX "contacts_phone_idx" ON "contacts"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_email_companyId_key" ON "contacts"("email", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_name_idx" ON "users"("name");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_companyId_key" ON "users"("email", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "services_name_key" ON "services"("name");

-- CreateIndex
CREATE INDEX "policies_action_idx" ON "policies"("action");

-- CreateIndex
CREATE UNIQUE INDEX "policies_serviceId_action_key" ON "policies"("serviceId", "action");

-- CreateIndex
CREATE UNIQUE INDEX "rules_name_key" ON "rules"("name");

-- CreateIndex
CREATE INDEX "rules_name_idx" ON "rules"("name");

-- CreateIndex
CREATE UNIQUE INDEX "auditTrails_currentHash_key" ON "auditTrails"("currentHash");

-- CreateIndex
CREATE INDEX "auditTrails_userId_idx" ON "auditTrails"("userId");

-- CreateIndex
CREATE INDEX "auditTrails_action_idx" ON "auditTrails"("action");

-- CreateIndex
CREATE INDEX "auditTrails_entity_idx" ON "auditTrails"("entity");

-- CreateIndex
CREATE INDEX "auditTrails_entityId_idx" ON "auditTrails"("entityId");

-- CreateIndex
CREATE INDEX "auditTrails_ip_idx" ON "auditTrails"("ip");

-- CreateIndex
CREATE INDEX "auditTrails_createdAt_idx" ON "auditTrails"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "_CompanyToService_AB_unique" ON "_CompanyToService"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanyToService_B_index" ON "_CompanyToService"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PolicyToRule_AB_unique" ON "_PolicyToRule"("A", "B");

-- CreateIndex
CREATE INDEX "_PolicyToRule_B_index" ON "_PolicyToRule"("B");
