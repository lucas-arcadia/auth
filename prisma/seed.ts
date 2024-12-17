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

  const CustodianService = await prisma.service.create({
    data: {
      name: "Custodian",
      description: "Custodian Management Service",
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
      description: "Get Company Information",
      action: "GetCompany",
      imutable: true,
    },
  });

  const PolicyListCompanies = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "List Companies",
      action: "ListCompany",
      imutable: true,
    },
  });

  const PolicyUpdateCompany = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Update Company Information",
      action: "UpdateCompany",
      imutable: true,
    },
  });

  const PolicyDeleteCompany = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Delete Company Information",
      action: "DeleteCompany",
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
      description: "Get Service Information",
      action: "GetService",
      imutable: true,
    },
  });

  const PolicyListServices = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "List Services",
      action: "ListService",
      imutable: true,
    },
  });

  const PolicyUpdateService = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Update Service Information",
      action: "UpdateService",
      imutable: true,
    },
  });

  const PolicyDeleteService = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Delete Service Information",
      action: "DeleteService",
      imutable: true,
    },
  });

  /* ************************************************************************ */
  /* Contact's policies
  /* ************************************************************************ */
  const PolicyAddContact = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Add Contact Information",
      action: "AddContact",
      imutable: true,
    },
  });

  const PolicyGetContact = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Get Contact Information",
      action: "GetContact",
      imutable: true,
    },
  });

  const PolicyListContacts = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "List Contacts",
      action: "ListContact",
      imutable: true,
    },
  });

  const PolicyUpdateContact = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Update Contact Information",
      action: "UpdateContact",
      imutable: true,
    },
  });

  const PolicyDeleteContact = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Delete Contact Information",
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
      description: "Add User Information",
      action: "AddUser",
      imutable: true,
    },
  });

  const PolicyGetUser = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Get User Information",
      action: "GetUser",
      imutable: true,
    },
  });

  const PolicyListUsers = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "List Users",
      action: "ListUser",
      imutable: true,
    },
  });

  const PolicyUpdateUser = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Update User Information",
      action: "UpdateUser",
      imutable: true,
    },
  });

  const PolicyDeleteUser = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Delete User Information",
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
      description: "Get User Permissions",
      action: "GetPermission",
      imutable: true,
    },
  });

  const PolicySetPermission = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Set User Permissions",
      action: "SetPermission",
      imutable: true,
    },
  });

  const PolicyPassword = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Set User Password",
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
      description: "Add Policy Information",
      action: "AddPolicy",
      imutable: true,
    },
  });

  const PolicyGetPolicy = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Get Policy Information",
      action: "GetPolicy",
      imutable: true,
    },
  });

  const PolicyListPolicies = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "List Policies",
      action: "ListPolicy",
      imutable: true,
    },
  });

  const PolicyUpdatePolicy = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Update Policy Information",
      action: "UpdatePolicy",
      imutable: true,
    },
  });

  const PolicyDeletePolicy = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Delete Policy Information",
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
      description: "Add Rule Information",
      action: "AddRule",
      imutable: true,
    },
  });

  const PolicyGetRule = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Get Rule Information",
      action: "GetRule",
      imutable: true,
    },
  });

  const PolicyListRules = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "List Rules",
      action: "ListRule",
      imutable: true,
    },
  });

  const PolicyUpdateRule = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Update Rule Information",
      action: "UpdateRule",
      imutable: true,
    },
  });

  const PolicyDeleteRule = await prisma.policy.create({
    data: {
      serviceId: CompanyService.id,
      description: "Delete Rule Information",
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
      description: "Add Manifestation Information",
      action: "AddManifestation",
      imutable: true,
    },
  });

  const policyGetManifestation = await prisma.policy.create({
    data: {
      serviceId: OmbudsmanService.id,
      description: "Get Manifestation Information",
      action: "GetManifestation",
      imutable: true,
    },
  });

  const policyListManifestations = await prisma.policy.create({
    data: {
      serviceId: OmbudsmanService.id,
      description: "List Manifestations",
      action: "ListManifestation",
      imutable: true,
    },
  });

  const policyUpdateManifestation = await prisma.policy.create({
    data: {
      serviceId: OmbudsmanService.id,
      description: "Update Manifestation Information",
      action: "UpdateManifestation",
      imutable: true,
    },
  });

  const policyAddManifestationResponse = await prisma.policy.create({
    data: {
      serviceId: OmbudsmanService.id,
      description: "Add Manifestation Response Information",
      action: "AddManifestationResponse",
      imutable: true,
    },
  });

  const policyListManifestationResponses = await prisma.policy.create({
    data: {
      serviceId: OmbudsmanService.id,
      description: "List Manifestation Responses",
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
      description: "Add File Information",
      action: "AddFile",
      imutable: true,
    },
  });

  const policyAddFolder = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "Add Folder Information",
      action: "AddFolder",
      imutable: true,
    },
  });

  const policyGetFile = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "Get File Information",
      action: "GetFile",
      imutable: true,
    },
  });

  const policyGetFolder = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "Get Folder Information",
      action: "GetFolder",
      imutable: true,
    },
  });

  const policyListFiles = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "List Files",
      action: "ListFile",
      imutable: true,
    },
  });

  const policyListFolders = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "List Folders",
      action: "ListFolder",
      imutable: true,
    },
  });

  const policyUpdateFile = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "Update File Information",
      action: "UpdateFile",
      imutable: true,
    },
  });

  const policyUpdateFolder = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "Update Folder Information",
      action: "UpdateFolder",
      imutable: true,
    },
  });

  const policyDeleteFile = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "Delete File Information",
      action: "DeleteFile",
      imutable: true,
    },
  });

  const policyDeleteFolder = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "Delete Folder Information",
      action: "DeleteFolder",
      imutable: true,
    },
  });

  const policyGetFileVersion = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "Get File Version Information",
      action: "GetFileVersion",
      imutable: true,
    },
  });

  const policyListFileVersions = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "List File Versions",
      action: "ListFileVersions",
      imutable: true,
    },
  });

  const policyDeleteFileVersion = await prisma.policy.create({
    data: {
      serviceId: FileService.id,
      description: "Delete File Version Information",
      action: "DeleteFileVersion",
      imutable: true,
    },
  });

  /* ************************************************************************ */
  /* Custodian service policies
  /* ************************************************************************ */
  const policyCustodianReportAnnualTaxStatement = await prisma.policy.create({
    data: {
      serviceId: CustodianService.id,
      description: "Report Annual Tax Statement",
      action: "ReportAnnualTaxStatement",
      imutable: true,
    },
  });

  const policyCustodianReportBalance = await prisma.policy.create({
    data: {
      serviceId: CustodianService.id,
      description: "Report Balance",
      action: "ReportBalance",
      imutable: true,
    },
  });

  const policyCustodianWithdrawal = await prisma.policy.create({
    data: {
      serviceId: CustodianService.id,
      description: "Withdrawal",
      action: "Withdrawal",
      imutable: true,
    },
  });

  const policyCustodianDeposit = await prisma.policy.create({
    data: {
      serviceId: CustodianService.id,
      description: "Deposit",
      action: "Deposit",
      imutable: true,
    },
  });

  const policyCustodianTransfer = await prisma.policy.create({
    data: {
      serviceId: CustodianService.id,
      description: "Transfer",
      action: "Transfer",
      imutable: true,
    },
  });

  const policyCustodianAccountList = await prisma.policy.create({
    data: {
      serviceId: CustodianService.id,
      description: "List Custodian Accounts",
      action: "ListCustodianAccount",
      imutable: true,
    },
  });

  const policyCustodianProductList = await prisma.policy.create({
    data: {
      serviceId: CustodianService.id,
      description: "List Custodian Products",
      action: "ListCustodianProduct",
      imutable: true,
    },
  });

  const policyCustodianProductGet = await prisma.policy.create({
    data: {
      serviceId: CustodianService.id,
      description: "Get Custodian Product",
      action: "GetCustodianProduct",
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
  /* Custodian manager rules
  /* ************************************************************************ */
  const custodianOperatorRules = await prisma.rule.create({
    data: {
      name: "CustodianOperator",
      description: "Custodian Operator",
      imutable: true,
    },
  });

  await prisma.rule.update({
    where: { id: custodianOperatorRules.id },
    data: {
      Policy: {
        set: [policyCustodianProductList, policyCustodianProductGet, policyCustodianAccountList, PolicyAddUser, PolicyGetUser, PolicyListUsers, PolicyUpdateUser],
      },
    },
  });

  const custodianLiquidatorRules = await prisma.rule.create({
    data: {
      name: "CustodianLiquidator",
      description: "Custodian Liquidator",
      imutable: true,
    },
  });

  await prisma.rule.update({
    where: { id: custodianLiquidatorRules.id },
    data: {
      Policy: {
        set: [policyCustodianReportAnnualTaxStatement, policyCustodianReportBalance, policyCustodianWithdrawal, policyCustodianDeposit, policyCustodianTransfer, policyCustodianProductList, policyCustodianProductGet, policyCustodianAccountList],
      },
    },
  });

  const custodianAuditorRules = await prisma.rule.create({
    data: {
      name: "CustodianAuditor",
      description: "Custodian Auditor",
      imutable: true,
    },
  });

  await prisma.rule.update({
    where: { id: custodianAuditorRules.id },
    data: {
      Policy: {
        set: [policyCustodianReportAnnualTaxStatement, policyCustodianReportBalance, policyCustodianAccountList],
      },
    },
  });

  const custodianCustomerRules = await prisma.rule.create({
    data: {
      name: "CustodianCustomer",
      description: "Custodian Customer",
      imutable: true,
    },
  });

  await prisma.rule.update({
    where: { id: custodianCustomerRules.id },
    data: {
      Policy: {
        set: [policyCustodianReportAnnualTaxStatement, policyCustodianReportBalance, policyCustodianProductList, policyCustodianWithdrawal],
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

  // Custodian Operator
  await prisma.user.create({
    data: {
      name: "Custodian Operator",
      email: "operador.custodia@email.com",
      phone: "+5511992000071",
      hash: "JGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTIscD0xJEs1dXEwaW95aUdQOTlCazRlaTZRa3dJdzZERGVZZnBvaDc2QklHQkR5S00kaWJIcFdaNXIwSmlpMk9MMmVtcDZYR1hlWXJsNkpYeVEwNUtiZHpkdm1aOA==",
      companyId: rbmCompany.id,
      ruleId: custodianOperatorRules.id,
      imutable: false,
    }
  });

  // Custodian Liquidator
  await prisma.user.create({
    data: {
      name: "Custodian Liquidator",
      email: "liquidador.custodia@email.com",
      phone: "+5511992000071",
      hash: "JGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTIscD0xJEs1dXEwaW95aUdQOTlCazRlaTZRa3dJdzZERGVZZnBvaDc2QklHQkR5S00kaWJIcFdaNXIwSmlpMk9MMmVtcDZYR1hlWXJsNkpYeVEwNUtiZHpkdm1aOA==",
      companyId: rbmCompany.id,
      ruleId: custodianLiquidatorRules.id,
      imutable: false,
    }
  });

  // Custodian Auditor
  await prisma.user.create({
    data: {
      name: "Custodian Auditor",
      email: "auditor.custodia@email.com",
      phone: "+5511992000071",
      hash: "JGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTIscD0xJEs1dXEwaW95aUdQOTlCazRlaTZRa3dJdzZERGVZZnBvaDc2QklHQkR5S00kaWJIcFdaNXIwSmlpMk9MMmVtcDZYR1hlWXJsNkpYeVEwNUtiZHpkdm1aOA==",
      companyId: rbmCompany.id,
      ruleId: custodianAuditorRules.id,
      imutable: false,
    }
  });

  // Custodian Customer
  await prisma.user.create({
    data: {
      name: "Custodian Customer",
      email: "cliente.custodia@email.com",
      phone: "+5511992000071",
      hash: "JGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTIscD0xJEs1dXEwaW95aUdQOTlCazRlaTZRa3dJdzZERGVZZnBvaDc2QklHQkR5S00kaWJIcFdaNXIwSmlpMk9MMmVtcDZYR1hlWXJsNkpYeVEwNUtiZHpkdm1aOA==",
      companyId: rbmCompany.id,
      ruleId: custodianCustomerRules.id,
      imutable: false,
    }
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
