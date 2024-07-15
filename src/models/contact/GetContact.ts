import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IContact, IGetContact } from "./ContactInterfaces";

export async function GetContact(input: IGetContact): Promise<IContact> {
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
        id: input.id 
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        active: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
        Company: input.depth !== undefined ? true : false
      },
    });

    if (!result) throw new Error("Contact not found");

    return result;
  } catch (error) {
    throw error;
  }
}
