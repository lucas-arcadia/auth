import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IAddRule, IRule } from "./RuleInterface";

export async function AddRule(input: IAddRule): Promise<IRule> {
  try {
    const permission = await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.AddRule,
      prisma,
    });

    const exists = await prisma.rule.findUnique({ where: { name: input.name } });
    if (exists) throw new Error("Rule already exists");

    return await prisma.rule.create({
      data: {
        name: input.name,
        description: input.description,
        imutable: false,
      }
    });
  } catch (error) {
    throw error;
  }
}
