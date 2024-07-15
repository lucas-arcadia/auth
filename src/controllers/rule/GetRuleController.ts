import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { GetRule } from "../../models/rule/GetRule";
import { ElysiaHeader, ElysiaQuery, ElysiaResponse } from "../common/common";

export default class GetRoleController {
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
        "/role/:id",
        async ({ params: { id }, query: { depth },set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            set.status = 200;
            return await GetRule({ tokenPayload, id, depth });
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
            tags: ["Regras"],
            summary: "Obter regra",
            description: "Obtém os dados de uma regra.",
            operationId: "GetRule",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          query: t.Object({
            depth: ElysiaQuery.depth,
          }),

          params: t.Object({
            id: t.String({ description: "ID da regra" }),
          }),

          response: {
            200: t.Object({
              id: t.String(),
              name: t.String(),
              description: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
              Police: t.Optional(t.Any()),
              User: t.Optional(
                t.Array(
                  t.Object({
                    id: t.String(),
                  })
                )
              ),
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
