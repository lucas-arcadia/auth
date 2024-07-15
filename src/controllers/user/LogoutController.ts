import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { Logout } from "../../models/user/Logout";

export default class LogoutController {
  constructor(readonly server: Elysia) {
    server
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
        async ({ set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            await Logout(tokenPayload);

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
          type: "application/json",

          detail: {
            tags: ["Usuários"],
            description: "Faz o logout do usuário",
            operationId: "LogoutUsuario",
            summary: "Logout",
          },

          headers: t.Object({
            authorization: t.String({
              description: "Token authorization",
              error: JSON.stringify({ message: "Token is required" }),
            }),
          }),

          response: {
            200: t.Object({ message: t.String() }),
            401: t.Object({ message: t.String() }, { description: "Unauthorized" }),
            404: t.Object({ message: t.String() }, { description: "User not found" }),
            500: t.Object({ message: t.String() }, { description: "Server error" }),
          },
        }
      );
  }
}
