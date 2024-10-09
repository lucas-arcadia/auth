import { AuditTrail } from "../../libs/audit";
import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { ICompany, IGetCompany } from "./CompanyInterfaces";

export async function GetCompany(input: IGetCompany): Promise<ICompany> {
  try {
    const permission = await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.GetCompany,
      prisma,
    });

    let companyId = input.tokenPayload.c;
    if (input.companyId) {
      if (permission.rule.name === "Administrator" || permission.rule.name === "Manager") companyId = input.companyId
    }
    
    const result = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
      select: {
        id: true,
        name: true,
        surname: true,
        ein: true,
        active: true,
        imutable: true,
        createdAt: true,
        updatedAt: true,
        User:
          input.depth !== undefined
            ? {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  active: true,
                  attempts: true,
                  ruleId: true,
                  createdAt: true,
                  updatedAt: true,
                },
              }
            : false,
        Contact: input.depth !== undefined ? true : false,
        Service: input.depth !== undefined ? true : false,
      },
    });
    if (!result) throw new Error("Company not found");

    return result;
  } catch (error) {
    new AuditTrail(
      "GetCompany",
      "Company",
      `error: ${error}`,
      input.tokenPayload.u,
      JSON.stringify(error),
      input.ip,
    );

    throw error;
  }
}
