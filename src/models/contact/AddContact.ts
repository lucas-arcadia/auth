import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IAddContact, IContact } from "./ContactInterfaces";

export async function AddContact(input: IAddContact): Promise<IContact> {
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
    throw error;
  }
}