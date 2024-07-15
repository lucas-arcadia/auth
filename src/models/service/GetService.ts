import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IGetService, IService } from "./ServiceInterfaces";

export async function GetService(input: IGetService): Promise<IService> {
  try {
    const permission = await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.GetService,
      prisma,
    });

    let companyId = input.tokenPayload.c;
    if (input.companyId) {
      if (permission.rule.name === "Administrator" || permission.rule.name === "Manager") companyId = input.companyId;
    }

    const service = await prisma.service.findUnique({
      where: {
        id: input.id,
        Company: {
          some: {
            id: companyId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        active: true,
        imutable: true,
        createdAt: true,
        updatedAt: true,
        Company: input.depth !== undefined ? true : false,
        Police: input.depth !== undefined ? true : false,
      },
    });
    if (!service) throw new Error("Service not found");

    return service;
  } catch (error) {
    throw error;
  }
}
