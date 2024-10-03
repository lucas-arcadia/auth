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

    let companyId = input.tokenPayload.c;
    let whereClause: any = { id: input.id };

    if (input.companyId) {
      if (permission.rule.name === "Administrator" || permission.rule.name === "Manager") {
        if (input.companyId === "all") {
          // If companyId is "all", we do not include the companyId condition in the where
        } else {
          companyId = input.companyId;
          whereClause.companyId = companyId;
        }
      } else {
        whereClause.companyId = companyId;
      }
    } else {
      whereClause.companyId = companyId;
    }

    whereClause.Company = { active: true };

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
        Company: input.depth !== undefined ? true : false,
        Rule: input.depth !== undefined ? true : false,
      },
    });
    if (!user) throw new Error("User not found");

    return user;
  } catch (error) {
    throw error;
  }
}
