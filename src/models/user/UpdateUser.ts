import { AuditTrail } from "../../libs/audit";
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

    let companyId = input.tokenPayload.c || undefined;
    if (input.companyId) {
      if (permission.rule.name === "Administrator" || permission.rule.name === "Manager") {
        companyId = input.companyId;
      }
    }

    const user = await prisma.user.findUnique({
      where: {
        id: input.id,
        ...(companyId && { companyId }),
      },
    });
    if (!user) throw new Error("User not found");

    if (user.readOnly) {
      new AuditTrail("UpdateUser", "User", `User ${user.name} (${user.id}) is read only`, input.tokenPayload.u, JSON.stringify({ user }), input.ip);
      throw new Error("User is read only");
    }

    let hasChange = false;

    if (input.name && input.name !== user.name) hasChange = true;
    if (input.phone && input.phone !== user.phone) hasChange = true;
    if (input.active !== undefined && input.active !== user.active) hasChange = true;
    if (input.attempts && input.attempts !== user.attempts) hasChange = true;
    if (input.ruleId && input.ruleId !== user.ruleId) hasChange = true;

    if (hasChange) {
      new AuditTrail("UpdateUser", "User", `User updated: ${user.name}`, input.tokenPayload.u, JSON.stringify({ from: { name: user.name, phone: user.phone, active: user.active, attempts: user.attempts, ruleId: user.ruleId }, to: { name: input.name, phone: input.phone, active: input.active, attempts: input.attempts, ruleId: input.ruleId } }), input.ip);

      return prisma.user.update({
        where: {
          id: input.id,
          ...(companyId && { companyId }),
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
    new AuditTrail("UpdateUser", "User", `error: ${error}`, input.tokenPayload.u, JSON.stringify(error), input.ip);

    throw error;
  }
}
