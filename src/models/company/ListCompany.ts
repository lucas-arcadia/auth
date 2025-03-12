import { Company } from "@prisma/client";
import { IGet } from "../../controllers/common/interfaces";
import { AuditTrail } from "../../libs/audit";
import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";

export async function ListCompanies(input: IGet): Promise<Partial<Company>[]> {
  try {
    await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.ListCompany,
      prisma,
    });

    const result = await prisma.company.findMany({
      omit: {
        createdAt: true,
        readOnly: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return result;
  } catch (error) {
    new AuditTrail("ListCompany", "Company", `error: ${error}`, input.tokenPayload.u, JSON.stringify(error), input.ip);

    throw error;
  }
}
