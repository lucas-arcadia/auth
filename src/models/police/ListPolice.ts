import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IListPolice, IListPoliceQuery } from "./PoliceInterfaces";

export async function ListPolice(input: IListPoliceQuery): Promise<IListPolice> {
  try {
    await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.ListPolice,
      prisma,
    });

    let limit = Math.round(Number(input.limit)) || 10;
    let page = Math.round(Number(input.page)) || 1;

    if (limit <= 0) limit = 10;
    if (page <= 0) page = 1;

    const skip = page === 1 ? 0 : page * limit - limit;

    const totalPages = Math.ceil((await prisma.police.count()) / limit) || 0;

    const result = await prisma.police.findMany({
      skip,
      take: limit,
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
      },
      orderBy: {
        description: "asc",
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
      prevPage: page - 1 > 0 ? page - 1 : null,
      nextPage: page + 1 > totalPages ? null : page + 1,
    };
  } catch (error) {
    throw error;
  }
}
