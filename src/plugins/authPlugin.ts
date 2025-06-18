// /src/plugins/authPlugin.ts

import { jwt } from "@elysiajs/jwt";
import { Elysia } from "elysia";
import { userHasPermission } from "../utils/permissions";

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
            set.status = 401;
            set.headers["WWW-Authenticate"] = 'Bearer realm="csi-auth-api", error="missing_token", error_description="Authorization header is required"';
            throw new Error("Authorization header is required", { cause: { type: "missing_token" } });
          }

          const token = authHeader.replace("Bearer ", "");
          const payload = await jwt.verify(token);
          if (!payload) {
            set.status = 401;
            set.headers["WWW-Authenticate"] = 'Bearer realm="csi-auth-api", error="invalid_token", error_description="Invalid or expired token"';
            throw new Error("Invalid or expired token", { cause: { type: "invalid_token" } });
          }

          // Verificar companyId, se necessário
          if (options.checkCompanyId && routeParams.companyId) {
            // Permitir acesso se o usuário pertence à emrpesa master
            if (payload.ein === "13019142000142" || payload.companyId === routeParams.companyId) {
              // Acesso permitido
              return payload;
            } else {
              set.status = 403;
              throw new Error("Forbidden", { cause: { type: "forbidden" } });
            }
          }

          // Verificar permissão, se especificada
          if (options.requiredPermission) {
            const hasPermission = await userHasPermission(payload.userId as string, options.requiredPermission);
            if (!hasPermission) {
              set.status = 403;
              throw new Error("Insufficient permissions", { cause: { type: "insufficient_permissions" } });
            }
          }

          // Retornar payload para uso no handler
          return payload;
        },
      };
    });
