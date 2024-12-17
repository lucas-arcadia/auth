import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { AddPolicy } from "../../models/policy/AddPolicy";
import { IAddPolicy } from "../../models/policy/PolicyInterfaces";
import { ElysiaHeader, ElysiaResponse } from "../common/common";

export default class AddPolicyController {
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
        "/policy",
        async ({ body, set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            const { serviceId, description, action, effect } = body as IAddPolicy;

            set.status = 201;
            return await AddPolicy({ tokenPayload, serviceId, description, action, effect });
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
            tags: ["Policies"],
            summary: "Add Policy",
            description: "Add a new policy to a service in the system.",
            operationId: "AddPolicy",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          body: t.Object({
            serviceId: t.String(),
            description: t.String(),
            action: t.String(),
            effect: t.String(),
          }),

          response: {
            200: t.Object({
              id: t.String(),
              serviceId: t.String(),
              description: t.String(),
              action: t.String(),
              active: t.Boolean(),
              createdAt: t.Date(),
              updatedAt: t.Date()
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
