import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { UpdadeCompany } from "../../models/company/UpdateCompany";
import { IUpdateCompany } from "../../models/company/CompanyInterfaces";
import { ElysiaHeader, ElysiaResponse } from "../common/common";

export default class UpdadeCompanyController {
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

      .patch(
        "/company",
        async ({ body, set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            const { companyId, name, surname } = body as IUpdateCompany;

            set.status = 200;
            return await UpdadeCompany({ tokenPayload, companyId, name, surname });
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
            summary: "Atualizar",
            description: "Atualiza os dados de uma empresa",
            operationId: "UpdateCompany",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          body: t.Object({
            companyId: t.Optional(t.String()),
            name: t.Optional(t.String()),
            surname: t.Optional(t.String()),
            serviceId: t.Optional(t.String()),
          }),

          response: {
            200: t.Object({
              id: t.String(),
              name: t.String(),
              surname: t.String(),
              ein: t.String(),
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
