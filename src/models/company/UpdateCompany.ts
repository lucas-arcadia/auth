import { AuditTrail } from "../../libs/audit";
import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { ICompany, IUpdateCompany } from "./CompanyInterfaces";

export async function UpdadeCompany(input: IUpdateCompany): Promise<ICompany> {
  try {
    const permission = await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.UpdateCompany,
      prisma,
    });

    let companyId = input.tokenPayload.c;
    if (input.companyId) {
      if (permission.rule.name === "Administrator" || permission.rule.name === "Manager") companyId = input.companyId;
    }

    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });
    
    if (!company) throw new Error("Company not found");
    if (!company.active) throw new Error("Company not found. Inactive");
    if (company.imutable) throw new Error("Forbidden. Imutable");

    let hasChange = false;

    if (input.name && input.name !== company.name) hasChange = true;
    if (input.surname && input.surname !== company.surname) hasChange = true;

    if (hasChange) {
      new AuditTrail("UpdateCompany", "Company", companyId, input.tokenPayload.u, JSON.stringify({ from: {name: company.name, surname: company.surname }, to: {name: input.name, surname: input.surname}}), input.ip);

      return await prisma.company.update({
        where: { id: companyId },
        data: {
          name: input.name || company.name,
          surname: input.surname || company.surname,
        },
        select: {
          id: true,
          name: true,
          surname: true,
          ein: true,
        },
      });
    } else {
      return {
        id: company.id,
        name: company.name,
        surname: company.surname,
        ein: company.ein,
      };
    }
  } catch (error) {
    new AuditTrail("UpdateCompany", "Company", `error: ${error}`, input.tokenPayload.u, JSON.stringify(error), input.ip);

    throw error;
  }
}
