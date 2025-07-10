// csi-auth-api/src/controllers/complaint.controller.ts

import { Elysia, t } from "elysia";
import { CompanyModel } from "../models/company.model";
import { authPlugin } from "../plugins/authPlugin";

export const companyController = (app: Elysia) => {
  return app.group("/company", (app) => {
    app
      .use(authPlugin)
      .model({
        company: t.Object({
          id: t.String(),
          name: t.String(),
          surname: t.String(),
          ein: t.String(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
          deletedAt: t.Nullable(t.Date()),
        }),

        error: t.Object({
          code: t.Number(),
          message: t.String(),
        }),
      })

      // Create a new company`
      .post(
        "/",
        async ({ auth, body: { name, surname, ein }, set }) => {
          try {
            await auth({ requiredPermission: "create_company" });

            const result = await CompanyModel.create(name, surname, ein);

            return result;
          } catch (error: any) {
            throw error;
          }
        },
        {
          detail: {
            tags: ["Company"],
            summary: "Create a new company",
            description: "Creates a new company",
            security: [{ bearerAuth: [] }],
          },
          body: t.Object({
            name: t.String({ minLength: 3, maxLength: 255 }),
            surname: t.String({ minLength: 3, maxLength: 255 }),
            ein: t.String({ minLength: 14, maxLength: 14 }),
          }),
          response: {
            201: t.Ref("company"),
            400: t.Object({
              error: t.Ref("error"),
            }),
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

      // Get all companies
      .get(
        "/list",
        async ({ auth, query: { offset = 0, limit = 10, search = "", sort = "name", order = "desc" }, set }) => {
          try {
            await auth({ requiredPermission: "read_company" });

            const result = await CompanyModel.list(offset, limit, search, sort, order);

            return result;
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
            tags: ["Company"],
            summary: "Get all companies",
            description: "Retrieves a paginated list of companies",
            security: [{ bearerAuth: [] }],
          },
          query: t.Object({
            offset: t.Optional(t.Number({ default: 0, minimum: 0 })),
            limit: t.Optional(t.Number({ default: 10, minimum: 1 })),
            search: t.Optional(t.String()),
            sort: t.Optional(t.String({ enum: ["id", "name", "surname", "ein"] })),
            order: t.Optional(t.String({ enum: ["asc", "desc"] })),
          }),
          response: {
            200: t.Object({
              total: t.Number(),
              totalNotFiltered: t.Number(),
              rows: t.Array(t.Ref("company")),
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
      )

      // Update a company
      .patch(
        "/:id",
        async ({ auth, params: { id }, body: { name, surname }, set }) => {
          try {
            // console.log("=== COMPANY UPDATE DEBUG ===");
            // console.log("URL:", request.url);
            // console.log("Method:", request.method);
            // console.log("Params ID:", id);
            // console.log("Body:", { name, surname });
            // console.log("Headers:", Object.fromEntries(request.headers.entries()));
            // console.log("==========================");

            await auth({ requiredPermission: "update_company" });

            const result = await CompanyModel.update(id, name, surname);

            return result.company;
          } catch (error: any) {
            if (error.cause?.type === "not_found") {
              set.status = 404;
              return {
                error: {
                  code: 404,
                  message: error.message,
                },
              };
            }

            throw error;
          }
        },
        {
          detail: {
            tags: ["Company"],
            summary: "Update a company",
            description: "Updates a company by ID",
            security: [{ bearerAuth: [] }],
          },
          params: t.Object({
            id: t.String(),
          }),
          body: t.Object({
            name: t.String(),
            surname: t.String(),
          }),
          response: {
            200: t.Ref("company"),
            401: t.Object({
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

      // Soft delete a company
      .delete(
        "/:id",
        async ({ auth, params: { id }, set }) => {
          try {
            await auth({ requiredPermission: "delete_company" });

            const result = await CompanyModel.delete(id);

            return result;
          } catch (error: any) {
            if (error.cause?.type === "not_found") {
              set.status = 404;
              return {
                error: {
                  code: 404,
                  message: error.message,
                },
              };
            }

            throw error;
          }
        },
        {
          detail: {
            tags: ["Company"],
            summary: "Delete a company",
            description: "Deletes a company by ID",
            security: [{ bearerAuth: [] }],
          },
          params: t.Object({
            id: t.String(),
          }),
          response: {
            200: t.Object({
              company: t.Ref("company"),
              deleted: t.Boolean(),
            }),
            401: t.Object({
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

      // Restore a company
      .patch(
        "/:id/restore",
        async ({ auth, params: { id }, set }) => {
          try {
            await auth({ requiredPermission: "restore_company" });

            const result = await CompanyModel.restore(id);

            return result;
          } catch (error: any) {
            if (error.cause?.type === "not_found") {
              set.status = 404;
              return {
                error: {
                  code: 404,
                  message: error.message,
                },
              };
            }

            throw error;
          }
        },
        {
          detail: {
            tags: ["Company"],
            summary: "Restore a company",
            description: "Restores a company by ID",
            security: [{ bearerAuth: [] }],
          },
          params: t.Object({
            id: t.String(),
          }),
          response: {
            200: t.Object({
              company: t.Ref("company"),
              restored: t.Boolean(),
            }),
            401: t.Object({
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

    return app;
  });
};
