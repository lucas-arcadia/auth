// csi-auth-api/src/controllers/token.controller.ts

import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import prisma from "../config/database";

export const tokenController = (app: Elysia) => {
  return app
    .use(
      jwt({
        name: "jwt",
        secret: process.env.JWT_SECRET || "your-secret-key",
      })
    )
    .get(
      "/validate-token",
      async ({ jwt, headers, set }) => {
        try {
          const authorization = headers.authorization;

          if (!authorization || !authorization.startsWith("Bearer ")) {
            set.status = 401;
            return {
              success: false,
              error: "Token não encontrado",
            };
          }

          const token = authorization.substring(7);
          const payload = await jwt.verify(token);

          if (!payload) {
            set.status = 401;
            return {
              success: false,
              error: "Token inválido",
            };
          }

          const user = await prisma.user.findFirst({
            where: {
              id: String(payload.userId),
              deletedAt: null,
            },
            include: {
              Company: true,
              Role: {
                include: {
                  Policy: true,
                },
              },
            },
          });

          if (!user) {
            set.status = 401;
            return {
              success: false,
              error: "Usuário não encontrado",
            };
          }


          const permissions: Record<string, boolean> = {};
          const roleNames: string[] = [];

          roleNames.push(user.Role.name);

          user.Role.Policy.forEach((policy) => {
            const policyPermissions = policy.name.split(',').map(p => p.trim());
            policyPermissions.forEach(permission => {
              if (permission) {
                permissions[permission] = true;
              }
            });
          });


          const age = user.birthdate
            ? new Date().getFullYear() - new Date(user.birthdate).getFullYear()
            : null;

          return {
            success: true,
            user: {
              id: user.id,
              companyId: user.companyId,
              name: user.name,
              email: user.email,
              age,
              roles: roleNames,
              permissions,
            },
          };
        } catch (error: any) {
          console.error("Error validating token:", error);
          set.status = 500;
          return {
            success: false,
            error: "Erro interno do servidor",
          };
        }
      },
      {
        detail: {
          tags: ["Authentication"],
          summary: "Validate JWT token",
          description: "Validate a JWT token and return user information with permissions",
        },
      }
    );
};
