import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { CheckPermission } from "../../models/user/CheckPermission";
import { IUserPermissionQuery } from "../../models/user/UserInterface";
import { Services } from "../../libs/permisstions";

export default class CheckPermissionController {
  constructor(readonly server: Elysia) {
    server
      .derive(async ({ headers }) => {
        try {
          const auth = headers["authorization"];
          if (!auth) return { tokenPayload: null };

          const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
          if (!token) return { tokenPayload: null };

          return { tokenPayload: await jwt.verify(token) };
        } catch (error) {
          return { tokenPayload: null };
        }
      })

      .get(
        "/user/checkpermission/:service/:action",
        async ({ params: { service, action }, set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            set.status = 200;
            const result = await CheckPermission(tokenPayload, service, action);
            if (!result)
              return {
                message: false,
              };

            return {
              message: result,
            };
          } catch (error: any) {
            set.status = 401;

            return {
              message: error.message,
            };
          }
        },
        {
          detail: {
            tags: ["Usuários"],
            summary: "Verifica permissão",
            description: "Verifica se o usuário tem permissão ou não com base no serviço e na ação.",
            operationId: "CheckPermission",
          },

          headers: t.Object({
            authorization: t.String({
              description: "Token authorization",
              error: JSON.stringify({ message: "Token is required" }),
            }),
          }),

          params: t.Object({
            service: t.String({ description: "Nome do serviço" }),
            action: t.String({ description: "Nome da ação" }),
          }),

          response: {
            200: t.Object({ message: t.Boolean() }),
            401: t.Object({ message: t.String() }, { description: "Unauthorized" }),
          },
        }
      );
  }
}
