import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IGetRule, IRule } from "./RuleInterface";


export async function GetRule(input: IGetRule): Promise<IRule> {
  try {
    const permission = await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.GetRule,
      prisma,
    });

    const result = await prisma.rule.findUnique({
      where: {
        id: input.id
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        Police: input.depth !== undefined ? true : false,
        User:
          input.depth !== undefined
            ? {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  active: true,
                  attempts: true,
                  ruleId: true,
                  createdAt: true,
                  updatedAt: true,
                },
              }
            : false,
      }
    });

    if (!result) throw new Error("Role not found");

    return result;
  } catch (error) {
    throw error;
  }
}