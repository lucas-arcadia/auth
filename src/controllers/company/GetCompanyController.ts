import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { GetCompany } from "../../models/company/GetCompany";
import { ElysiaHeader, ElysiaQuery, ElysiaResponse } from "../common/common";

export default class GetCompanyController {
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
        "/company/:id",
        async ({ ip, params: { id }, set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");
            return await GetCompany({ tokenPayload, ip, id });
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
            summary: "Get Company",
            description: "Get the data of a company.",
            operationId: "GetCompany",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          params: t.Object({
            id: t.String({ description: "Company ID", error: JSON.stringify({ message: "The company ID is required" }) }),
          }),

          response: {
            200: t.Object(
              {
                id: t.String(),
                name: t.String(),
                surname: t.String(),
                ein: t.String(),
                active: t.Optional(t.Boolean()),
                readOnly: t.Optional(t.Boolean()),
                createdAt: t.Optional(t.Date()),
                updatedAt: t.Optional(t.Date()),
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
