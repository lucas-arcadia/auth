import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { AddRule } from "../../models/rule/AddRule";
import { IAddRule } from "../../models/rule/RuleInterface";
import { ElysiaHeader, ElysiaResponse } from "../common/common";

export default class AddRoleController {
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
        "/role",
        async ({ body, set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            const { name, description } = body as IAddRule;

            set.status = 201;
            return await AddRule({ tokenPayload, name, description });
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
            tags: ["Regras"],
            summary: "Adicionar",
            description: "Adiciona uma nova regra no sistema.",
            operationId: "AddRule",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          body: t.Object({
            name: t.String(),
            description: t.String(),
          }),

          response: {
            200: t.Object({
              id: t.String(),
              name: t.String(),
              description: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
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
