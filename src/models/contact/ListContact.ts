import { Contact } from "@prisma/client";
import { IGet } from "../../controllers/common/interfaces";
import { AuditTrail } from "../../libs/audit";
import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";

export async function ListContact(input: IGet): Promise<Partial<Contact>[]> {
  try {
    const permission = await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.ListContact,
      prisma,
    });

    let companyId = input.tokenPayload.c;
    if (input.companyId) {
      if (permission.rule.name === "Administrator" || permission.rule.name === "Manager") companyId = input.companyId;
    }

    const result = await prisma.contact.findMany({
      where: {
        companyId: companyId,
      },
      include: {
        Company: input.depth !== undefined ? true: false,
      },
      orderBy: {
        name: "asc",
      },
    });

    return result;
  } catch (error) {
    new AuditTrail("ListContact", "Contact", `error: ${error}`, input.tokenPayload.u, JSON.stringify(error), input.ip);
    
    throw error;
  }
}
