import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { GetCompany } from "../../models/company/GetCompany";
import { ElysiaHeader, ElysiaQuery, ElysiaResponse } from "../common/common";
import { prisma } from "../../models/db";

export default class GetCompanyController {
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
        "/company",
        async ({ query: { companyId, depth }, set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            set.status = 200;
            return await GetCompany({ tokenPayload, companyId, depth });
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
            tags: ["Empresas"],
            summary: "Obter",
            description: "Obtém os dados de uma empresa.",
            operationId: "GetCompany",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          query: t.Object({
            companyId: ElysiaQuery.companyId,
            depth: ElysiaQuery.depth,
          }),

          response: {
            200: t.Object({
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
