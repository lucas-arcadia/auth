import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IPolice, IUpdatePolice } from "./PoliceInterfaces";

export async function UpdadePolice(input: IUpdatePolice): Promise<IPolice> {
  try {
    const permission = await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.UpdatePolice,
      prisma,
    });

    const police = await prisma.police.findUnique({
      where: {
        id: input.id,
        imutable: false,
      },
    });
    if (!police) throw new Error("Police not found");

    let hasChange = false;

    if (input.serviceId && input.serviceId !== police.serviceId) hasChange = true;
    if (input.description && input.description !== police.description) hasChange = true;
    if (input.action !== undefined && input.action !== police.action) hasChange = true;
    if (input.active !== undefined && input.active !== police.active) hasChange = true;

    if (hasChange) {
      return await prisma.police.update({
        where: { id: input.id },
        data: {
          serviceId: input.serviceId || police.serviceId,
          description: input.description || police.description,
          active: input.active || police.active,
        },
      });
    } else {
      return police;
    }
  } catch (error) {
    throw error;
  }
}
