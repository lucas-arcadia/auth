import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { GetContact } from "../../models/contact/GetContact";
import { ElysiaHeader, ElysiaQuery, ElysiaResponse } from "../common/common";

export default class GetContactController {
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
        "/contact/:id",
        async ({ tokenPayload, ip, params: { id }, query: { companyId, depth }, set }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");
            return await GetContact({ tokenPayload, ip, id, companyId, depth });
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
            summary: "Get Contact",
            description: "Get the data of a contact.",
            operationId: "GetContact",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          query: t.Object({
            companyId: ElysiaQuery.companyId,
            depth: ElysiaQuery.depth,
          }),

          params: t.Object({
            id: t.String({ description: "Contact ID" }),
          }),

          response: {
            200: t.Object(
              {
                id: t.String(),
                name: t.String(),
                email: t.String(),
                phone: t.String(),
                active: t.Boolean(),
                companyId: t.String(),
                createdAt: t.Date(),
                updatedAt: t.Date(),
                Company: t.Optional(t.Any()),
              },
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
