import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { AddCompany } from "../../models/company/AddCompany";
import { IAddCompany } from "../../models/company/CompanyInterfaces";
import { ElysiaHeader, ElysiaResponse } from "../common/common";

export default class AddCompanyController {
  constructor(readonly server: Elysia) {
    server
      .derive(async ({ headers }) => {
        try {
          const auth = headers["authorization"];
          if (!auth) return { tokenPayload: null };

          const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : null;
          if (!bearer) return { tokenPayload: null };

          return { tokenPayload: await jwt.verify(bearer) };
        } catch (error) {
          return { tokenPayload: null };
        }
      })

      .post(
        "/company",
        async ({ body, set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            const { company, user } = body as IAddCompany;

            set.status = 201;
            return await AddCompany({ tokenPayload, company, user });
          } catch (error: any) {
            if (error.message.startsWith("Unauthorized")) set.status = 401;
            else if (error.message.startsWith("Forbidden")) set.status = 403;
            else if (error.message.includes("not found")) set.status = 403;
            else if (error.message.includes("already exists")) set.status = 409;
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
            summary: "Adicionar",
            description: "Adiciona uma nova empresa no sistema.",
            operationId: "AddCompany",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          body: t.Object({
            company: t.Object({
              name: t.String({ minLength: 8, error: "name: (Razão Social) Minimum 8 characters" }),
              surname: t.String({ minLength: 2, error: "surname: (Nome fantasia) Minimum 2 characters" }),
              ein: t.String({ minLength: 14, maxLength: 14, error: "ein: (CNPJ) Minimum and maximum of 14 numbers" }),
            }),
            user: t.Object({
              name: t.String({ minLength: 8, error: "user name: Minimum 8 characters" }),
              email: t.String({ format: "email", default: "user@email.com", error: "user email: invalid!" }),
              phone: t.String({ minLength: 8, error: "user phone: Minimum 8 characters" }),
              password: t.String({
                minLength: 8,
                pattern: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!#$%&*()-+_=,.<>?])(?=.*[ ]?).{8,}$",
                default: "Password123@",
                error: "user password: Minimum of 8 characters, including at least one lowercase letter, one uppercase letter, one number and one special character from the list !#$%&*()-+_=,.<>?",
              }),
            }),
          }),

          response: {
            201: t.Object({
              id: t.String(),
              name: t.String(),
              surname: t.String(),
              ein: t.String(),
              active: t.Optional(t.Boolean()),
              imutable: t.Optional(t.Boolean()),
              createdAt: t.Optional(t.Date()),
              updatedAt: t.Optional(t.Date()),
            }),
            401: ElysiaResponse[401],
            403: ElysiaResponse[403],
            404: ElysiaResponse[404],
            409: ElysiaResponse[409],
            500: ElysiaResponse[500],
          },
        }
      );
  }
}
