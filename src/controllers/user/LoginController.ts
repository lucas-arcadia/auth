import Elysia, { t } from "elysia";
import { Login } from "../../models/user/Login";
import { ElysiaResponse } from "../common/common";

export default class LoginController {
  constructor(readonly server: Elysia) {
    server
    .derive(({ request }) => {
      const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "";
      return { ip: clientIp };
    })

      .post(
        "/user/login",
        async ({ body: { username, password }, set, ip }) => {
          try {
            const result = await Login({ username, password, ip: ip || "" });

            set.headers["Authorization"] = `Bearer ${result.token}`;
            set.status = 200;

            return {
              token: result.token,
            };
          } catch (error: any) {
            if (error.message.includes("Unauthorized")) set.status = 401;
            else if (error.message.includes("Unprocessable Entity")) set.status = 422;
            else set.status = 500;

            return {
              message: error.message,
            };
          }
        },
        {
          detail: {
            tags: ["Users"],
            description: "Login user",
            operationId: "LoginUser",
            summary: "Login",
          },

          body: t.Object({
            username: t.String({ description: "Username", error: "Username is required" }),
            password: t.String({ description: "Password", error: "Password is required" }),
          }),

          response: {
            200: t.Object({ token: t.String() }, { description: "Success" }),
            401: ElysiaResponse[401],
            422: ElysiaResponse[422],
            500: ElysiaResponse[500],
          },
        }
      );
  }
}
