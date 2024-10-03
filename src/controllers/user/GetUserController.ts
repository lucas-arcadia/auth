import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { GetUser } from "../../models/user/GetUser";
import { ElysiaHeader, ElysiaQuery, ElysiaResponse } from "../common/common";

export default class GetUserController {
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
        "/user/:id",
        async ({ query: { companyId, depth }, params: { id }, set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            set.status = 200;
            return await GetUser({ tokenPayload, id, companyId, depth });
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
            tags: ["Users"],
            summary: "Get user",
            description: "Get user data",
            operationId: "GetUser",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          query: t.Object({
            companyId: ElysiaQuery.companyId,
            depth: ElysiaQuery.depth,
          }),

          params: t.Object({
            id: t.String({ description: "User ID", error: JSON.stringify({ message: "The user ID is required" }) }),
          }),

          response: {
            200: t.Object({
              id: t.String(),
              name: t.String(),
              email: t.String(),
              phone: t.String(),
              attempts: t.Number(),
              active: t.Boolean(),
              companyId: t.String(),
              ruleId: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
              Company: t.Optional(t.Any()),
              Rule: t.Optional(t.Any()),
            }, { description: "Success" }),
            401: ElysiaResponse[401],
            403: ElysiaResponse[403],
            404: ElysiaResponse[404],
            500: ElysiaResponse[500],
          },
        }
      );
  }
}
