import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IAddUser, IUser } from "./UserInterface";

export async function AddUser(input: IAddUser): Promise<IUser> {
  try {
    const permission = await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.AddUser,
      prisma,
    });

    const exists = await prisma.user.findUnique({ where: { email: input.email } });
    if (exists) throw new Error("User already exists.");

    const rule = await prisma.rule.findUnique({ where: { id: input.ruleId } });
    if (!rule) throw new Error("Rule not found");

    let companyId = input.tokenPayload.c;
    if (input.companyId) {
      if (permission.rule.name === "Administrator" || permission.rule.name === "Manager") companyId = input.companyId
    }

    const hash = btoa(await Bun.password.hash(input.password));

    return await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        hash: hash,
        attempts: 0,
        active: true,
        companyId: companyId,
        ruleId: rule.id,
        imutable: false,
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
      },
    });
  } catch (error) {
    throw error;
  }
}
