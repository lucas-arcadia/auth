import { Contact } from "@prisma/client";
import { IGet } from "../../controllers/common/interfaces";
import { AuditTrail } from "../../libs/audit";
import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";

export async function GetContact(input: IGet): Promise<Contact> {
  try {
    const permission = await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.GetContact,
      prisma,
    });

    let companyId = input.tokenPayload.c;
    if (input.companyId) {
      if (permission.rule.name === "Administrator" || permission.rule.name === "Manager") companyId = input.companyId
    }

    const result = await prisma.contact.findUnique({
      where: { 
        id: input.id,
        companyId: companyId
      },
      include: {
        Company: input.depth !== undefined ? true : false
      },
    });
    if (!result) throw new Error("Contact not found");

    return result;
  } catch (error) {
    new AuditTrail("GetContact", "Contact", `error: ${error}`, input.tokenPayload.u, JSON.stringify(error), input.ip);

    throw error;
  }
}
