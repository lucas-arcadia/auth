// /src/controllers/group.controller.ts

import { Elysia, t } from "elysia";
import { GroupModel } from "../models/group.model";
import logger from "../utils/logger";
import { validateGroupFields } from "../utils/validation";

export const groupController = (app: Elysia) => {
  return app.group("/company/:companyId/groups", (app) => {
    app
      .model({
        group: t.Object({
          id: t.Number(),
          name: t.String(),
          companyId: t.Number(),
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
                  message = "Name must not be empty";
                } else if (field === "companyId" && message.includes("minimum")) {
                  message = "Company ID must be a positive number";
                } else if (field === "params/companyId" && message.includes("minimum")) {
                  message = "Company ID must be a positive number";
                } else if (field === "params/groupId" && message.includes("minimum")) {
                  message = "Group ID must be a positive number";
                }

                validationErrors.push({ field, message });
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

      // Create a new group to a company
      .post(
        "/",
        async ({ params: { companyId }, body: { name }, set, request }) => {
          try {
            const errors = validateGroupFields(name, Number(companyId));
            if (errors.length > 0) {
              logger.warn({ params: { companyId }, body: { name }, errors, url: request.url }, "Additional validation failed for POST /company/:companyId/group");
              set.status = 400;
              return {
                error: {
                  code: 400,
                  message: "Validation failed",
                  details: errors,
                },
              };
            }

            const group = await GroupModel.create(name, Number(companyId));
            
            set.status = 201;
            
            logger.info({ params: { companyId }, body: { name }, groupId: group.id, url: request.url }, "Group created in POST /company/:companyId/group");
            
            return {
              data: group,
            };
          } catch (error: any) {
            if (error.cause?.type === "not_found") {
              logger.warn({ error, params: { companyId }, body: { name }, url: request.url }, "Company not found in POST /company/:companyId/group");
              set.status = 404;
              return {
                error: {
                  code: 404,
                  message: error.message,
                },
              };
            }

            if (error.cause?.type === "deleted") {
              logger.warn({ error, params: { companyId }, body: { name }, url: request.url }, "Company deleted in POST /company/:companyId/group");
              set.status = 410;
              return {
                error: {
                  code: 410,
                  message: error.message,
                },
              };
            }

            if (error.cause?.type === "duplicate") {
              logger.warn({ error, params: { companyId }, body: { name }, url: request.url }, "Duplicate group name in POST /company/:companyId/group");
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
            tags: ["Group"],
            summary: "Create a new group",
            description: "Creates a new group for the specified company",
          },
          params: t.Object({
            companyId: t.Number({ minimum: 1, error: "Company ID must be a positive number" }),
          }),
          body: t.Object({
            name: t.String({ minLength: 1, error: "Name must not be empty" }),
          }),
          response: {
            201: t.Object({
              data: t.Ref("group"),
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

      // Get all groups from a company
      .get(
        "/",
        async ({ params: { companyId }, query: { page = 1, pageSize = 10, includeDeleted = false }, set, request }) => {
          try {
            const result = await GroupModel.getAll(Number(companyId), page, pageSize, includeDeleted);
            
            logger.info({ params: { companyId }, query: { page, pageSize, includeDeleted }, total: result.total, url: request.url }, "Groups fetched in GET /company/:companyId/group");
            
            return {
              data: result.groups,
              meta: {
                total: result.total,
                page: result.page,
                pageSize: result.pageSize,
              },
            };
          } catch (error: any) {
            if (error.cause?.type === "invalid_params") {
              logger.warn({ error, params: { companyId }, query: { page, pageSize, includeDeleted }, url: request.url }, "Invalid parameters in GET /company/:companyId/group");
              set.status = 400;
              return {
                error: {
                  code: 400,
                  message: error.message,
                },
              };
            }

            if (error.cause?.type === "not_found") {
              logger.warn({ error, params: { companyId }, query: { page, pageSize, includeDeleted }, url: request.url }, "Company not found in GET /company/:companyId/group");
              set.status = 404;
              return {
                error: {
                  code: 404,
                  message: error.message,
                },
              };
            }

            if (error.cause?.type === "deleted") {
              logger.warn({ error, params: { companyId }, query: { page, pageSize, includeDeleted }, url: request.url }, "Company deleted in GET /company/:companyId/group");
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
            tags: ["Group"],
            summary: "Get all groups for a company",
            description: "Retrieves a paginated list of groups for the specified company",
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
              data: t.Array(t.Ref("group")),
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

      // Get a group by id from a company
      .get(
        "/:groupId",
        async ({ params: { companyId, groupId }, set, request }) => {
          try {
            const group = await GroupModel.getById(Number(groupId), Number(companyId));
            
            logger.info({ params: { companyId, groupId }, groupId: group.id, url: request.url }, "Group fetched in GET /company/:companyId/group/:groupId");

            return {
              data: group,
            };
          } catch (error: any) {
            if (error.cause?.type === "not_found") {
              logger.warn({ error, params: { companyId, groupId }, url: request.url }, "Group or company not found in GET /company/:companyId/group/:groupId");
              set.status = 404;
              return {
                error: {
                  code: 404,
                  message: error.message,
                },
              };
            }

            if (error.cause?.type === "deleted") {
              logger.warn({ error, params: { companyId, groupId }, url: request.url }, "Group or company deleted in GET /company/:companyId/group/:groupId");
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
            tags: ["Group"],
            summary: "Get a group by ID",
            description: "Retrieves a group by its ID for the specified company",
          },
          params: t.Object({
            companyId: t.Number({ minimum: 1, error: "Company ID must be a positive number" }),
            groupId: t.Number({ minimum: 1, error: "Group ID must be a positive number" }),
          }),
          response: {
            200: t.Object({
              data: t.Ref("group"),
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

      // Get all users from a group from a company
      .get(
        "/:groupId/users",
        async ({ params: { companyId, groupId }, query: { page = 1, pageSize = 10, includeDeleted = false }, set, request }) => {
          try {
            const result = await GroupModel.getAllUsersBelongTo(Number(groupId), Number(companyId), Number(page), Number(pageSize), Boolean(includeDeleted));
            
            logger.info({ params: { companyId, groupId }, query: { page, pageSize, includeDeleted }, total: result.total, url: request.url }, "Users fetched in GET /company/:companyId/group/:groupId/users");

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
            if (error.cause?.type === "not_found") {
              logger.warn({ error, params: { companyId, groupId }, url: request.url }, "Group or company not found in GET /company/:companyId/group/:groupId/users");
              set.status = 404;
              return {
                error: {
                  code: 404,
                  message: error.message,
                },
              };
            }

            if (error.cause?.type === "deleted") {
              logger.warn({ error, params: { companyId, groupId }, url: request.url }, "Group or company deleted in GET /company/:companyId/group/:groupId/users");
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
            tags: ["Group"],
            summary: "Get all users from a group from a company",
            description: "Retrieves all users from a group for the specified company",
          },
          params: t.Object({
            companyId: t.Number({ minimum: 1, error: "Company ID must be a positive number" }),
            groupId: t.Number({ minimum: 1, error: "Group ID must be a positive number" }),
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

      // Update a group by id from a company
      .patch(
        "/:groupId",
        async ({ params: { companyId, groupId }, body: { name }, set, request }) => {
          try {
            const errors = validateGroupFields(name, Number(companyId));
            if (errors.length > 0) {
              logger.warn({ params: { companyId, groupId }, body: { name }, errors, url: request.url }, "Additional validation failed for PATCH /company/:companyId/group/:groupId");
              set.status = 400;
              return {
                error: {
                  code: 400,
                  message: "Validation failed",
                  details: errors,
                },
              };
            }

            const { group, updated } = await GroupModel.update(Number(groupId), name, Number(companyId));
            if (group.companyId !== Number(companyId)) {
              logger.warn({ params: { companyId, groupId }, body: { name }, url: request.url }, "Group does not belong to company in PATCH /company/:companyId/group/:groupId");
              set.status = 404;
              return {
                error: {
                  code: 404,
                  message: "Group not found",
                },
              };
            }

            set.status = updated ? 200 : 204;
            logger.info({ params: { companyId, groupId }, body: { name }, updated, groupId: group.id, url: request.url }, `Group ${updated ? "updated" : "unchanged"} in PATCH /company/:companyId/group/:groupId`);

            return {
              data: group,
            };
          } catch (error: any) {
            if (error.cause?.type === "not_found") {
              logger.warn({ error, params: { companyId, groupId }, body: { name }, url: request.url }, "Group or company not found in PATCH /company/:companyId/group/:groupId");
              set.status = 404;
              return {
                error: {
                  code: 404,
                  message: error.message,
                },
              };
            }

            if (error.cause?.type === "deleted") {
              logger.warn({ error, params: { companyId, groupId }, body: { name }, url: request.url }, "Group or company deleted in PATCH /company/:companyId/group/:groupId");
              set.status = 410;
              return {
                error: {
                  code: 410,
                  message: error.message,
                },
              };
            }

            if (error.cause?.type === "duplicate") {
              logger.warn({ error, params: { companyId, groupId }, body: { name }, url: request.url }, "Duplicate group name in PATCH /company/:companyId/group/:groupId");
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
            tags: ["Group"],
            summary: "Update a group by ID",
            description: "Updates the name of a group identified by its ID for the specified company",
          },
          params: t.Object({
            companyId: t.Number({ minimum: 1, error: "Company ID must be a positive number" }),
            groupId: t.Number({ minimum: 1, error: "Group ID must be a positive number" }),
          }),
          body: t.Object({
            name: t.String(),
          }),
          response: {
            200: t.Object({
              data: t.Ref("group"),
            }),
            204: t.Object({
              data: t.Ref("group"),
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

      // Soft delete a group by id from a company
      .delete(
        "/:groupId",
        async ({ params: { companyId, groupId }, set, request }) => {
          try {
            const group = await GroupModel.softDelete(Number(groupId), Number(companyId));

            set.status = 200;

            logger.info({ params: { companyId, groupId }, groupId: group.id, url: request.url }, "Group deleted in DELETE /company/:companyId/group/:groupId");

            return {
              data: group,
            };
          } catch (error: any) {
            if (error.cause?.type === "not_found") {
              logger.warn({ error, params: { companyId, groupId }, url: request.url }, "Group or company not found in DELETE /company/:companyId/group/:groupId");
              set.status = 404;
              return {
                error: {
                  code: 404,
                  message: error.message,
                },
              };
            }

            if (error.cause?.type === "deleted") {
              logger.warn({ error, params: { companyId, groupId }, url: request.url }, "Group or company deleted in DELETE /company/:companyId/group/:groupId");
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
            tags: ["Group"],
            summary: "Delete a group by ID",
            description: "Soft deletes a group and its associated users for the specified company",
          },
          params: t.Object({
            companyId: t.Number({ minimum: 1, error: "Company ID must be a positive number" }),
            groupId: t.Number({ minimum: 1, error: "Group ID must be a positive number" }),
          }),
          response: {
            200: t.Object({
              data: t.Ref("group"),
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

      // Restore a group by id from a company
      .patch(
        "/:groupId/restore",
        async ({ params: { companyId, groupId }, set, request }) => {
          try {
            const group = await GroupModel.restore(Number(groupId), Number(companyId));
            
            logger.info({ params: { companyId, groupId }, groupId: group.id, url: request.url }, "Group restored in PATCH /company/:companyId/group/:groupId/restore");

            return {
              data: group,
            };
          } catch (error: any) {
            if (error.cause?.type === "not_found") {
              logger.warn({ error, params: { companyId, groupId }, url: request.url }, "Group or company not found in PATCH /company/:companyId/group/:groupId/restore");
              set.status = 404;
              return {
                error: {
                  code: 404,
                  message: error.message,
                },
              };
            }

            if (error.cause?.type === "not_deleted") {
              logger.warn({ error, params: { companyId, groupId }, url: request.url }, "Group not deleted in PATCH /company/:companyId/group/:groupId/restore");
              set.status = 400;
              return {
                error: {
                  code: 400,
                  message: error.message,
                },
              };
            }

            if (error.cause?.type === "deleted") {
              logger.warn({ error, params: { companyId, groupId }, url: request.url }, "Company deleted in PATCH /company/:companyId/group/:groupId/restore");
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
            tags: ["Group"],
            summary: "Restore a group by ID",
            description: "Restores a previously soft-deleted group for the specified company",
          },
          params: t.Object({
            companyId: t.Number({ minimum: 1, error: "Company ID must be a positive number" }),
            groupId: t.Number({ minimum: 1, error: "Group ID must be a positive number" }),
          }),
          response: {
            200: t.Object({
              data: t.Ref("group"),
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
