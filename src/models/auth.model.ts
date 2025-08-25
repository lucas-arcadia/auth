import prisma from "../config/database";
import { userHasPermission } from "../utils/permissions";

export interface ILogin {
  userId: string;
  companyId: string;
  ein: string;
}

export class AuthModel {
  static async login(email: string, password: string, system: string): Promise<ILogin> {
    try {
      // Verificar se o sistema foi fornecido
      if (!system) {
        throw new Error("not_authorized", { cause: { type: "not_authorized", statusCode: 401 } });
      }

      const user = await prisma.user.findUnique({
        where: {
          email,
          deletedAt: null,
          Company: {
            deletedAt: null,
          },
        },
        include: {
          Company: {
            select: {
              ein: true,
            },
          },
        },
      });
      if (!user) {
        throw new Error("Invalid credentials", { cause: { type: "not_found" } });
      }

      const isPasswordValid = await Bun.password.verify(password, user.password, "bcrypt");
      if (!isPasswordValid) {
        throw new Error("Invalid credentials", { cause: { type: "invalid_password" } });
      }

      // Verificar permissão específica do sistema (agora obrigatório)
      const hasPermission = await userHasPermission(user.id, `login_${system}`);
      if (!hasPermission) {
        throw new Error("not_authorized", { cause: { type: "not_authorized", statusCode: 401 } });
      }

      return {
        userId: user.id,
        companyId: user.companyId,
        ein: user.Company.ein,
      };
    } catch (error) {
      throw error;
    }
  }
}
