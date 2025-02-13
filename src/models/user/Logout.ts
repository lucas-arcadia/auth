import { AuditTrail } from "../../libs/audit";
import { ITokenPayload } from "../../libs/jwt";
import { prisma, prismaRead } from "../db";

export interface ILogout {
  tokenPayload: ITokenPayload;
  ip: string;
}

export async function Logout(input: ILogout): Promise<any> {
  try {
    // Procura o usuário
    const user = await prismaRead.user.findUnique({
      where: {
        id: input.tokenPayload.u,
        active: true,
      },
    });
    if (!user) throw new Error("Unauthorized");

    // Procura a empresa
    const company = await prismaRead.company.findUnique({
      where: {
        id: user.companyId,
        active: true,
      },
    });
    if (!company) throw new Error("Unauthorized");

    // Procura pelo último login válido do usuário. Utilizaremos o token
    const lastLogin = await prismaRead.userLogins.findFirst({
      where: {
        userId: user.id,
        action: "Login",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    });
    if (lastLogin) {
      await prisma.userLogins.update({
        data: {
          action: "Logout",
        },
        where: {
          id: lastLogin.id,
        },
      });
    } else {
      throw new Error("Unauthorized");
    }
  } catch (error) {
    new AuditTrail("Logout", "User", `error: ${error}`, input.tokenPayload.u, JSON.stringify(error), input.ip);
    throw error;
  }
}
