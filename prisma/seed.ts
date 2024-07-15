import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

try {
  /* ************************************************************************ */
  /* Services
  /* ************************************************************************ */
  const CompanyService = await prisma.service.upsert({
    where: {
      name: "Company",
    },
    update: {},
    create: {
      name: "Company",
      description: "Business management service",
      imutable: true,
    },
  });

  const OmbudsmanService = await prisma.service.upsert({
    where: {
      name: "Ombudsman",
    },
    update: {},
    create: {
      name: "Ombudsman",
      description: "Ombudsman Management Service",
      imutable: true,
    },
  });

  /* ************************************************************************ */
  /* Company service policies
  /* ************************************************************************ */
  const PoliceAddCompany = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "AddCompany",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Add a new Company",
      action: "AddCompany",
      imutable: true,
    },
  });

  const PoliceAddService = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "AddService",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Add a new service",
      action: "AddService",
      imutable: true,
    },
  });

  const PoliceAddContact = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "AddContact",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Add a new contact",
      action: "AddContact",
      imutable: true,
    },
  });

  const PoliceAddUser = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "AddUser",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Add a new user",
      action: "AddUser",
      imutable: true,
    },
  });

  const PoliceAddPolice = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "AddPolice",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Add a new police",
      action: "AddPolice",
      imutable: true,
    },
  });

  const PoliceAddRule = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "AddRule",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Add a new rule",
      action: "AddRule",
      imutable: true,
    },
  });

  const PoliceGetCompany = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "GetCompany",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Get a company's information",
      action: "GetCompany",
      imutable: true,
    },
  });

  const PoliceGetService = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "GetService",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Get a service's information",
      action: "GetService",
      imutable: true,
    },
  });

  const PoliceGetContact = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "GetContact",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Get a contact's information",
      action: "GetContact",
      imutable: true,
    },
  });

  const PoliceGetUser = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "GetUser",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Get a user's information",
      action: "GetUser",
      imutable: true,
    },
  });

  const PoliceGetPolice = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "GetPolice",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Get a police's information",
      action: "GetPolice",
      imutable: true,
    },
  });

  const PoliceGetRule = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "GetRule",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Get a rule's information",
      action: "GetRule",
      imutable: true,
    },
  });

  const PoliceListCompanies = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "ListCompanies",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "List companies",
      action: "ListCompanies",
      imutable: true,
    },
  });

  const PoliceListServices = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "ListServices",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "List services",
      action: "ListServices",
      imutable: true,
    },
  });

  const PoliceListContacts = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "ListContacts",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "List contacts",
      action: "ListContacts",
      imutable: true,
    },
  });

  const PoliceListUsers = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "ListUsers",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "List users",
      action: "ListUsers",
      imutable: true,
    },
  });

  const PoliceListPolicies = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "ListPolicies",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "List policies",
      action: "ListPolicies",
      imutable: true,
    },
  });

  const PoliceListRules = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "ListRules",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "List rules",
      action: "ListRules",
      imutable: true,
    },
  });

  const PoliceUpdateCompany = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "UpdateCompany",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Update a company",
      action: "UpdateCompany",
      imutable: true,
    },
  });

  const PoliceUpdateService = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "UpdateService",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Update a service",
      action: "UpdateService",
      imutable: true,
    },
  });

  const PoliceUpdateContact = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "UpdateContact",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Update a contact",
      action: "UpdateContact",
      imutable: true,
    },
  });

  const PoliceUpdateUser = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "UpdateUser",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Update a user",
      action: "UpdateUser",
      imutable: true,
    },
  });

  const PoliceUpdatePolice = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "UpdatePolice",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Update a police",
      action: "UpdatePolice",
      imutable: true,
    },
  });

  const PoliceUpdateRule = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "UpdateRule",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Update a rule",
      action: "UpdateRule",
      imutable: true,
    },
  });

  const PoliceDeleteCompany = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "DeleteCompany",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Delete a Company",
      action: "DeleteCompany",
      imutable: true,
    },
  });

  const PoliceDeleteService = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "DeleteService",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Delete a service",
      action: "DeleteService",
      imutable: true,
    },
  });

  const PoliceDeleteContact = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "DeleteContact",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Delete a contact",
      action: "DeleteContact",
      imutable: true,
    },
  });

  const PoliceDeleteUser = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "DeleteUser",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Delete a user",
      action: "DeleteUser",
      imutable: true,
    },
  });

  const PoliceDeletePolice = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "DeletePolice",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Delete a police",
      action: "DeletePolice",
      imutable: true,
    },
  });

  const PoliceDeleteRule = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "DeleteRule",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Delete a rule",
      action: "DeleteRule",
      imutable: true,
    },
  });

  const PoliceAboutMe = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "AboutMe",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Get information about your user",
      action: "AboutMe",
      imutable: true,
    },
  });

  const PoliceGetPermission = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "GetPermission",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Get a user's permissions",
      action: "GetPermission",
      imutable: true,
    },
  });

  const PoliceSetPermission = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "SetPermission",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Set a user's permissions",
      action: "SetPermission",
      imutable: true,
    },
  });

  const PolicePassword = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: CompanyService.id,
        action: "Password",
      },
    },
    update: {},
    create: {
      serviceId: CompanyService.id,
      description: "Set a user's password",
      action: "Password",
      imutable: true,
    },
  });

  /* ************************************************************************ */
  /* Ombudsman service policies
  /* ************************************************************************ */
  const policeAddManifestation = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: OmbudsmanService.id,
        action: "AddManifestation",
      },
    },
    update: {},
    create: {
      serviceId: OmbudsmanService.id,
      description: "Add a new manifestation",
      action: "AddManifestation",
      imutable: true,
    },
  });

  const policeGetManifestation = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: OmbudsmanService.id,
        action: "GetManifestation",
      },
    },
    update: {},
    create: {
      serviceId: OmbudsmanService.id,
      description: "Get a manifestation's information",
      action: "GetManifestation",
      imutable: true,
    },
  });

  const policeListManifestations = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: OmbudsmanService.id,
        action: "ListManifestation",
      },
    },
    update: {},
    create: {
      serviceId: OmbudsmanService.id,
      description: "List manifestations",
      action: "ListManifestation",
      imutable: true,
    },
  });

  const policeUpdateManifestation = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: OmbudsmanService.id,
        action: "UpdateManifestation",
      },
    },
    update: {},
    create: {
      serviceId: OmbudsmanService.id,
      description: "Update a manifestation",
      action: "UpdateManifestation",
      imutable: true,
    },
  });

  const policeAddManifestationResponse = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: OmbudsmanService.id,
        action: "AddManifestationResponse",
      },
    },
    update: {},
    create: {
      serviceId: OmbudsmanService.id,
      description: "Add a new response to manifestation",
      action: "AddManifestationResponse",
      imutable: true,
    },
  });

  const policeListManifestationResponses = await prisma.police.upsert({
    where: {
      uniquePolice: {
        serviceId: OmbudsmanService.id,
        action: "ListManifestationResponses",
      },
    },
    update: {},
    create: {
      serviceId: OmbudsmanService.id,
      description: "List responses of a manifestation",
      action: "ListManifestationResponses",
      imutable: true,
    },
  });

  /* ************************************************************************ */
  /* General admin rules
  /* ************************************************************************ */
  const adminRules = await prisma.rule.upsert({
    where: {
      name: "Administrator",
    },
    update: {},
    create: {
      name: "Administrator",
      description: "General Administrator",
      imutable: true,
    },
  });

  await prisma.rule.update({
    where: { id: adminRules.id },
    data: {
      Police: {
        set: [
          PoliceAddCompany,
          PoliceGetCompany,
          PoliceListCompanies,
          PoliceUpdateCompany,
          PoliceDeleteCompany,

          PoliceAddService,
          PoliceGetService,
          PoliceListServices,
          PoliceUpdateService,
          PoliceDeleteService,

          PoliceAddContact,
          PoliceGetContact,
          PoliceListContacts,
          PoliceUpdateContact,
          PoliceDeleteContact,

          PoliceAddUser,
          PoliceGetUser,
          PoliceListUsers,
          PoliceUpdateUser,
          PoliceDeleteUser,

          PoliceAddPolice,
          PoliceGetPolice,
          PoliceListPolicies,
          PoliceUpdatePolice,
          PoliceDeletePolice,

          PoliceAddRule,
          PoliceGetRule,
          PoliceListRules,
          PoliceUpdateRule,
          PoliceDeleteRule,

          PoliceAboutMe,
          PoliceGetPermission,
          PoliceSetPermission,
          PolicePassword
        ],
      },
    },
  });

  /* ************************************************************************ */
  /* General manager rules
  /* ************************************************************************ */
  const managerRules = await prisma.rule.upsert({
    where: {
      name: "Manager",
    },
    update: {},
    create: {
      name: "Manager",
      description: "General Manager",
      imutable: true,
    },
  });

  await prisma.rule.update({
    where: { id: managerRules.id },
    data: {
      Police: {
        set: [
          PoliceGetCompany,
          PoliceListCompanies,
          PoliceUpdateCompany,

          PoliceGetService,
          PoliceListServices,
          PoliceUpdateService,
          PoliceDeleteService,

          PoliceAddContact,
          PoliceGetContact,
          PoliceListContacts,
          PoliceUpdateContact,
          PoliceDeleteContact,

          PoliceAddUser,
          PoliceGetUser,
          PoliceListUsers,
          PoliceUpdateUser,
          PoliceDeleteUser,

          PoliceAddPolice,
          PoliceGetPolice,
          PoliceListPolicies,
          PoliceUpdatePolice,
          PoliceDeletePolice,

          PoliceAddRule,
          PoliceGetRule,
          PoliceListRules,
          PoliceUpdateRule,
          PoliceDeleteRule,

          PoliceAboutMe,
          PoliceGetPermission,
          PoliceSetPermission,
          PolicePassword,
        ],
      },
    },
  });

  /* ************************************************************************ */
  /* Company manager rules
  /* ************************************************************************ */
  const companyManagerRules = await prisma.rule.upsert({
    where: {
      name: "CompanyManager",
    },
    update: {},
    create: {
      name: "CompanyManager",
      description: "Company Manager",
      imutable: true,
    },
  });

  await prisma.rule.update({
    where: { id: companyManagerRules.id },
    data: {
      Police: {
        set: [
          PoliceGetCompany,
          PoliceUpdateCompany,

          PoliceGetService,
          PoliceListServices,

          PoliceAddContact,
          PoliceGetContact,
          PoliceListContacts,
          PoliceUpdateContact,
          PoliceDeleteContact,

          PoliceAddUser,
          PoliceGetUser,
          PoliceListUsers,
          PoliceUpdateUser,
          PoliceDeleteUser,

          PoliceAboutMe,
          PoliceGetPermission,
          PolicePassword,
        ],
      },
    },
  });

  /* ************************************************************************ */
  /* Ombudsman manager rules
  /* ************************************************************************ */
  const ombudsmanManagerRules = await prisma.rule.upsert({
    where: {
      name: "OmbudsmanManager",
    },
    update: {},
    create: {
      name: "OmbudsmanManager",
      description: "Ombudsman Manager",
      imutable: true,
    },
  });

  await prisma.rule.update({
    where: { id: ombudsmanManagerRules.id },
    data: {
      Police: {
        set: [
          policeGetManifestation,
          policeAddManifestationResponse,

          policeListManifestations,
          policeListManifestationResponses,

          policeUpdateManifestation,
        ],
      },
    },
  });

  /* ************************************************************************ */
  /* Comapnies
  /* ************************************************************************ */
  const csitechCompany = await prisma.company.upsert({
    where: {
      ein: "13019142000142",
    },
    update: {},
    create: {
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
        set: [CompanyService, OmbudsmanService],
      },
    },
  });

  const rbmCompany = await prisma.company.upsert({
    where: {
      ein: "12698756000135",
    },
    update: {},
    create: {
      id: "91443357-278d-4f53-a7bf-0b00ac4fc394",
      name: "RBM - Recuperadora Brasileira de Metais S/A",
      surname: "RBM",
      ein: "12698756000135",
      imutable: true
    },
  });

  await prisma.company.update({
    where: { id: rbmCompany.id },
    data: {
      Service: {
        set: [
          CompanyService,
          OmbudsmanService
        ],
      },
    },
  });

  /* ************************************************************************ */
  /* Users
  /* ************************************************************************ */
  // General Administrators
  await prisma.user.upsert({
    where: {
      userUnique: {
        email: "irapuan.menezes@csitech.com.br",
        companyId: csitechCompany.id,
      },
    },
    update: {},
    create: {
      name: "Irapuan Menezes",
      email: "irapuan.menezes@csitech.com.br",
      phone: "+551140632535",
      hash: "JGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTIscD0xJEs1dXEwaW95aUdQOTlCazRlaTZRa3dJdzZERGVZZnBvaDc2QklHQkR5S00kaWJIcFdaNXIwSmlpMk9MMmVtcDZYR1hlWXJsNkpYeVEwNUtiZHpkdm1aOA==",
      companyId: csitechCompany.id,
      ruleId: adminRules.id,
      imutable: true,
    },
  });

  await prisma.user.upsert({
    where: {
      userUnique: {
        email: "lucas.menezes@csitech.com.br",
        companyId: csitechCompany.id,
      },
    },
    update: {},
    create: {
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
  await prisma.user.upsert({
    where: {
      userUnique: {
        email: "manager@email.com",
        companyId: csitechCompany.id,
      },
    },
    update: {},
    create: {
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
  await prisma.user.upsert({
    where: {
      userUnique: {
        email: "gestorrbm@email.com",
        companyId: rbmCompany.id
      },
    },
    update: {},
    create: {
      name: "Gestor da empresa RBM",
      email: "gestorrbm@email.com",
      phone: "+5511992000071",
      hash: "JGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTIscD0xJEs1dXEwaW95aUdQOTlCazRlaTZRa3dJdzZERGVZZnBvaDc2QklHQkR5S00kaWJIcFdaNXIwSmlpMk9MMmVtcDZYR1hlWXJsNkpYeVEwNUtiZHpkdm1aOA==",
      companyId: rbmCompany.id,
      ruleId: managerRules.id,
      imutable: false
    }
  })
} catch (error) {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
}
