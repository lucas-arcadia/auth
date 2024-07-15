import { createHash } from "crypto";
import jwt from "../../libs/jwt";
import dateUtil from "../../libs/dateUtil";
import { prisma } from "../db";

export interface ILogin {
  email: string;
  password: string;
}

export interface IToken {
  token: string;
}

export async function Login(input: ILogin): Promise<IToken> {
  try {
    // Procura o usuário
    const user = await prisma.user.findUnique({
      where: {
        email: input.email,
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

    // Procura pelas tentativas de login
    if (user.attempts >= 6) {
      const dateDiff = dateUtil.minutesDiff(new Date(), user.updatedAt);
      if (dateDiff < 10) {
        await prisma.userLogins.create({
          data: {
            userId: user.id,
            action: "Unauthorized (Blocked)",
          },
        });

        throw new Error("Unauthorized");
      } else {
        await prisma.user.update({
          data: {
            attempts: 0,
          },
          where: {
            id: user.id,
          },
        });
      }
    }

    // Verifica a senha
    if (!(await Bun.password.verify(input.password, atob(user.hash)))) {
      await prisma.user.update({
        data: {
          attempts: user.attempts + 1,
        },
        where: {
          id: user.id,
        },
      });

      // Log
      await prisma.userLogins.create({
        data: {
          userId: user.id,
          action: "Unauthorized (Wrong password)",
        },
      });

      throw new Error("Unauthorized");
    } else {
      // Log
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
          where: {
            id: lastLogin.id,
          },
          data: {
            action: "Logout by new login",
          },
        });
      }
    }

    // Token
    const fingerprint = crypto.randomUUID();
    const hash = createHash("sha256");
    const fpHash = hash.update(fingerprint);
    const token = await jwt.sign({
      u: user.id,
      c: user.companyId,
      r: user.ruleId,
      h: hash.digest("hex"),
    });
    const exp = (await jwt.verify(token)).exp || new Date().getTime();

    // Log
    await prisma.userLogins.create({
      data: {
        userId: user.id,
        token: token,
        action: "Login",
        fingerprint: fingerprint.toString(),
        expiresAt: new Date(exp * 1000),
      },
    });

    await prisma.user.update({
      data: {
        attempts: 0,
      },
      where: {
        id: user.id,
      },
    });

    return { token };
  } catch (error) {
    console.log(error)
    throw error;
  }
}
