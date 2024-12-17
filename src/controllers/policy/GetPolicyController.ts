import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { GetPolicy } from "../../models/policy/GetPolicy";
import { ElysiaHeader, ElysiaQuery, ElysiaResponse } from "../common/common";

export default class GetPolicyController {
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
        "/policy/:id",
        async ({ params: { id }, query: { depth }, set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            return await GetPolicy({ tokenPayload, id, depth });
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
            tags: ["Policies"],
            summary: "Get",
            description: "Gets the data of a policy.",
            operationId: "GetPolicy",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          query: t.Object({
            depth: ElysiaQuery.depth,
          }),
          
          params: t.Object({
            id: t.String({ description: "ID da política" }),
          }),

          response: {
            200: t.Object({
              id: t.String(),
              serviceId: t.String(),
              description: t.String(),
              action: t.String(),
              active: t.Boolean(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
              Service: t.Optional(t.Any()),
              Rule: t.Optional(t.Any())
            }),
            401: ElysiaResponse[401],
            403: ElysiaResponse[403],
            404: ElysiaResponse[404],
            500: ElysiaResponse[500],
          }
        }
      )
  }
}
