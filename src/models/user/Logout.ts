import { ITokenPayload } from "../../libs/jwt";
import { prisma } from "../db";

export async function Logout(tokenPayload: ITokenPayload): Promise<any> {
  try {
    // Procura o usuário
    const user = await prisma.user.findUnique({
      where: {
        id: tokenPayload.u,
        active: true,
      },
    });
    if (!user) throw new Error("Unauthorized");

    // Procura a empresa
    const company = await prisma.company.findUnique({
      where: {
        id: user.companyId,
        active: true,
      },
    });
    if (!company) throw new Error("Unauthorized");

    // Procura pelo último login válido do usuário. Utilizaremos o token
    const lastLogin = await prisma.userLogins.findFirst({
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
          action: "Logout"
        },
        where: {
          id: lastLogin.id
        }
      })
    } else {
      throw new Error("Unauthorized");
    }
    
  } catch (error) {
    throw error;
  }
}
