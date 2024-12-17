import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IPolicy, IUpdatePolicy } from "./PolicyInterfaces";

export async function UpdadePolicy(input: IUpdatePolicy): Promise<IPolicy> {
  try {
    const permission = await checkPermission({
      tokenPayload: input.tokenPayload,
      service: Services.Company,
      action: Actions.UpdatePolicy,
      prisma,
    });

    const policy = await prisma.policy.findUnique({
      where: {
        id: input.id,
        imutable: false,
      },
    });
    if (!policy) throw new Error("Policy not found");

    let hasChange = false;

    if (input.serviceId && input.serviceId !== policy.serviceId) hasChange = true;
    if (input.description && input.description !== policy.description) hasChange = true;
    if (input.action !== undefined && input.action !== policy.action) hasChange = true;
    if (input.active !== undefined && input.active !== policy.active) hasChange = true;

    if (hasChange) {
      return await prisma.policy.update({
        where: { id: input.id },
        data: {
          serviceId: input.serviceId || policy.serviceId,
          description: input.description || policy.description,
          active: input.active || policy.active,
        },
      });
    } else {
      return policy;
    }
  } catch (error) {
    throw error;
  }
}
