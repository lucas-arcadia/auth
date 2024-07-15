import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IService, IUpdateService } from "./ServiceInterfaces";

export async function UpdateService(input: IUpdateService): Promise<IService> {
  try {
    await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.UpdateService,
      prisma,
    });

    const service = await prisma.service.findUnique({
      where: {
        id: input.id,
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

    let hasChange = false;

    if (input.name && input.name !== service.name) hasChange = true;
    if (input.description && input.description !== service.description) hasChange = true;
    if (input.active !== undefined && input.active !== service.active) hasChange = true;
    // if (input.Company !== undefined && )

    let companiesFromActualService = service.Company.map((company) => {
      return {
        id: company.id,
      };
    });

    console.log(`input.Company`, input.Company);
    console.log(`service.Company`, companiesFromActualService);

    if (hasChange) {
      return await prisma.service.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          active: input.active,
          updatedAt: new Date(),
          Company: {
            set: input.Company,
          },
          Police: {
            set: input.Police,
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
    } else {
      return service;
    }
  } catch (error) {
    throw error;
  }
}
