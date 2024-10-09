import { AuditTrail } from "../../libs/audit";
import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IListCompany, IListCompanyQuery } from "./CompanyInterfaces";

export async function ListCompanies(input: IListCompanyQuery): Promise<IListCompany> {
  try {
    await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.ListCompanies,
      prisma,
    });

    let limit = Math.round(Number(input.limit)) || 10;
    let page = Math.round(Number(input.page)) || 1;

    if (limit <= 0) limit = 10;
    if (page <= 0) page = 1;

    const skip = page === 1 ? 0 : page * limit - limit || 0;

    const totalPages = Math.ceil((await prisma.user.count()) / limit) || 0;

    const result = await prisma.company.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        surname: true,
        ein: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        User:
          input.depth !== undefined
            ? {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  hash: false,
                  attempts: true,
                  active: true,
                  companyId: false,
                  ruleId: true,
                  createdAt: true,
                  updatedAt: true,
                },
              }
            : false,
        Contact: input.depth !== undefined ? true : false,
        Service: input.depth !== undefined ? true : false,
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
    new AuditTrail(
      "ListCompany",
      "Company",
      `error: ${error}`,
      input.tokenPayload.u,
      JSON.stringify(error),
      input.ip,
    );

    throw error;
  }
}
