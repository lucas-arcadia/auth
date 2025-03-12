import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { ListContact } from "../../models/contact/ListContact";
import { ElysiaHeader, ElysiaPaginationReturn, ElysiaQuery, ElysiaResponse } from "../common/common";

export default class ListContactController {
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
        "/contact/list",
        async ({ tokenPayload, ip, query: { companyId, depth }, set }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");
            return await ListContact({ tokenPayload, ip, companyId, depth });
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
            tags: ["Contact"],
            summary: "List Contacts",
            description: "List the contacts of a company.",
            operationId: "ListContact",
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
                createdAt: t.Optional(t.Date()),
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
