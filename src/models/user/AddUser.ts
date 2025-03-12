import { AuditTrail } from "../../libs/audit";
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

    const userExists = await prisma.user.findUnique({ where: { email: input.email } });
    if (userExists) throw new Error("User already exists.");

    let companyId = input.tokenPayload.c;
    if (input.companyId) {
      if (permission.rule.name === "Administrator" || permission.rule.name === "Manager") companyId = input.companyId;
    }

    const rule = await prisma.rule.findFirst({ where: { name: "CompanyCommon" } });
    if (!rule) throw new Error("Rule not found");

    const hash = btoa(await Bun.password.hash(input.password));

    const result = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        hash: hash,
        attempts: 0,
        active: true,
        companyId: companyId,
        ruleId: rule.id,
        readOnly: false,
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

    new AuditTrail(
      "AddUser",
      "User",
      result.id,
      input.tokenPayload.u,
      JSON.stringify({
        name: result.name,
        email: result.email,
        phone: result.phone,
        companyId: result.companyId,
        ruleId: result.ruleId,
      }),
      input.ip
    );

    return result;
  } catch (error) {
    new AuditTrail("AddUser", "User", `error: ${error}`, input.tokenPayload.u, JSON.stringify(error), input.ip);

    throw error;
  }
}
