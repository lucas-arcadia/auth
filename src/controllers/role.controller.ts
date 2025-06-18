// /src/controllers/group.controller.ts

import { Elysia, t } from "elysia";
import { RoleModel } from "../models/role.model";
import { authPlugin } from "../plugins/authPlugin";

export const roleController = (app: Elysia) => {
  return app.group("/company/:companyId/roles", (app) => {
    app
      .use(authPlugin)
      .model({
        role: t.Object({
          id: t.String(),
          companyId: t.String(),
          name: t.String(),
          description: t.String(),
          roles: t.Nullable(t.Record(t.String(), t.Boolean())),
          notes: t.Nullable(t.Record(t.String(), t.String())),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          deletedAt: t.Nullable(t.Date()),
        }),

        error: t.Object({
          code: t.Number(),
          message: t.String(),
        }),
      })

      // Create a new role
      .post(
        "/create",
        async ({ auth, body: { name, description, roles, notes }, params: { companyId }, set }) => {
          try {
            await auth({ requiredPermission: "create_role" });
            const result = await RoleModel.create(companyId, name, description, roles, notes);
            set.status = 201;
            return result;
          } catch (error: any) {
            throw error;
          }
        },
        {
          detail: {
            tags: ["Role"],
            summary: "Create a new role",
            description: "Creates a new role for the specified company. Requires a valid Bearer token in the Authorization header.",
            security: [{ bearerAuth: [] }],
          },
          body: t.Object({
            name: t.String(),
            description: t.String(),
            roles: t.Record(t.String(), t.Boolean()),
            notes: t.Record(t.String(), t.String()),
          }),
          params: t.Object({
            companyId: t.String(),
          }),
          response: {
            201: t.Ref("role"),
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

      // Get all roles from a company
      .get(
        "/list",
        async ({ auth, query: { offset = 0, limit = 10, search = "", sort = "id", order = "asc" }, params: { companyId }, set }) => {
          try {
            await auth({ requiredPermission: "read_role" });

            const result = await RoleModel.getAll(companyId, offset, limit, search, sort, order);

            return {
              ...result,
              rows: result.rows.map(role => ({
                ...role,
                roles: role.roles as Record<string, boolean> | null,
                notes: role.notes as Record<string, string> | null
              }))
            };
          } catch (error: any) {
            throw error;
          }
        },
        {
          detail: {
            tags: ["Role"],
            summary: "Get all roles from a company",
            description: "Retrieves all roles from the specified company. Requires a valid Bearer token in the Authorization header.",
            security: [{ bearerAuth: [] }],
          },
          params: t.Object({
            companyId: t.String(),
          }),
          query: t.Object({
            offset: t.Optional(t.Number({ default: 0, minimum: 0 })),
            limit: t.Optional(t.Number({ default: 10, minimum: 1 })),
            search: t.Optional(t.String()),
            sort: t.Optional(t.String({ enum: ["id", "name", "description"] })),
            order: t.Optional(t.String({ enum: ["asc", "desc"] })),
          }),
          response: {
            200: t.Object({
              total: t.Number(),
              totalNotFiltered: t.Number(),
              rows: t.Array(t.Ref("role")),
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
            500: t.Object({
              error: t.Ref("error"),
            }),
          },
        }
      );

    // Get a group by id from a company
    // .get(
    //   "/:groupId",
    //   async ({ params: { companyId, groupId }, set, request }) => {
    //     try {
    //       const group = await GroupModel.getById(Number(groupId), Number(companyId));

    //       return {
    //         data: group,
    //       };
    //     } catch (error: any) {
    //       if (error.cause?.type === "not_found") {
    //         set.status = 404;
    //         return {
    //           error: {
    //             code: 404,
    //             message: error.message,
    //           },
    //         };
    //       }

    //       if (error.cause?.type === "deleted") {
    //         set.status = 410;
    //         return {
    //           error: {
    //             code: 410,
    //             message: error.message,
    //           },
    //         };
    //       }

    //       throw error;
    //     }
    //   },
    //   {
    //     detail: {
    //       tags: ["Group"],
    //       summary: "Get a group by ID",
    //       description: "Retrieves a group by its ID for the specified company",
    //     },
    //     params: t.Object({
    //       companyId: t.Number({ minimum: 1, error: "Company ID must be a positive number" }),
    //       groupId: t.Number({ minimum: 1, error: "Group ID must be a positive number" }),
    //     }),
    //     response: {
    //       200: t.Object({
    //         data: t.Ref("group"),
    //       }),
    //       404: t.Object({
    //         error: t.Ref("error"),
    //       }),
    //       410: t.Object({
    //         error: t.Ref("error"),
    //       }),
    //       500: t.Object({
    //         error: t.Ref("error"),
    //       }),
    //     },
    //   }
    // )

    return app;
  });
};
