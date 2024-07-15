import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IAddPolice, IPolice } from "./PoliceInterfaces";

export async function AddPolice(input: IAddPolice): Promise<IPolice> {
  try {
    await checkPermission(input.tokenPayload, Services.Company, Actions.AddPolice, prisma);

    const exists = await prisma.police.findUnique({
      where: {
        uniquePolice: {
          serviceId: input.serviceId,
          action: input.action,
        }
      }
    });
    if (exists) throw new Error("Police already exists");

    return await prisma.police.create({
      data: {
        serviceId: input.serviceId,
        action: input.action,
        description: input.description,
        active: true,
        imutable: false
      }
    })

  } catch (error) {
    throw error;
  }
}