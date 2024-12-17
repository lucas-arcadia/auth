import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IAddPolicy, IPolicy } from "./PolicyInterfaces";

export async function AddPolicy(input: IAddPolicy): Promise<IPolicy> {
  try {
    await checkPermission(input.tokenPayload, Services.Company, Actions.AddPolicy, prisma);

    const exists = await prisma.policy.findUnique({
      where: {
        uniquePolicy: {
          serviceId: input.serviceId,
          action: input.action,
        }
      }
    });
    if (exists) throw new Error("Policy already exists");

    return await prisma.policy.create({
      data: {
        serviceId: input.serviceId,
        action: input.action,
        description: input.description,
        active: true,
        imutable: false
      }
    })

  } catch (error) {
    throw error;
  }
}