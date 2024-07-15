import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IRule, IRuleUpdate } from "./RuleInterface";

export async function UpdadeRule(input: IRuleUpdate): Promise<IRule> {
  try {
    const permission = await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.UpdateRule,
      prisma,
    });

    const rule = await prisma.rule.findUnique({
      where: {
        id: input.id,
      },
    });
    if (!rule) throw new Error("Rule not found");

    let hasChange = false;

    if (input.name && input.name !== rule.name) hasChange = true;
    if (input.description && input.description !== rule.description) hasChange = true;

    if (hasChange) {
      return await prisma.rule.update({
        where: { id: input.id },
        data: {
          name: input.name || rule.name,
          description: input.description || rule.description,
        },
      });
    } else {
      return rule;
    }
  } catch (error) {
    throw error;
  }
}
