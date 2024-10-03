import Elysia, { t } from "elysia";
import { Login } from "../../models/user/Login";

export default class LoginController {
  constructor(readonly server: Elysia) {
    server.post(
      "/user/login",
      async ({ body: { email, password}, set }) => {
        try {
          const result = await Login({ email, password });

          set.headers["Authorization"] = `Bearer ${result.token}`;

          set.status = 200;
          return {
            token: result.token,
          };
        } catch (error: any) {
          if (error.message.includes("Unauthorized")) set.status = 401;
          else set.status = 500;

          return {
            message: error.message,
          };
        }
      },
      {
        type: "application/json",

        detail: {
          tags: ["Users"],
          description: "Login user",
          operationId: "LoginUser",
          summary: "Login",
        },

        body: t.Object({
          email: t.String(),
          password: t.String(),
        }),

        response: {
          200: t.Object({ token: t.String() }, { description: "Success" }),
          401: t.Object({ message: t.String() }, { description: "Unauthorized" }),
          500: t.Object({ message: t.String() }, { description: "Server Error" }),
        },
      }
    );
  }
}
