import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { AddContact } from "../../models/contact/AddContact";
import { IAddContact } from "../../models/contact/ContactInterfaces";
import { ElysiaHeader, ElysiaQuery, ElysiaResponse } from "../common/common";

export default class AddContactController {
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
        "/contact",
        async ({ body, query: { companyId, depth }, set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            const { name, email, phone } = body as IAddContact;

            set.status = 201;
            return await AddContact({ tokenPayload, name, email, phone, companyId });
          } catch (error: any) {
            if (error.message.startsWith("Unauthorized")) set.status = 401;
            else if (error.message.startsWith("Forbidden")) set.status = 403;
            else if (error.message.includes("not found")) set.status = 404;
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
            tags: ["Contato"],
            summary: "Adicionar",
            description: "Adiciona um novo contato a uma empresa no sistema.",
            operationId: "AddContact",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          query: t.Object({
            companyId: ElysiaQuery.companyId,
            depth: ElysiaQuery.depth,
          }),

          body: t.Object({
            name: t.String(),
            email: t.String(),
            phone: t.String(),
          }),

          response: {
            200: t.Object({
              id: t.String(),
              name: t.String(),
              email: t.String(),
              phone: t.String(),
              active: t.Boolean(),
              companyId: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
              Company: t.Optional(t.Any()),
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
