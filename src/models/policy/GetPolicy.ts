import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IGetPolicy, IPolicy } from "./PolicyInterfaces";

export async function GetPolicy(input: IGetPolicy): Promise<IPolicy> {
  try {
    const permission = await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.GetPolicy,
      prisma,
    });

    const result = await prisma.policy.findUnique({
      where: {
        id: input.id
      },
      select: {
        id: true,
        serviceId: true,
        description: true,
        action: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        Service: input.depth !== undefined ? true : false,
        Rule: input.depth !== undefined ? true : false,
      }
      
    });
    if (!result) throw new Error("Policy does not found");

    return result;
  } catch (error) {
    throw error;
  }
}