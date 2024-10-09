import Elysia, { t } from "elysia";
import { ip } from "elysia-ip";
import jwt from "../../libs/jwt";
import { CheckPermission } from "../../models/user/CheckPermission";
import { ElysiaHeader, ElysiaResponse } from "../common/common";

export default class CheckPermissionController {
  constructor(readonly server: Elysia) {
    server
      .use(ip())
      .derive(async ({ headers }) => {
        try {
          const auth = headers["authorization"];
          if (!auth) return { tokenPayload: null };

          const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
          if (!token) return { tokenPayload: null };

          return { tokenPayload: await jwt.verify(token) };
        } catch (error) {
          return { tokenPayload: null };
        }
      })

      .get(
        "/user/checkpermission/:service/:action",
        async ({ ip, params: { service, action }, set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            set.status = 200;
            const result = await CheckPermission(tokenPayload, ip, service, action);
            if (!result)
              return {
                message: false,
              };

            return {
              message: result,
            };
          } catch (error: any) {
            set.status = 401;

            return {
              message: error.message,
            };
          }
        },
        {
          detail: {
            tags: ["Users"],
            summary: "Check permission",
            description: "Check if the user has permission or not based on the service and action.",
            operationId: "CheckPermission",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          params: t.Object({
            service: t.String({ description: "Service name", error: JSON.stringify({ message: "Service name is required" }) }),
            action: t.String({ description: "Action name", error: JSON.stringify({ message: "Action name is required" }) }),
          }),

          response: {
            200: t.Object({ message: t.Boolean() }, { description: "Success" }),
            401: ElysiaResponse[401],
          },
        }
      );
  }
}
