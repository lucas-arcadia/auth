import { PrismaClient } from "@prisma/client";
import * as crypto from "crypto";
const prisma = new PrismaClient();

try {
  /* ************************************************************************ */
  /* Services
  /* ************************************************************************ */
  const CompanyService = await prisma.service.create({
    data: {
      name: "Company",
      description: "Business management service",
      imutable: true,
    },
  });

  const OmbudsmanService = await prisma.service.create({
    data: {
      name: "Ombudsman",
      description: "Ombudsman Management Service",
      imutable: true,
    },
  });

  const FileService = await prisma.service.create({
    data: {
      name: "File",
      description: "File Management Service",
      imutable: true,
    },
  });

  /* ************************************************************************ */
  /* Company's policies
  /* ************************************************************************ */
  const PolicyAddCompany = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Add a new Company",
      action: "AddCompany",
      imutable: true,
    },
  });

  const PolicyGetCompany = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Get a company's information",
      action: "GetCompany",
      imutable: true,
    },
  });

  const PolicyListCompanies = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "List companies",
      action: "ListCompanies",
      imutable: true,
    },
  });

  const PolicyUpdateCompany = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Update a company",
      action: "UpdateCompany",
      imutable: true,
    },
  });

  const PolicyDeleteCompany = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Delete a Company",
      action: "DeleteCompany",
      imutable: true,
    },
  });

  const PolicyDeleteService = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Delete a service",
      action: "DeleteService",
      imutable: true,
    },
  });

  /* ************************************************************************ */
  /* Service's policies
  /* ************************************************************************ */
  const PolicyAddService = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Add a new service",
      action: "AddService",
      imutable: true,
    },
  });

  const PolicyGetService = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Get a service's information",
      action: "GetService",
      imutable: true,
    },
  });

  const PolicyListServices = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "List services",
      action: "ListServices",
      imutable: true,
    },
  });

  const PolicyUpdateService = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Update a service",
      action: "UpdateService",
      imutable: true,
    },
  });

  /* ************************************************************************ */
  /* Contact's policies
  /* ************************************************************************ */
  const PolicyAddContact = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Add a new contact",
      action: "AddContact",
      imutable: true,
    },
  });

  const PolicyGetContact = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Get a contact's information",
      action: "GetContact",
      imutable: true,
    },
  });

  const PolicyListContacts = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "List contacts",
      action: "ListContacts",
      imutable: true,
    },
  });

  const PolicyUpdateContact = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Update a contact",
      action: "UpdateContact",
      imutable: true,
    },
  });

  const PolicyDeleteContact = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Delete a contact",
      action: "DeleteContact",
      imutable: true,
    },
  });

  /* ************************************************************************ */
  /* User's policies
  /* ************************************************************************ */
  const PolicyAddUser = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Add a new user",
      action: "AddUser",
      imutable: true,
    },
  });

  const PolicyGetUser = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Get a user's information",
      action: "GetUser",
      imutable: true,
    },
  });

  const PolicyListUsers = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "List users",
      action: "ListUsers",
      imutable: true,
    },
  });

  const PolicyUpdateUser = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Update a user",
      action: "UpdateUser",
      imutable: true,
    },
  });

  const PolicyDeleteUser = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Delete a user",
      action: "DeleteUser",
      imutable: true,
    },
  });

  const PolicyAboutMe = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Get information about your user",
      action: "AboutMe",
      imutable: true,
    },
  });

  const PolicyGetPermission = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Get a user's permissions",
      action: "GetPermission",
      imutable: true,
    },
  });

  const PolicySetPermission = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Set a user's permissions",
      action: "SetPermission",
      imutable: true,
    },
  });

  const PolicyPassword = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Set a user's password",
      action: "Password",
      imutable: true,
    },
  });

  /* ************************************************************************ */
  /* Policy's policies
  /* ************************************************************************ */
  const PolicyAddPolicy = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Add a new policy",
      action: "AddPolicy",
      imutable: true,
    },
  });

  const PolicyGetPolicy = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Get a policy's information",
      action: "GetPolicy",
      imutable: true,
    },
  });

  const PolicyListPolicies = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "List policies",
      action: "ListPolicies",
      imutable: true,
    },
  });

  const PolicyUpdatePolicy = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Update a policy",
      action: "UpdatePolicy",
      imutable: true,
    },
  });

  const PolicyDeletePolicy = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Delete a policy",
      action: "DeletePolicy",
      imutable: true,
    },
  });

  /* ************************************************************************ */
  /* Rule's policies
  /* ************************************************************************ */
  const PolicyAddRule = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Add a new rule",
      action: "AddRule",
      imutable: true,
    },
  });

  const PolicyGetRule = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Get a rule's information",
      action: "GetRule",
      imutable: true,
    },
  });

  const PolicyListRules = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "List rules",
      action: "ListRules",
      imutable: true,
    },
  });

  const PolicyUpdateRule = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Update a rule",
      action: "UpdateRule",
      imutable: true,
    },
  });

  const PolicyDeleteRule = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Delete a rule",
      action: "DeleteRule",
      imutable: true,
    },
  });

  /* ************************************************************************ */
  /* Ombudsman service policies
  /* ************************************************************************ */
  const policyAddManifestation = await prisma.policy.create({
    data: {
      serviceId: OmbudsmanService.id,
      description: "Add a new manifestation",
      action: "AddManifestation",
      imutable: true,
    },
  });

  const policyGetManifestation = await prisma.policy.create({
    data: {
      serviceId: OmbudsmanService.id,
      description: "Get a manifestation's information",
      action: "GetManifestation",
      imutable: true,
    },
  });

  const policyListManifestations = await prisma.policy.create({
    data: {
      serviceId: OmbudsmanService.id,
      description: "List manifestations",
      action: "ListManifestation",
      imutable: true,
    },
  });

  const policyUpdateManifestation = await prisma.policy.create({
    data: {
      serviceId: OmbudsmanService.id,
      description: "Update a manifestation",
      action: "UpdateManifestation",
      imutable: true,
    },
  });

  const policyAddManifestationResponse = await prisma.policy.create({
    data: {
      serviceId: OmbudsmanService.id,
      description: "Add a new response to manifestation",
      action: "AddManifestationResponse",
      imutable: true,
    },
  });

  const policyListManifestationResponses = await prisma.policy.create({
    data: {
      serviceId: OmbudsmanService.id,
      description: "List responses of a manifestation",
      action: "ListManifestationResponses",
      imutable: true,
    },
  });

  /* ************************************************************************ */
  /* File service policies
  /* ************************************************************************ */
  const policyAddFile = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "Add a new file",
      action: "AddFile",
      imutable: true,
    },
  });

  const policyAddFolder = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "Add a new folder",
      action: "AddFolder",
      imutable: true,
    },
  });

  const policyGetFile = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "Get a file's information",
      action: "GetFile",
      imutable: true,
    },
  });

  const policyGetFolder = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "Get a folder's information",
      action: "GetFolder",
      imutable: true,
    },
  });

  const policyListFiles = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "List files",
      action: "ListFiles",
      imutable: true,
    },
  });

  const policyListFolders = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "List folders",
      action: "ListFolders",
      imutable: true,
    },
  });

  const policyUpdateFile = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "Update a file",
      action: "UpdateFile",
      imutable: true,
    },
  });

  const policyUpdateFolder = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "Update a folder",
      action: "UpdateFolder",
      imutable: true,
    },
  });

  const policyDeleteFile = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "Delete a file",
      action: "DeleteFile",
      imutable: true,
    },
  });

  const policyDeleteFolder = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "Delete a folder",
      action: "DeleteFolder",
      imutable: true,
    },
  });

  const policyGetFileVersion = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "Get a file's version",
      action: "GetFileVersion",
      imutable: true,
    },
  });

  const policyListFileVersions = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "List a file's versions",
      action: "ListFileVersions",
      imutable: true,
    },
  });

  const policyDeleteFileVersion = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "Delete a file's version",
      action: "DeleteFileVersion",
      imutable: true,
    },
  });

  /* ************************************************************************ */
  /* General admin rules
  /* ************************************************************************ */
  const adminRules = await prisma.rule.create({
    data: {
      name: "Administrator",
      description: "General Administrator",
      imutable: true,
    },
  });

  await prisma.rule.update({
    where: { id: adminRules.id },
    data: {
      Policy: {
        set: [PolicyAddCompany, PolicyGetCompany, PolicyListCompanies, PolicyUpdateCompany, PolicyDeleteCompany, PolicyAddService, PolicyGetService, PolicyListServices, PolicyUpdateService, PolicyDeleteService, PolicyAddContact, PolicyGetContact, PolicyListContacts, PolicyUpdateContact, PolicyDeleteContact, PolicyAddUser, PolicyGetUser, PolicyListUsers, PolicyUpdateUser, PolicyDeleteUser, PolicyAddPolicy, PolicyGetPolicy, PolicyListPolicies, PolicyUpdatePolicy, PolicyDeletePolicy, PolicyAddRule, PolicyGetRule, PolicyListRules, PolicyUpdateRule, PolicyDeleteRule, PolicyAboutMe, PolicyGetPermission, PolicySetPermission, PolicyPassword],
      },
    },
  });

  /* ************************************************************************ */
  /* General manager rules
  /* ************************************************************************ */
  const managerRules = await prisma.rule.create({
    data: {
      name: "Manager",
      description: "General Manager",
      imutable: true,
    },
  });

  await prisma.rule.update({
    where: { id: managerRules.id },
    data: {
      Policy: {
        set: [PolicyGetCompany, PolicyListCompanies, PolicyUpdateCompany, PolicyGetService, PolicyListServices, PolicyUpdateService, PolicyDeleteService, PolicyAddContact, PolicyGetContact, PolicyListContacts, PolicyUpdateContact, PolicyDeleteContact, PolicyAddUser, PolicyGetUser, PolicyListUsers, PolicyUpdateUser, PolicyDeleteUser, PolicyAddPolicy, PolicyGetPolicy, PolicyListPolicies, PolicyUpdatePolicy, PolicyDeletePolicy, PolicyAddRule, PolicyGetRule, PolicyListRules, PolicyUpdateRule, PolicyDeleteRule, PolicyAboutMe, PolicyGetPermission, PolicySetPermission, PolicyPassword],
      },
    },
  });

  /* ************************************************************************ */
  /* Company manager rules
  /* ************************************************************************ */
  const companyManagerRules = await prisma.rule.create({
    data: {
      name: "CompanyManager",
      description: "Company Manager",
      imutable: true,
    },
  });

  await prisma.rule.update({
    where: { id: companyManagerRules.id },
    data: {
      Policy: {
        set: [PolicyGetCompany, PolicyUpdateCompany, PolicyGetService, PolicyListServices, PolicyAddContact, PolicyGetContact, PolicyListContacts, PolicyUpdateContact, PolicyDeleteContact, PolicyAddUser, PolicyGetUser, PolicyListUsers, PolicyUpdateUser, PolicyDeleteUser, PolicyAboutMe, PolicyGetPermission, PolicyPassword],
      },
    },
  });

  /* ************************************************************************ */
  /* Ombudsman manager rules
  /* ************************************************************************ */
  const ombudsmanManagerRules = await prisma.rule.create({
    data: {
      name: "OmbudsmanManager",
      description: "Ombudsman Manager",
      imutable: true,
    },
  });

  await prisma.rule.update({
    where: { id: ombudsmanManagerRules.id },
    data: {
      Policy: {
        set: [policyGetManifestation, policyAddManifestationResponse, policyListManifestations, policyListManifestationResponses, policyUpdateManifestation],
      },
    },
  });

  /* ************************************************************************ */
  /* File manager rules
  /* ************************************************************************ */
  const fileManagerRules = await prisma.rule.create({
    data: {
      name: "FileManager",
      description: "File Manager",
      imutable: true,
    },
  });

  await prisma.rule.update({
    where: { id: fileManagerRules.id },
    data: {
      Policy: {
        set: [policyAddFile, policyAddFolder, policyGetFile, policyGetFolder, policyListFiles, policyListFolders, policyUpdateFile, policyUpdateFolder, policyDeleteFile, policyDeleteFolder, policyGetFileVersion, policyListFileVersions, policyDeleteFileVersion, PolicyAboutMe, PolicyGetPermission, PolicyPassword],
      },
    },
  });

  /* ************************************************************************ */
  /* Comapnies
  /* ************************************************************************ */
  const csitechCompany = await prisma.company.create({
    data: {
      name: "CSI Tech Informática Ltda - ME",
      surname: "CSI Tech",
      ein: "13019142000142",
      imutable: true,
    },
  });

  await prisma.company.update({
    where: { id: csitechCompany.id },
    data: {
      Service: {
        set: [CompanyService, OmbudsmanService, FileService],
      },
    },
  });

  const rbmCompany = await prisma.company.create({
    data: {
      id: "91443357-278d-4f53-a7bf-0b00ac4fc394",
      name: "RBM - Recuperadora Brasileira de Metais S/A",
      surname: "RBM",
      ein: "12698756000135",
      imutable: false,
    },
  });

  await prisma.company.update({
    where: { id: rbmCompany.id },
    data: {
      Service: {
        set: [CompanyService, OmbudsmanService],
      },
    },
  });

  /* ************************************************************************ */
  /* Users
  /* ************************************************************************ */
  // General Administrators
  const irapuanUser = await prisma.user.create({
    data: {
      name: "Irapuan Menezes",
      email: "irapuan.menezes@csitech.com.br",
      phone: "+551140632535",
      hash: "JGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTIscD0xJEs1dXEwaW95aUdQOTlCazRlaTZRa3dJdzZERGVZZnBvaDc2QklHQkR5S00kaWJIcFdaNXIwSmlpMk9MMmVtcDZYR1hlWXJsNkpYeVEwNUtiZHpkdm1aOA==",
      companyId: csitechCompany.id,
      ruleId: adminRules.id,
      imutable: true,
    },
  });

  await prisma.user.create({
    data: {
      name: "Lucas Menezes",
      email: "lucas.menezes@csitech.com.br",
      phone: "+551140632535",
      hash: "JGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTIscD0xJEs1dXEwaW95aUdQOTlCazRlaTZRa3dJdzZERGVZZnBvaDc2QklHQkR5S00kaWJIcFdaNXIwSmlpMk9MMmVtcDZYR1hlWXJsNkpYeVEwNUtiZHpkdm1aOA==",
      companyId: csitechCompany.id,
      ruleId: adminRules.id,
      imutable: true,
    },
  });

  // General Managers
  await prisma.user.create({
    data: {
      name: "Irapuan Menezes (Gmail)",
      email: "irapuan.menezes@gmail.com",
      phone: "+551140632535",
      hash: "JGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTIscD0xJEs1dXEwaW95aUdQOTlCazRlaTZRa3dJdzZERGVZZnBvaDc2QklHQkR5S00kaWJIcFdaNXIwSmlpMk9MMmVtcDZYR1hlWXJsNkpYeVEwNUtiZHpkdm1aOA==",
      companyId: csitechCompany.id,
      ruleId: managerRules.id,
      imutable: true,
    },
  });

  // Gestor Empresa RBM
  await prisma.user.create({
    data: {
      name: "Gestor da empresa RBM",
      email: "gestorrbm@email.com",
      phone: "+5511992000071",
      hash: "JGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTIscD0xJEs1dXEwaW95aUdQOTlCazRlaTZRa3dJdzZERGVZZnBvaDc2QklHQkR5S00kaWJIcFdaNXIwSmlpMk9MMmVtcDZYR1hlWXJsNkpYeVEwNUtiZHpkdm1aOA==",
      companyId: rbmCompany.id,
      ruleId: managerRules.id,
      imutable: false,
    },
  });

  /* ************************************************************************ */
  /* Audit Trails
  /* ************************************************************************ */
  const previousHash = crypto.createHash("sha256");
  previousHash.update(JSON.stringify({
    action: "Seed Book",
    entity: "AuditTrail Book",
    entityId: "1",
    userId: irapuanUser.id,
    what: "The book of Genesis is the first book in the Bible.",
    ip: "::ffff:127.0.0.1",
    previousHash: "",
    currentHash: "",
  }));
  const previousHashDigest = previousHash.digest("hex");

  const currentHash = crypto.createHash("sha256");
  currentHash.update(
    JSON.stringify({
      action: "Seed Kings",
      entity: "AuditTrail Kings",
      entityId: "2",
      userId: irapuanUser.id,
      what: "David and Solomon were kings of Israel.",
      ip: "::ffff:127.0.0.1",
      previousHash: previousHashDigest,
    })
  );
  const currentHashDigest = currentHash.digest("hex");

  await prisma.auditTrail.create({
    data: {
      action: "Seed",
      entity: "AuditTrail",
      entityId: "1",
      userId: irapuanUser.id,
      what: "AuditTrail seed",
      ip: "::ffff:127.0.0.1",
      previousHash: previousHashDigest,
      currentHash: currentHashDigest,
    },
  });
} catch (error) {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
}
