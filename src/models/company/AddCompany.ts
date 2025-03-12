import { Company } from "@prisma/client";
import { AuditTrail } from "../../libs/audit";
import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { AddUser } from "../user/AddUser";
import { IAddCompany } from "./CompanyInterfaces";
import { GetCompany } from "./GetCompany";

export async function AddCompany(input: IAddCompany): Promise<Company> {
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

    const company = await prisma.company.create({
      data: {
        name: input.company.name,
        surname: input.company.surname,
        ein: input.company.ein,
        active: true,
        readOnly: false,
        Service: {
          connect: { name: "Company" },
        },
      }
    });

    await AddUser({
      tokenPayload: input.tokenPayload,
      ip: input.ip,
      name: input.user.name,
      email: input.user.email,
      phone: input.user.phone,
      password: input.user.password,
      companyId: company.id,
    });

    const result = await prisma.company.findUnique({
      where: { id: company.id },
      include: {
        User: {
          omit: { hash: true },
        },
      },
    });
    if (!result) throw new Error("Company not found");
    
    return result;
  } catch (error) {
    new AuditTrail("AddCompany", "Company", `error: ${error}`, input.tokenPayload.u, JSON.stringify(error), input.ip);
    
    throw error;
  }
}
