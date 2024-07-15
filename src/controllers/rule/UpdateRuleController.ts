import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { UpdadeRule } from "../../models/rule/UpdateRule";
import { IRuleUpdate } from "../../models/rule/RuleInterface";
import { ElysiaHeader } from "../common/common";

export default class UpdadeRoleController {
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
        "/rule/:id",
        async ({ body, params: { id }, set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            const { name, description } = body as IRuleUpdate;

            return await UpdadeRule({ tokenPayload, id, name, description });
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
            tags: ["Regras"],
            summary: "Atualizar regra",
            description: "Atualiza os dados de uma regra.",
            operationId: "UpdateRule",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          body: t.Object({
            name: t.Optional(t.String()),
            description: t.Optional(t.String()),
          }),
        }
      );
  }
}
