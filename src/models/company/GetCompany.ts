import { Company } from "@prisma/client";
import { IGet } from "../../controllers/common/interfaces";
import { AuditTrail } from "../../libs/audit";
import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";

export async function GetCompany(input: IGet): Promise<Company> {
  try {
    await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.GetCompany,
      prisma,
    });

    const result = await prisma.company.findUnique({
      where: {
        id: input.id,
      },
      include: {
        User: input.depth !== undefined ? true : false,
        Contact: input.depth !== undefined ? true : false,
      },
    });
    if (!result) throw new Error("Company not found");

    return result;
  } catch (error) {
    new AuditTrail("GetCompany", "Company", `error: ${error}`, input.tokenPayload.u, JSON.stringify(error), input.ip);

    throw error;
  }
}
