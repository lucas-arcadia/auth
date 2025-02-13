import { Company } from "@prisma/client";
import { AuditTrail } from "../../libs/audit";
import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IUpdateCompany } from "./CompanyInterfaces";

export async function UpdadeCompany(input: IUpdateCompany): Promise<Company> {
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
    if (company.readOnly) throw new Error("Forbidden. Read Only");

    let hasChange = false;
    if (input.name !== undefined && input.name !== company.name) hasChange = true;
    if (input.surname !== undefined && input.surname !== company.surname) hasChange = true;
    if (input.active !== undefined && input.active !== company.active) hasChange = true;

    if (hasChange) {
      new AuditTrail("UpdateCompany", "Company", companyId, input.tokenPayload.u, JSON.stringify({ from: { name: company.name, surname: company.surname }, to: { name: input.name, surname: input.surname } }), input.ip);

      return await prisma.company.update({
        where: { id: companyId },
        data: {
          name: input.name !== undefined ? input.name : company.name,
          surname: input.surname !== undefined ? input.surname : company.surname,
          active: input.active !== undefined ? input.active : company.active,
        },
      });
    } else {
      return company;
    }
  } catch (error) {
    new AuditTrail("UpdateCompany", "Company", `error: ${error}`, input.tokenPayload.u, JSON.stringify(error), input.ip);

    throw error;
  }
}
