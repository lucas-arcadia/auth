import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { ListCompanies } from "../../models/company/ListCompany";
import { ElysiaHeader, ElysiaQuery, ElysiaResponse } from "../common/common";

export default class ListCompanyController {
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
        "/company/list",
        async ({ ip, set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");
            return await ListCompanies({ tokenPayload, ip });
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
            tags: ["Companies"],
            summary: "List Companies",
            description: "List the companies in the system.",
            operationId: "ListCompanies",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          response: {
            200: t.Array(
              t.Object({
                id: t.String(),
                name: t.String(),
                surname: t.String(),
                ein: t.String(),
                active: t.Boolean(),
                createdAt: t.Date(),
                updatedAt: t.Date(),
              })
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
