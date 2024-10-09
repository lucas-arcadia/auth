import Elysia, { t } from "elysia";
import { ip } from "elysia-ip";
import jwt from "../../libs/jwt";
import { ListCompanies } from "../../models/company/ListCompany";
import { ElysiaHeader, ElysiaPaginationReturn, ElysiaQuery, ElysiaResponse } from "../common/common";

export default class ListCompanyController {
  constructor(readonly server: Elysia) {
    server
      .use(ip())
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
        async ({ ip, query: { depth, limit, page }, set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            set.status = 200;
            return await ListCompanies({ tokenPayload, ip, depth, limit, page });
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
            tags: ["Companies"],
            summary: "List Companies",
            description: "List the companies in the system.",
            operationId: "ListCompanies",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          query: t.Object({
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
                  surname: t.String(),
                  ein: t.String(),
                  active: t.Optional(t.Boolean()),
                  createdAt: t.Optional(t.Date()),
                  updatedAt: t.Optional(t.Date()),
                  User: t.Optional(t.Any()),
                  Contact: t.Optional(t.Any()),
                  Service: t.Optional(t.Any()),
                })
              ),
              ...ElysiaPaginationReturn,
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
