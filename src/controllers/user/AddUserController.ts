import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { AddUser } from "../../models/user/AddUser";
import { IAddUser } from "../../models/user/UserInterface";
import { ElysiaHeader, ElysiaResponse } from "../common/common";

export default class AddUserController {
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
        "/user",
        async ({ body, set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            const { name, email, phone, password, companyId, ruleId } = body as IAddUser;

            set.status = 201;
            return await AddUser({ tokenPayload, name, email, phone, password, companyId, ruleId });
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
            tags: ["Usuários"],
            summary: "Adicionar",
            description: "Adiciona um novo usuário a uma empresa no sistema.",
            operationId: "AddUser",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          body: t.Object({
            name: t.String(),
            email: t.String(),
            phone: t.String(),
            password: t.String(),
            ruleId: t.String(),
          }),

          response: {
            200: t.Object({
              id: t.String(),
              name: t.String(),
              email: t.String(),
              phone: t.String(),
              attempts: t.Number(),
              active: t.Boolean(),
              companyId: t.String(),
              ruleId: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
              Company: t.Optional(t.Any()),
              Rule: t.Optional(t.Any()),
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
