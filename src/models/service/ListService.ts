// @ts-ignore

import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IListService, IListServiceQuery } from "./ServiceInterfaces";

export async function ListServices(input: IListServiceQuery): Promise<IListService> {
  try {
    const permission = await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.ListService,
      prisma,
    });

    let companyId = input.tokenPayload.c;
    if (input.companyId) {
      if (permission.rule.name === "Administrator" || permission.rule.name === "Manager") companyId = input.companyId;
    }

    let limit = Math.round(Number(input.limit)) || 10;
    let page = Math.round(Number(input.page)) || 1;

    if (limit <= 0) limit = 10;
    if (page <= 0) page = 1;

    const skip = page === 1 ? 0 : page * limit - limit || 0;

    const totalPages = Math.ceil((await prisma.user.count()) / limit) || 0;
    
    const result = await prisma.service.findMany({
      skip,
      take: limit,
      where: {
        Company: {
          some: { id: companyId },
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
      orderBy: {
        name: "asc",
      },
    });

    return {
      docs: result,
      totalDocs: result.length,
      limit: limit,
      totalPages,
      page: page < 0 ? 1 : page,
      hasPrevPage: page > 1 ? true : false,
      hasNextPage: page < totalPages ? true : false,
      prevPage: page - 1 > 0 ? (page - 1 >= totalPages ? totalPages : null) : null,
      nextPage: page + 1 > totalPages ? null : page + 1,
    };
  } catch (error) {
    throw error;
  }
}
