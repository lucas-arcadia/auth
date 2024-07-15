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
    if (input.companyId) {
      if (permission.rule.name === "Administrator" || permission.rule.name === "Manager") companyId = input.companyId;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: input.id,
        companyId: companyId,
        Company: { active: true },
      },
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
