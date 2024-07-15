import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IAddService, IService } from "./ServiceInterfaces";

export async function AddService(input: IAddService): Promise<IService> {
  try {
    const permisstions = await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.AddService,
      prisma,
    });

    const role = await prisma.rule.findUnique({
      where: {
        id: permisstions.rule.id,
        name: "Administrator"
      }
    });
    if (!role) throw new Error("Forbidden. You do not belong to General Administrator group");

    const exists = await prisma.service.findUnique({ where: { name: input.name } });
    if (exists) throw new Error("Service already exists");

    return await prisma.service.create({
      data: {
        name: input.name,
        description: input.description,
        active: true,
        imutable: false,
      }
    });
  } catch (error) {
    throw error;
  }
}
