// /src/controllers/user.controller.ts

import { Elysia, t } from "elysia";
import { UserModel } from "../models/user.model";
import logger from "../utils/logger";
import { validateUserFields } from "../utils/validation";
import { authPlugin } from "../plugins/authPlugin";

export const userController = (app: Elysia) => {
  return app.group("/company/:companyId/users", (app) => {
    app
      .use(authPlugin)
      .model({
        user: t.Object({
          id: t.Number(),
          name: t.String(),
          email: t.String(),
          phone: t.String(),
          companyId: t.Number(),
          groupId: t.Number(),
          createdAt: t.String(),
          updatedAt: t.String(),
          deletedAt: t.Nullable(t.String()),
        }),

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

      .onError(({ error, code, set, request }) => {
        if (code === "VALIDATION") {
          const validationErrors: { field: string; message: string }[] = [];
          if (error.all && Array.isArray(error.all)) {
            for (const err of error.all) {
              if ("path" in err) {
                const field = err.path?.replace(/^\//, "") || "unknown";
                let message = err.message || "Invalid input";
                if (field === "name" && message.includes("minLength")) {
                  message = "Name is required";
                } else if (field === "email" && message.includes("pattern")) {
                  message = "Invalid email address";
                } else if (field === "phone" && message.includes("Invalid phone number")) {
                  message = "Invalid phone number";
                } else if (field === "params/companyId" && message.includes("minimum")) {
                  message = "Company ID must be a positive number";
                } else if (field === "params/userId" && message.includes("minimum")) {
                  message = "User ID must be a positive number";
                } else if (field === "groupId" && message.includes("minimum")) {
                  message = "Group ID must be a positive number";
                } else if (field === "password" && message.includes("minLength")) {
                  message = "Password must be at least 8 characters long";
                }
                validationErrors.push({ field: field.replace("params/", ""), message });
              }
            }
          } else {
            validationErrors.push({ field: "unknown", message: error.message || "Validation failed" });
          }
          logger.warn({ error, validationErrors, url: request.url }, "Validation error");
          set.status = 400;
          return {
            error: {
              code: 400,
              message: "Validation failed",
              details: validationErrors.length > 0 ? validationErrors : [{ field: "unknown", message: "Invalid input" }],
            },
          };
        }
        logger.error({ error, url: request.url }, "Unexpected error");
        set.status = 500;
        return {
          error: {
            code: 500,
            message: "An unexpected error occurred",
          },
        };
      })

      // Create a new user to a company
      .post(
        "/",
        async ({ params: { companyId }, body: { name, email, phone, groupId, password }, set, request }) => {
          try {
            const errors = validateUserFields(Number(companyId), Number(groupId), name, email, phone, password);
            if (errors.length > 0) {
              logger.warn({ params: { companyId }, body: { name, email, phone, groupId }, errors, url: request.url }, "Validation failed for POST /company/:companyId/users");
              set.status = 400;
              return {
                error: {
                  code: 400,
                  message: "Validation failed",
                  details: errors,
                },
              };
            }

            const user = await UserModel.create(name, email, phone, Number(companyId), Number(groupId), password);
            set.status = 201;
            logger.info({ params: { companyId }, body: { name, email, phone, groupId }, userId: user.id, url: request.url }, "User created in POST /company/:companyId/users");
            return {
              data: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                companyId: user.companyId,
                groupId: user.groupId,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                deletedAt: user.deletedAt,
              },
            };
          } catch (error: any) {
            console.log(error);
            if (error.cause?.type === "not_found") {
              logger.warn({ error, params: { companyId }, body: { name, email, phone, groupId }, url: request.url }, "Company or group not found in POST /company/:companyId/users");
              set.status = 404;
              return {
                error: {
                  code: 404,
                  message: error.message,
                },
              };
            }
            if (error.cause?.type === "deleted") {
              logger.warn({ error, params: { companyId }, body: { name, email, phone, groupId }, url: request.url }, "Company or group deleted in POST /company/:companyId/users");
              set.status = 410;
              return {
                error: {
                  code: 410,
                  message: error.message,
                },
              };
            }
            if (error.cause?.type === "invalid_group") {
              logger.warn({ error, params: { companyId }, body: { name, email, phone, groupId }, url: request.url }, "Invalid group in POST /company/:companyId/users");
              set.status = 400;
              return {
                error: {
                  code: 400,
                  message: error.message,
                },
              };
            }
            if (error.cause?.type === "duplicate_email" || error.cause?.type === "duplicate_name") {
              logger.warn({ error, params: { companyId }, body: { name, email, phone, groupId }, url: request.url }, "Duplicate email or name in POST /company/:companyId/users");
              set.status = 409;
              return {
                error: {
                  code: 409,
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
            summary: "Create a new user",
            description: "Creates a new user for the specified company",
          },
          params: t.Object({
            companyId: t.Number({ minimum: 1, error: "Company ID must be a positive number" }),
          }),
          body: t.Object({
            name: t.String(),
            email: t.String(),
            phone: t.String(),
            groupId: t.Number(),
            password: t.String(),
          }),
          response: {
            201: t.Object({
              data: t.Ref("user"),
            }),
            400: t.Object({
              error: t.Ref("error"),
            }),
            404: t.Object({
              error: t.Ref("error"),
            }),
            409: t.Object({
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

      // Get all users from a company
      .get(
        "/",
        async ({ params: { companyId }, query: { page = 1, pageSize = 10, includeDeleted = false }, set, request }) => {
          try {
            const result = await UserModel.getAll(Number(companyId), Number(page), Number(pageSize), Boolean(includeDeleted));

            logger.info({ params: { companyId }, query: { page, pageSize, includeDeleted }, total: result.total, url: request.url }, "Users fetched in GET /company/:companyId/users");

            return {
              data: result.users.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                companyId: user.companyId,
                groupId: user.groupId,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                deletedAt: user.deletedAt,
              })),
              meta: {
                total: result.total,
                page: result.page,
                pageSize: result.pageSize,
              },
            };
          } catch (error: any) {
            if (error.cause?.type === "invalid_params") {
              logger.warn({ error, params: { companyId }, query: { page, pageSize, includeDeleted }, url: request.url }, "Invalid parameters in GET /company-:companyId/users");
              set.status = 400;
              return {
                error: {
                  code: 400,
                  message: error.message,
                },
              };
            }

            if (error.cause?.type === "not_found") {
              logger.warn({ error, params: { companyId }, query: { page, pageSize, includeDeleted }, url: request.url }, "Company not found in GET /company/:companyId/users");
              set.status = 404;
              return {
                error: {
                  code: 404,
                  message: error.message,
                },
              };
            }
            if (error.cause?.type === "deleted") {
              logger.warn({ error, params: { companyId }, query: { page, pageSize, includeDeleted }, url: request.url }, "Company deleted in GET /company/:companyId/users");
              set.status = 410;
              return {
                error: {
                  code: 410,
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
            summary: "Get all users",
            description: "Retrieves all users for the specified company",
          },
          params: t.Object({
            companyId: t.Number({ minimum: 1, error: "Company ID must be a positive number" }),
          }),
          query: t.Object({
            page: t.Optional(t.Number({ default: 1, minimum: 1 })),
            pageSize: t.Optional(t.Number({ default: 10, minimum: 1, maximum: 100 })),
            includeDeleted: t.Optional(t.Boolean({ default: false })),
          }),
          response: {
            200: t.Object({
              data: t.Array(t.Ref("user")),
              meta: t.Object({
                total: t.Number(),
                page: t.Number(),
                pageSize: t.Number(),
              }),
            }),
            400: t.Object({
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
        "/:userId",
        async ({ params: { userId, companyId }, set, request }) => {
          try {
            const user = await UserModel.getById(Number(userId), Number(companyId));

            logger.info({ params: { userId, companyId }, url: request.url }, "User fetched in GET /company/:companyId/users/:userId");

            return {
              data: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                companyId: user.companyId,
                groupId: user.groupId,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                deletedAt: user.deletedAt,
              },
            };
          } catch (error: any) {
            if (error.cause?.type === "not_found") {
              logger.warn({ error, params: { companyId, userId }, url: request.url }, "User not found in GET /company/:companyId/users/:userId");
              set.status = 404;
              return {
                error: {
                  code: 404,
                  message: error.message,
                },
              };
            }

            if (error.cause?.type === "deleted") {
              logger.warn({ error, params: { companyId, userId }, url: request.url }, "User deleted in GET /company/:companyId/users/:userId");
              set.status = 410;
              return {
                error: {
                  code: 410,
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
            summary: "Get a user by id",
            description: "Retrieves a user by their ID for the specified company",
          },
          params: t.Object({
            userId: t.Number({ minimum: 1, error: "User ID must be a positive number" }),
            companyId: t.Number({ minimum: 1, error: "Company ID must be a positive number" }),
          }),
          response: {
            200: t.Object({
              data: t.Ref("user"),
            }),
            400: t.Object({
              error: t.Ref("error"),
            }),
            404: t.Object({
              error: t.Ref("error"),
            }),
            500: t.Object({
              error: t.Ref("error"),
            }),
          },
        }
      )

      // Update a user by id from a company
      .patch(
        "/:userId",
        async ({ params: { userId, companyId }, body: { name, phone, groupId, password }, set, request }) => {
          try {
            const errors = validateUserFields(Number(companyId), Number(groupId), name, undefined, phone, password);
            if (errors.length > 0) {
              logger.warn({ params: { companyId }, body: { name, phone, groupId }, errors, url: request.url }, "Validation failed for PATCH /company/:companyId/users/:userId");
              set.status = 400;
              return {
                error: {
                  code: 400,
                  message: "Validation failed",
                  details: errors,
                },
              };
            }

            const { user, update } = await UserModel.update(Number(userId), Number(companyId), { name, phone, password, groupId });

            logger.info({ params: { companyId, userId }, body: { name, phone, groupId }, userId: user.id, url: request.url }, "User updated in PATCH /company/:companyId/users/:userId");

            set.status = update ? 200 : 204;

            return {
              data: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                companyId: user.companyId,
                groupId: user.groupId,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                deletedAt: user.deletedAt,
              },
            };
          } catch (error: any) {
            if (error.cause?.type === "not_found") {
              logger.warn({ error, params: { companyId, userId }, url: request.url }, "User not found in PATCH /company/:companyId/users/:userId");
              set.status = 404;
              return {
                error: {
                  code: 404,
                  message: error.message,
                },
              };
            }
            if (error.cause?.type === "deleted") {
              logger.warn({ error, params: { companyId, userId }, url: request.url }, "User deleted in PATCH /company/:companyId/users/:userId");
              set.status = 410;
              return {
                error: {
                  code: 410,
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
            summary: "Update a user by id",
            description: "Updates a user by their ID for the specified company",
          },
          params: t.Object({
            companyId: t.Number({ minimum: 1, error: "Company ID must be a positive number" }),
            userId: t.Number({ minimum: 1, error: "User ID must be a positive number" }),
          }),
          body: t.Object({
            name: t.Optional(t.String()),
            phone: t.Optional(t.String()),
            groupId: t.Optional(t.Number()),
            password: t.Optional(t.String()),
          }),
          response: {
            200: t.Object({
              data: t.Ref("user"),
            }),
            400: t.Object({
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

      // Soft delete a user by id from a company
      .delete(
        "/:userId",
        async ({ params: { userId, companyId }, set, request }) => {
          try {
            const user = await UserModel.softDelete(Number(userId), Number(companyId));

            logger.info({ params: { companyId, userId }, userId: user.id, url: request.url }, "User deleted in DELETE /company/:companyId/users/:userId");

            return {
              data: user,
            };
          } catch (error: any) {
            if (error.cause?.type === "not_found") {
              logger.warn({ error, params: { companyId, userId }, url: request.url }, "User or company not found in DELETE /company/:companyId/users/:userId");
              set.status = 404;
              return {
                error: {
                  code: 404,
                  message: error.message,
                },
              };
            }

            if (error.cause?.type === "deleted") {
              logger.warn({ error, params: { companyId, userId }, url: request.url }, "User or company deleted in DELETE /company/:companyId/users/:userId");
              set.status = 410;
              return {
                error: {
                  code: 410,
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
            summary: "Delete a user by ID",
            description: "Soft deletes a user for the specified company",
          },
          params: t.Object({
            companyId: t.Number({ minimum: 1, error: "Company ID must be a positive number" }),
            userId: t.Number({ minimum: 1, error: "User ID must be a positive number" }),
          }),
          response: {
            200: t.Object({
              data: t.Ref("user"),
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

      // Restore a user by id from a company
      .patch(
        "/:userId/restore",
        async ({ params: { userId, companyId }, set, request }) => {
          try {
            const user = await UserModel.restore(Number(userId), Number(companyId));

            logger.info({ params: { companyId, userId }, userId: user.id, url: request.url }, "User restored in PATCH /company/:companyId/users/:userId/restore");

            return {
              data: user,
            };
          } catch (error: any) {
            if (error.cause?.type === "not_found") {
              logger.warn({ error, params: { companyId, userId }, url: request.url }, "User or company not found in PATCH /company/:companyId/users/:userId/restore");
              set.status = 404;
              return {
                error: {
                  code: 404,
                  message: error.message,
                },
              };
            }

            if (error.cause?.type === "deleted") {
              logger.warn({ error, params: { companyId, userId }, url: request.url }, "User or company deleted in PATCH /company/:companyId/users/:userId/restore");
              set.status = 410;
              return {
                error: {
                  code: 410,
                  message: error.message,
                },
              };
            }

            if (error.cause?.type === "not_deleted") {
              logger.warn({ error, params: { companyId, userId }, url: request.url }, "User not deleted in PATCH /company/:companyId/users/:userId/restore");
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
            summary: "Restore a user by ID",
            description: "Restores a soft deleted user for the specified company",
          },
          params: t.Object({
            companyId: t.Number({ minimum: 1, error: "Company ID must be a positive number" }),
            userId: t.Number({ minimum: 1, error: "User ID must be a positive number" }),
          }),
          response: {
            200: t.Object({
              data: t.Ref("user"),
            }),
            400: t.Object({
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
