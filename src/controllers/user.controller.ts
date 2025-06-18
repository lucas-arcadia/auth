// /src/controllers/user.controller.ts

import { Elysia, t } from "elysia";
import { IUser, UserModel } from "../models/user.model";
import { authPlugin } from "../plugins/authPlugin";

export const userController = (app: Elysia) => {
  return app.group("/company/:companyId/users", (app) => {
    app
      .use(authPlugin)
      .model({
        user: t.Object({
          id: t.String(),
          companyId: t.String(),
          name: t.String(),
          email: t.String(),
          phone: t.Nullable(t.String()),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          deletedAt: t.Nullable(t.Date()),
        }),

        error: t.Object({
          code: t.Number(),
          message: t.String(),
        }),
      })

      // Create a new user
      .post(
        "/",
        async ({ auth, body: { name, email, phone, password }, params: { companyId }, set }) => {
          try {
            await auth({ requiredPermission: "create_user" });
            const result = await UserModel.create(companyId, name, email, phone, password);
            set.status = 201;
            return result;
          } catch (error) {
            throw error;
          }
        },
        {
          detail: {
            tags: ["User"],
            summary: "Create a new user",
            description: "Creates a new user",
            security: [{ bearerAuth: [] }],
          },
          params: t.Object({
            companyId: t.String(),
          }),
          body: t.Object({
            name: t.String(),
            email: t.String(),
            phone: t.Nullable(t.String()),
            password: t.String(),
          }),
          response: {
            201: t.Ref("user"),
            401: t.Object({
              error: t.Ref("error"),
            }),
            403: t.Object({
              error: t.Ref("error"),
            }),
            500: t.Object({
              error: t.Ref("error"),
            }),
          },
        }
      )

      // Get all users from a company
      .get(
        "/list",
        async ({ auth, query: { offset = 0, limit = 10, search = "", sort = "id", order = "asc" }, params: { companyId }, set }) => {
          try {
            await auth({ requiredPermission: "read_user", checkCompanyId: true });

            const result = (await UserModel.getAll(companyId, offset, limit, search, sort, order)) as IUser[];

            return {
              total: result.length,
              totalNotFiltered: result.length,
              rows: result,
            };
          } catch (error: any) {
            if (error.cause?.type === "invalid_params") {
              set.status = 400;
              return {
                error: {
                  code: 400,
                  message: error.message,
                },
              };
            }

            throw error;
          }
        },
        {
          detail: {
            tags: ["User"],
            summary: "Get all users from a company",
            description: "Retrieves all users from the specified company. Requires a valid Bearer token in the Authorization header.",
            security: [{ bearerAuth: [] }],
          },
          params: t.Object({
            companyId: t.String(),
          }),
          query: t.Object({
            offset: t.Optional(t.Number({ default: 0, minimum: 0 })),
            limit: t.Optional(t.Number({ default: 10, minimum: 1 })),
            search: t.Optional(t.String()),
            sort: t.Optional(t.String({ enum: ["id", "name", "email", "phone"] })),
            order: t.Optional(t.String({ enum: ["asc", "desc"] })),
          }),
          response: {
            200: t.Object({
              total: t.Number(),
              totalNotFiltered: t.Number(),
              rows: t.Array(t.Ref("user")),
            }),
            400: t.Object({
              error: t.Ref("error"),
            }),
            401: t.Object({
              error: t.Ref("error"),
            }),
            403: t.Object({
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

      // Get a user by id from a company
      .get(
        "/id/:userId",
        async ({ params: { companyId, userId }, set, auth }) => {
          try {
            await auth({ requiredPermission: "read_user" });

            const user = await UserModel.getById(companyId, userId);
            if (!user) {
              throw new Error("User not found", { cause: { type: "not_found" } });
            }

            return user;
          } catch (error: any) {
            if (error.cause?.type === "missing_token") set.status = 401;
            else if (error.cause?.type === "invalid_token") set.status = 401;
            else if (error.cause?.type === "forbidden") set.status = 403;
            else if (error.cause?.type === "insufficient_permissions") set.status = 403;
            else if (error.cause?.type === "not_found") set.status = 404;
            else if (error.cause?.type === "deleted") set.status = 410;
            else set.status = 500;

            return {
              error: {
                code: set.status,
                message: error.message,
              },
            };
          }
        },
        {
          detail: {
            tags: ["User"],
            summary: "Get a user by id",
            description: "Retrieves a user by their ID for the specified company. Requires a valid Bearer token in the Authorization header.",
            security: [{ bearerAuth: [] }],
          },
          params: t.Object({
            userId: t.String(),
            companyId: t.String(),
          }),
          response: {
            200: t.Ref("user"),
            401: t.Object({
              error: t.Ref("error"),
            }),
            403: t.Object({
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
      );

    return app;
  });
};
