import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IListUser, IListUserQuery } from "./UserInterface";

export async function ListUser(input: IListUserQuery): Promise<IListUser> {
  try {
    const permission = await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.ListUser,
      prisma,
    });

    let companyId = input.tokenPayload.c;
    if (input.companyId) {
      if (permission.rule.name === "Administrator" || permission.rule.name === "Manager") companyId = input.companyId
    }

    let limit = Math.round(Number(input.limit)) || 10;
    let page = Math.round(Number(input.page)) || 1;

    if (limit <= 0) limit = 10;
    if (page <= 0) page = 1;

    const skip = page === 1 ? 0 : page * limit - limit || 0;

    const totalPages = Math.ceil((await prisma.user.count()) / limit) || 0;

    const users = await prisma.user.findMany({
      skip,
      take: limit,
      where: {
        companyId: companyId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        active: true,
        attempts: true,
        companyId: true,
        ruleId: true,
        createdAt: true,
        updatedAt: true,
        Company: input.depth !== undefined ? true : false,
        Rule: input.depth !== undefined ? true : false,
      },
      orderBy: {
        name: "asc",
      },
    });

    return {
      docs: users,
      totalDocs: users.length,
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
