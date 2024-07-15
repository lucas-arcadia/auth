import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { ListUser } from "../../models/user/ListUser";
import { ElysiaHeader, ElysiaPaginationReturn, ElysiaQuery, ElysiaResponse } from "../common/common";

export default class ListUserController {
  constructor(readonly server: Elysia) {
    server
      .derive(async ({ headers }) => {
        try {
          const auth = headers["authorization"];
          if (!auth) return { tokenPayload: null };

          const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : null;
          if (!bearer) return { tokenPayload: null };

          return {
            tokenPayload: await jwt.verify(bearer),
          };
        } catch (error) {
          return { tokenPayload: null };
        }
      })

      .get(
        "/user/list",
        async ({ query: { companyId, depth, limit, page }, set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            set.status = 200;
            return await ListUser({ tokenPayload, companyId, depth, limit, page });
          } catch (error: any) {
            if (error.message.startsWith("Unauthorized")) set.status = 401;
            else if (error.message.startsWith("Forbidden")) set.status = 403;
            else if (error.message.includes("not found")) set.status = 404;
            else set.status = 500;

            return {
              message: error.message,
            };
          }
        },
        {
          type: "application/json",

          detail: {
            tags: ["Usuários"],
            summary: "Listar usuários",
            description: `Lista os usuários de uma empresa.`,
            operationId: "ListUser",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          query: t.Object({
            companyId: ElysiaQuery.companyId,
            depth: ElysiaQuery.depth,
            limit: ElysiaQuery.limit,
            page: ElysiaQuery.page,
          }),

          response: {
            200: t.Object({
              docs: t.Array(
                t.Object({
                  id: t.String(),
                  name: t.String(),
                  email: t.String(),
                  phone: t.String(),
                  active: t.Boolean(),
                  attempts: t.Number(),
                  companyId: t.String(),
                  ruleId: t.String(),
                  createdAt: t.Date(),
                  updatedAt: t.Date(),
                  Company: t.Optional(t.Any()),
                  Role: t.Optional(t.Any()),
                })
              ),
              ...ElysiaPaginationReturn,
            }),
            401: ElysiaResponse[401],
            403: ElysiaResponse[403],
            404: ElysiaResponse[404],
            500: ElysiaResponse[500],
          },
        }
      );
  }
}
