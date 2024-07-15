import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IUpdateUser, IUser } from "./UserInterface";

export async function UpdateUser(input: IUpdateUser): Promise<IUser> {
  try {
    const permission = await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.UpdateUser,
      prisma,
    });

    let companyId = input.tokenPayload.c;
    if (input.companyId) {
      if (permission.rule.name === "Administrator" || permission.rule.name === "Manager") companyId = input.companyId;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: input.id,
        companyId,
      },
    });
    if (!user) throw new Error("User not found");

    let hasChange = false;

    if (input.name && input.name !== user.name) hasChange = true;
    if (input.phone && input.phone !== user.phone) hasChange = true;
    if (input.active !== undefined && input.active !== user.active) hasChange = true;
    if (input.attempts && input.attempts !== user.attempts) hasChange = true;
    if (input.ruleId && input.ruleId !== user.ruleId) hasChange = true;

    if (hasChange) {
      return prisma.user.update({
        where: {
          id: input.id,
          companyId,
        },
        data: {
          name: input.name || user.name,
          phone: input.phone || user.phone,
          active: input.active || user.active,
          attempts: input.attempts || user.attempts,
          ruleId: input.ruleId || user.ruleId,
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
        },
      });
    } else {
      return user;
    }
  } catch (error) {
    throw error;
  }
}
