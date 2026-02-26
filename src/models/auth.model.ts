import prisma from "../config/database";
import { userHasPermission } from "../utils/permissions";

export interface ILogin {
  userId: string;
  companyId: string;
  ein: string;
  age: number | null;
  gender: string | null;
  schoolYear: string | null;
}

export class AuthModel {
  static async login(email: string, password: string): Promise<ILogin> {
    try {
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


      const age = user.birthdate
        ? new Date().getFullYear() - new Date(user.birthdate).getFullYear()
        : null;

      return {
        userId: user.id,
        companyId: user.companyId,
        ein: user.Company.ein,
        age,
        gender: user.gender,
        schoolYear: user.schoolYear,
      };
    } catch (error) {
      throw error;
    }
  }
}
