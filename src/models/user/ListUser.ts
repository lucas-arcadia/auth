import { User } from "@prisma/client";
import { IGet } from "../../controllers/common/interfaces";
import { AuditTrail } from "../../libs/audit";
import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma, prismaRead } from "../db";

export async function ListUsers(input: IGet): Promise<Partial<User>[]> {
  try {
    const permission = await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.ListUser,
      prisma,
    });

    let companyId = input.tokenPayload.c;
    if (input.companyId) {
      if (permission.rule.name === "Administrator" || permission.rule.name === "Manager") companyId = input.companyId;
    }

    const users = await prismaRead.user.findMany({
      where: {
        companyId: companyId,
      },
      omit: {
        attempts: true,
        hash: true,
        readOnly: true,
        createdAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return users;
  } catch (error) {
    new AuditTrail("ListUser", "User", `error: ${error}`, input.tokenPayload.u, JSON.stringify(error), input.ip);

    throw error;
  }
}
