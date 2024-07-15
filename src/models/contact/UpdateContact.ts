import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IContact, IUpdateContact } from "./ContactInterfaces";

export async function UpdadeContact(input: IUpdateContact): Promise<IContact> {
  try {
    const permission = await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.UpdateContact,
      prisma,
    });

    let companyId = input.tokenPayload.c;
    if (input.companyId) {
      if (permission.rule.name === "Administrator" || permission.rule.name === "Manager") companyId = input.companyId;
    }

    const contact = await prisma.contact.findUnique({
      where: {
        id: input.id,
        companyId: input.companyId,
      },
    });
    if (!contact) throw new Error("Contact not found");

    let hasChange = false;

    if (input.name && input.name !== contact.name) hasChange = true;
    if (input.email && input.email !== contact.email) hasChange = true;
    if (input.phone && input.phone !== contact.phone) hasChange = true;
    if (input.active !== undefined && input.active !== contact.active) hasChange = true;

    if (hasChange) {
      return await prisma.contact.update({
        where: { id: input.id },
        data: {
          name: input.name || contact.name,
          email: input.email || contact.email,
          phone: input.phone || contact.phone,
          active: input.active || contact.active,
        }
      });
    } else {
      return contact;
    }
  } catch (error) {
    throw error;
  }
}
