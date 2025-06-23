import prisma from "../config/database";

export interface ILogin {
  userId: string;
  companyId: string;
  ein: string;
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
        console.log("User not found", email);
        throw new Error("Invalid credentials", { cause: { type: "not_found" } });
      }

      const isPasswordValid = await Bun.password.verify(password, user.password, "bcrypt");
      if (!isPasswordValid) {
        console.log("Invalid password", email);
        throw new Error("Invalid credentials", { cause: { type: "invalid_password" } });
      }

      return {
        userId: user.id,
        companyId: user.companyId,
        ein: user.Company.ein,
      };
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }
}
