import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { UpdadePolicy } from "../../models/policy/UpdatePolicy";
import { IUpdatePolicy } from "../../models/policy/PolicyInterfaces";
import { ElysiaHeader, ElysiaResponse } from "../common/common";

export default class UpdatePolicyController {
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
        "/policy/:id",
        async ({ body, params: { id }, set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            const { serviceId, description, action, active } = body as IUpdatePolicy;

            return await UpdadePolicy({ tokenPayload, serviceId, id, description, action, active });
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
            tags: ["Policies"],
            summary: "Update",
            description: "Updates the data of a policy.",
            operationId: "UpdatePolicy",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          body: t.Object({
            serviceId: t.Optional(t.String()),
            description: t.Optional(t.String()),
            action: t.Optional(t.String()),
            active: t.Optional(t.Boolean()),
          }),

          response: {
            200: t.Object({
              id: t.String(),
              serviceId: t.String(),
              description: t.String(),
              action: t.String(),
              active: t.Boolean(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
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
