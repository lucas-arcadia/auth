// /src/controllers/auth.controller.ts

import jwt from "@elysiajs/jwt";
import Elysia, { t } from "elysia";
import db from "../config/database";
import { GroupModel } from "../models/group.model";
import { User } from "../models/user.model";
import logger from "../utils/logger";
import { validateLoginFields } from "../utils/validation";

export const authController = (app: Elysia) => {
  return app
    .use(
      jwt({
        name: "jwt",
        secret: process.env.JWT_SECRET || "MySecretKey",
        exp: "1h",
      })
    )

    .model({
      error: t.Object({
        code: t.Number(),
        message: t.String(),
        details: t.Optional(
          t.Array(
            t.Object({
              field: t.String(),
              message: t.String(),
            })
          )
        ),
      }),
    })

    .post(
      "/login",
      async ({ body: { email, password }, jwt, set, request }) => {
        try {
          const errors = validateLoginFields(email, password);
          if (errors.length > 0) {
            logger.warn({ body: { email, password }, errors, url: request.url }, "Additional validation failed for POST /login");
            set.status = 400;
            return {
              error: {
                code: 400,
                message: "Validation failed",
                details: errors,
              },
            };
          }

          const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
          const user = stmt.get(email) as User | null;
          if (!user) {
            logger.warn({ body: { email, password }, url: request.url }, "User not found in POST /login");
            set.status = 404;
            return {
              error: {
                code: 404,
                message: "User not found",
              },
            };
          }

          if (user.deletedAt) {
            logger.warn({ body: { email, password }, url: request.url }, "User is deleted in POST /login");
            set.status = 410;
            return {
              error: {
                code: 410,
                message: "User is deleted",
              },
            };
          }

          const isPasswordValid = await Bun.password.verify(password, user.password, "bcrypt");
          if (!isPasswordValid) {
            logger.warn({ body: { email, password }, url: request.url }, "Invalid password in POST /login");
            set.status = 401;
            return {
              error: {
                code: 401,
                message: "Invalid credentials",
              },
            };
          }

          const group = await GroupModel.getById(user.groupId, user.companyId);

          const token = await jwt.sign({
            userId: user.id,
            groupId: user.groupId,
            companyId: user.companyId,
            groupName: group.name,
          });

          logger.info({ body: { email, password }, userId: user.id, url: request.url }, "User logged in successfully in POST /login");
          set.status = 200;

          return {
            data: {
              token,
            },
          };
        } catch (error: any) {
          logger.error({ error, body: { email, password }, url: request.url }, "Unexpected error in POST /login");
          set.status = 500;
          return {
            error: {
              code: 500,
              message: "Unexpected error occurred",
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
        }),
        response: {
          200: t.Object({
            data: t.Object({
              token: t.String(),
            }),
          }),
          400: t.Object({
            error: t.Ref("error"),
          }),
          401: t.Object({
            error: t.Ref("error"),
          }),
          404: t.Object({
            error: t.Ref("error"),
          }),
          410: t.Object({
            error: t.Ref("error"),
          }),
          500: t.Object({
            error: t.Ref("error"),
          }),
        },
      }
    )

    .post(
      "/verify-token",
      async ({ body: { token }, jwt, set, request }) => {
        try {
          const payload = await jwt.verify(token);
          if (!payload) {
            logger.warn({ url: request.url }, "Invalid JWT token");
            set.status = 401;
            return {
              error: {
                code: 401,
                message: "Invalid token",
              },
            };
          }

          logger.info({ url: request.url }, "Token verified successfully in POST /verify-token");
          set.status = 200;

          return {
            data: {
              userId: Number(payload.userId),
              groupId: Number(payload.groupId),
              companyId: Number(payload.companyId),
              groupName: payload.groupName as string,
            },
          };
        } catch (error: any) {
          logger.error({ error, url: request.url }, "Unexpected error in POST /verify-token");
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
          summary: "Verify Token",
          description: "Verifies a JWT token and returns user information",
        },
        body: t.Object({
          token: t.String(),
        }),
        response: {
          200: t.Object({
            data: t.Object({
              userId: t.Number(),
              groupId: t.Number(),
              companyId: t.Number(),
              groupName: t.String(),
            }),
          }),
          401: t.Object({
            error: t.Ref("error"),
          }),
          500: t.Object({
            error: t.Ref("error"),
          }),
        },
      }
    );
};
