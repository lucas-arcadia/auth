import { Actions, Services, checkPermission } from "../../libs/permisstions";
import { prisma } from "../db";
import { IGetUser, IUser } from "./UserInterface";

export async function AboutMe(input: IGetUser): Promise<IUser> {
  try {
    await checkPermission({
      tokenPayload: input.tokenPayload, 
      service: Services.Company, 
      action:Actions.AboutMe, 
      prisma
    });

    const user = await prisma.user.findUnique({
      where: {
        id: input.tokenPayload.u,
        active: true,
        companyId: input.tokenPayload.c,
        Company: { active: true },
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
        Company: input.depth !== undefined ? {
          select: {
            name: true,
            surname: true,
            ein: true,
            active: true,
          },
        } : false,
        Rule: input.depth !== undefined ? {
          select: {
            name: true,
            description: true,
            Police: {
              select: {
                id: true,
                description: true,
                action: true,
              },
              where: {
                active: true
              },
              orderBy: [
                {
                  Service: {
                    name: "asc"
                  }
                },
                {
                  action: "asc"
                }
              ]
            }
          },
        } : false,
      },
    });
    if (!user) throw new Error("User not found");

    return user;
  } catch (error) {
    throw error;
  }
}
