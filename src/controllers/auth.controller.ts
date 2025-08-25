// /src/controllers/auth.controller.ts

import jwt from "@elysiajs/jwt";
import Elysia, { t } from "elysia";
import { AuthModel, ILogin } from "../models/auth.model";

export const authController = (app: Elysia) => {
  return (
    app
      .use(
        jwt({
          name: "jwt",
          secret: process.env.JWT_SECRET || "MySecretKey",
          exp: "1d",
        })
      )

      .model({
        token: t.Object({
          token: t.String(),
        }),
        error: t.Object({
          code: t.Number(),
          message: t.String(),
        }),
      })

      // Login
      .post(
        "/login",
        async ({ body: { email, password, system }, jwt, set, request }) => {
          try {
            // Detectar automaticamente o sistema ombudsman baseado no valor específico
            let targetSystem = system;
            if (system === "lUcWEnp6rjlzZhSSqiArLfP6Nk7XOw8a") {
              targetSystem = "ombudsman";
            } else if (system === "xCkdRGV3MCFSsH7vTcisC3TIuKcHmdSU") {
              targetSystem = "csidesk";
            } else if (system === "1GHgUdCIX0WS4Ynx0vUIpvlAWQJzC4GT") {
              targetSystem = "csipanel";
            } else if (system === "flZMQefy8q0KTiMiMCjeyVDgDGY45arj") {
              targetSystem = "csiconnect";
            }

            const login = (await AuthModel.login(email, password, targetSystem)) as ILogin;

            return {
              token: await jwt.sign({
                userId: login.userId,
                companyId: login.companyId,
                ein: login.ein,
              }),
            };
          } catch (error: any) {
            switch (error.cause.type) {
              case "not_found":
                set.status = 401;
                return {
                  error: {
                    code: 401,
                    message: "Credenciais Inválidas",
                  },
                };

              case "invalid_password":
                set.status = 401;
                return {
                  error: {
                    code: 401,
                    message: "Credenciais Inválidas",
                  },
                };

              case "not_authorized":
                set.status = 401;
                return {
                  error: {
                    code: 401,
                    message: "Não Autorizado",
                  },
                };
            }

            set.status = 500;
            return {
              error: {
                code: 500,
                message: "An unexpected error occurred",
              },
            };
          }
        },
        {
          detail: {
            tags: ["Auth"],
            summary: "Login",
            description: "Authenticates a user and returns a JWT token",
          },
          body: t.Object({
            email: t.String({ format: "email", error: "Invalid email address" }),
            password: t.String({ minLength: 8, error: "Password must be at least 8 characters long" }),
            system: t.String({ description: "System identifier (e.g., 'ombudsman', 'csidesk', 'csipanel')" }),
          }),
          response: {
            200: t.Ref("token"),
            401: t.Object({
              error: t.Ref("error"),
            }),
            500: t.Object({
              error: t.Ref("error"),
            }),
          },
        }
      )

      // Verify Token
      .post(
        "/verify-token",
        async ({ body: { token }, jwt, set, request }) => {
          try {
            const payload = await jwt.verify(token);
            if (!payload) {
              throw new Error("Invalid token", { cause: { type: "invalid_token" } });
            }

            return {
              userId: payload.userId as string,
              companyId: payload.companyId as string,
              ein: payload.ein as string,
            };
          } catch (error: any) {
            switch (error.cause.type) {
              case "invalid_token":
                set.status = 401;
                return {
                  error: {
                    code: 401,
                    message: "Invalid token",
                  },
                };

              default:
                set.status = 500;
                return {
                  error: {
                    code: 500,
                    message: "An unexpected error occurred",
                  },
                };
            }
          }
        },
        {
          detail: {
            tags: ["Auth"],
            summary: "Verify Token",
            description: "Verifies a JWT token and returns user information",
          },
          body: t.Object({
            token: t.String(),
          }),
          response: {
            200: t.Object({
              userId: t.String(),
              companyId: t.String(),
              ein: t.String(),
            }),
            401: t.Object({
              error: t.Ref("error"),
            }),
            500: t.Object({
              error: t.Ref("error"),
            }),
          },
        }
      )
  );
};
