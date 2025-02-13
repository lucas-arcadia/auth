import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { Logout } from "../../models/user/Logout";
import { ElysiaHeader } from "../common/common";

export default class LogoutController {
  constructor(readonly server: Elysia) {
    server
    .derive(({ request }) => {
      const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "";
      return { ip: clientIp };
    })

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
        "/user/logout",
        async ({ ip, set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            await Logout({ tokenPayload, ip});

            set.status = 200;

            return {
              message: "Logout success",
            };
          } catch (error: any) {
            if (error.message.startsWith("Unauthorized")) set.status = 401;
            else if (error.message.includes("not found")) set.status = 404;
            else set.status = 500;

            return {
              message: error.message,
            };
          }
        },
        {
          detail: {
            tags: ["Users"],
            description: "Logout user",
            operationId: "LogoutUser",
            summary: "Logout",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          response: {
            200: t.Object({ message: t.String() }, { description: "Success" }),
            401: t.Object({ message: t.String() }, { description: "Unauthorized" }),
            404: t.Object({ message: t.String() }, { description: "User not found" }),
            500: t.Object({ message: t.String() }, { description: "Server error" }),
          },
        }
      );
  }
}
