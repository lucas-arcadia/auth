import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IGetPolice, IPolice } from "./PoliceInterfaces";

export async function GetPolice(input: IGetPolice): Promise<IPolice> {
  try {
    const permission = await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.GetPolice,
      prisma,
    });

    const result = await prisma.police.findUnique({
      where: {
        id: input.id
      },
      select: {
        id: true,
        serviceId: true,
        description: true,
        action: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        Service: input.depth !== undefined ? true : false,
        Rule: input.depth !== undefined ? true : false,
      }
      
    });
    if (!result) throw new Error("Police does not found");

    return result;
  } catch (error) {
    throw error;
  }
}