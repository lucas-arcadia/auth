import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { AddUser } from "../user/AddUser";
import { IAddCompany, ICompany } from "./CompanyInterfaces";

export async function AddCompany(input: IAddCompany): Promise<ICompany> {
  try {
    await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.AddCompany,
      prisma,
    });

    const companyExists = await prisma.company.findUnique({ where: { ein: input.company.ein } });
    if (companyExists) throw new Error("Company already exists");

    const userExists = await prisma.user.findUnique({ where: { email: input.user.email } });
    if (userExists) throw new Error("User already exists");

    const ruleCompanyManager = await prisma.rule.findUnique({ where: { name: "CompanyManager" } });
    if (!ruleCompanyManager) throw new Error("Rule Company Manager not found");

    const company = await prisma.company.create({
      data: {
        name: input.company.name,
        surname: input.company.surname,
        ein: input.company.ein,
        active: true,
        imutable: false,
        Service: {
          connect: { name: "Company" },
        },
      }
    });

    await AddUser({
      tokenPayload: input.tokenPayload,
      name: input.user.name,
      email: input.user.email,
      phone: input.user.phone,
      password: input.user.password,
      companyId: company.id,
      ruleId: ruleCompanyManager.id,
    });

    return company;
  } catch (error) {
    throw error;
  }
}
