import { AuditTrail } from "../../libs/audit";
import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IGetUser, IUser } from "./UserInterface";

export async function GetUser(input: IGetUser): Promise<IUser> {
  try {
    const permission = await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.GetUser,
      prisma,
    });

    let whereClause: any = { id: input.id, Company: { active: true } };

    if (input.companyId) {
      if (permission.rule.name === "Administrator" || permission.rule.name === "Manager") {
        if (input.companyId === "all") {
          // If companyId is "all", we do not include the companyId condition in the where
          whereClause.companyId = undefined;
        } else {
          whereClause.companyId = input.companyId;
        }
      } else {
        whereClause.companyId = input.tokenPayload.c;
      }
    } else {
      whereClause.companyId = input.tokenPayload.c;
    }

    // whereClause.Company = { active: true };

    const user = await prisma.user.findUnique({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        attempts: true,
        active: true,
        companyId: true,
        ruleId: true,
        createdAt: true,
        updatedAt: true,
        Company:
          input.depth !== undefined
            ? {
                select: {
                  name: true,
                  surname: true,
                  ein: true,
                  active: true,
                },
              }
            : false,
        Rule:
          input.depth !== undefined
            ? {
                select: {
                  name: true,
                  description: true,
                  Policy: {
                    select: {
                      id: true,
                      description: true,
                      action: true,
                    },
                    where: {
                      active: true,
                    },
                    orderBy: [
                      {
                        Service: {
                          name: "asc",
                        },
                      },
                      {
                        action: "asc",
                      },
                    ],
                  },
                },
              }
            : false,
      },
    });
    if (!user) throw new Error("User not found");

    return user;
  } catch (error) {
    new AuditTrail("AddUser", "User", `error: ${error}`, input.tokenPayload.u, JSON.stringify(error), input.ip);

    throw error;
  }
}
