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

          // Buscar usuário com roles e permissões
          const user = await prisma.user.findFirst({
            where: {
              id: String(payload.userId),
              deletedAt: null,
            },
            include: {
              Company: true,
              Role: {
                where: { deletedAt: null },
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

          // Consolidar permissões de todas as roles
          const permissions: Record<string, boolean> = {};
          const roleNames: string[] = [];

          user.Role.forEach((role) => {
            roleNames.push(role.name);
            const rolePermissions = role.roles as Record<string, boolean>;
            Object.assign(permissions, rolePermissions);
          });

          return {
            success: true,
            user: {
              id: user.id,
              companyId: user.companyId,
              name: user.name,
              email: user.email,
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
