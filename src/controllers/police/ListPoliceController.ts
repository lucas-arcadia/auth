import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { ListPolice } from "../../models/police/ListPolice";
import { ElysiaHeader, ElysiaPaginationReturn, ElysiaQuery, ElysiaResponse } from "../common/common";

export default class ListPoliceController {
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
        "/police/list",
        async ({ query: { depth, limit, page }, set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            set.status = 200;
            return await ListPolice({ tokenPayload, depth, limit, page });
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
            tags: ["Políticas"],
            summary: "Listar",
            description: "Lista as políticas do sistema.",
            operationId: "ListPolice",
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
                  serviceId: t.String(),
                  description: t.String(),
                  action: t.String(),
                  active: t.Boolean(),
                  createdAt: t.Date(),
                  updatedAt: t.Date(),
                  Service: t.Optional(t.Any()),
                  Rule: t.Optional(t.Any()),
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
