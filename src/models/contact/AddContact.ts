import { Contact } from "@prisma/client";
import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IAddContact } from "./ContactInterfaces";
import { AuditTrail } from "../../libs/audit";

export async function AddContact(input: IAddContact): Promise<Contact> {
  try {
    const permission = await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.AddContact,
      prisma,
    });

    let companyId = input.tokenPayload.c;
    if (input.companyId) {
      if (permission.rule.name === "Administrator" || permission.rule.name === "Manager") companyId = input.companyId;
    }

    const contact = await prisma.contact.findUnique({
      where: {
        contactUnique: {
          email: input.email,
          companyId: companyId
        }
      }
    });
    if (contact) throw new Error("Contact already exists");

    return await prisma.contact.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        active: true,
        companyId: companyId,
      }
    })

  } catch (error) {
    new AuditTrail("AddContact", "Contact", `error: ${error}`, input.tokenPayload.u, JSON.stringify(error), input.ip);
    
    throw error;
  }
}