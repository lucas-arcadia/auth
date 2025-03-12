import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { ListUsers } from "../../models/user/ListUser";
import { ElysiaHeader, ElysiaPaginationReturn, ElysiaQuery, ElysiaResponse } from "../common/common";

export default class ListUserController {
  constructor(readonly server: Elysia) {
    server
      .derive(({ request }) => {
        const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "";
        return { ip: clientIp };
      })

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
        async ({ ip, query: { companyId, depth }, set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");
            return await ListUsers({ tokenPayload, ip, companyId, depth });
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
          detail: {
            tags: ["Users"],
            summary: "List users",
            description: `List users of a company.`,
            operationId: "ListUser",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          query: t.Object({
            companyId: ElysiaQuery.companyId,
            depth: ElysiaQuery.depth,
          }),

          response: {
            200: t.Array(
              t.Object({
                id: t.Optional(t.String()),
                name: t.Optional(t.String()),
                email: t.Optional(t.String()),
                phone: t.Optional(t.String()),
                active: t.Optional(t.Boolean()),
                companyId: t.Optional(t.String()),
                ruleId: t.Optional(t.String()),
                updatedAt: t.Optional(t.Date()),
              }),
              { description: "Success" }
            ),
            401: ElysiaResponse[401],
            403: ElysiaResponse[403],
            404: ElysiaResponse[404],
            500: ElysiaResponse[500],
          },
        }
      );
  }
}
