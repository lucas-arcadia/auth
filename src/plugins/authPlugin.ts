// /src/plugins/authPlugin.ts

import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import logger from "../utils/logger";
import { getPermissions } from "../utils/permissions";

interface RouteParams {
  companyId?: string;
}

interface AuthOptions {
  requiredPermission?: string; // Permissão necessária para a rota (ex.: "create_user")
  checkCompanyId?: boolean; // Verificar se companyId do token corresponde ao parâmetro
}

export const authPlugin = (app: Elysia) =>
  app
    .use(
      jwt({
        name: "jwt",
        secret: process.env.JWT_SECRET || "supersecretkey", // Use variável de ambiente
      })
    )

    .derive(({ headers, jwt, set, request, params }) => {
      const routeParams = params as RouteParams;
      return {
        async auth(options: AuthOptions = {}) {
          const authHeader = headers.authorization;
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            logger.warn({ url: request.url }, "Missing or invalid Authorization header");
            set.status = 401;
            throw new Error("Unauthorized");
          }

          const token = authHeader.replace("Bearer ", "");
          const payload = await jwt.verify(token);
          if (!payload) {
            logger.warn({ url: request.url }, "Invalid JWT token");
            set.status = 401;
            throw new Error("Invalid token");
          }

          // Verificar companyId, se necessário
          if (options.checkCompanyId && routeParams.companyId) {
            if (payload.companyId !== Number(routeParams.companyId)) {
              logger.warn({ url: request.url, payload }, "User does not belong to company");
              set.status = 403;
              throw new Error("Forbidden");
            }
          }

          // Verificar permissão, se especificada
          if (options.requiredPermission) {
            const permissions = getPermissions(payload.groupName as string);
            if (!permissions[options.requiredPermission]) {
              logger.warn({ url: request.url, payload, requiredPermission: options.requiredPermission }, "Insufficient permissions");
              set.status = 403;
              throw new Error("Insufficient permissions");
            }
          }

          // Retornar payload para uso no handler
          return payload;
        },
      };
    })

    .onError(({ error, set, request }) => {
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage === "Unauthorized" || errorMessage === "Invalid token") {
        set.status = 401;
        return {
          error: {
            code: 401,
            message: errorMessage,
          },
        };
      }
      if (errorMessage === "Forbidden" || errorMessage === "Insufficient permissions") {
        set.status = 403;
        return {
          error: {
            code: 403,
            message: errorMessage,
          },
        };
      }
      logger.error({ error, url: request.url }, "Unexpected error in auth plugin");
      set.status = 500;
      return {
        error: {
          code: 500,
          message: "An unexpected error occurred",
        },
      };
    });
