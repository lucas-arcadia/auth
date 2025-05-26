// /src/controllers/company.controller.ts

import { Elysia, t } from "elysia";
import { CompanyModel } from "../models/company.model";
import logger from "../utils/logger";
import { validateCompanyFields } from "../utils/validation";

export const companyController = (app: Elysia) => {
  return app.group("/company", (app) => {
    app
      .model({
        company: t.Object({
          id: t.Number(),
          name: t.String(),
          surname: t.String(),
          ein: t.String(),
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

                // Personaliza mensagens para campos conhecidos
                if (field === "name" && message.includes("minLength")) {
                  message = "Name must not be empty";
                } else if (field === "surname" && message.includes("minLength")) {
                  message = "Surname must not be empty";
                } else if (field === "ein" && message.includes("minLength")) {
                  message = "EIN must not be empty";
                }
                validationErrors.push({ field, message });
              }
            }
          } else {
            // Fallback caso error.all não esteja disponível
            validationErrors.push({ field: "unknown", message: error.message || "Validation failed" });
          }

          logger.warn({ error, url: request.url }, "Validation error");

          set.status = 400;
          return {
            error: {
              code: 400,
              message: "Validation failed",
              details: validationErrors.length > 0 ? validationErrors : undefined,
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

      // Create a new company
      .post(
        "/",
        async ({ body: { name, surname, ein }, set, request }) => {
          try {
            const errors = validateCompanyFields(name, surname, ein);
            if (errors.length > 0) {
              logger.warn({ body: { name, surname, ein }, errors, url: request.url }, "Additional validation failed for POST /company");
              set.status = 400;
              return {
                error: {
                  code: 400,
                  message: "Validation failed",
                  details: errors,
                },
              };
            }
            
            const company = await CompanyModel.create(name, surname, ein);
            logger.info({ body: { name, surname, ein }, companyId: company.id, url: request.url }, "Company created in POST /company");
            set.status = 201;
            return {
              data: company,
            };
          } catch (error: any) {
            if (error.cause?.type === "duplicate_ein") {
              logger.warn({ error, body: { name, surname, ein }, url: request.url }, "Duplicate EIN in POST /company");
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
            tags: ["Company"],
            summary: "Create a new company",
            description: "Creates a new company with the provided name, surname, and ein",
          },
          body: t.Object({
            name: t.String({ minLength: 1, error: "Name must not be empty" }),
            surname: t.String({ minLength: 1, error: "Surname must not be empty" }),
            ein: t.String({ minLength: 14, error: "EIN must not be empty" }),
          }),
          response: {
            201: t.Object({
              data: t.Ref("company"),
            }),
            400: t.Object({
              error: t.Ref("error"),
            }),
            409: t.Object({
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
        "/",
        async ({ query: { page = 1, pageSize = 10, includeDeleted = false }, set, request }) => {
          try {
            const result = await CompanyModel.getAll(page, pageSize, includeDeleted);
            logger.info({ query: { page, pageSize, includeDeleted }, total: result.total, url: request.url }, "Companies fetched in GET /company");
            return {
              data: result.companies,
              meta: {
                total: result.total,
                page: result.page,
                pageSize: result.pageSize,
              },
            };
          } catch (error: any) {
            if (error.cause?.type === "invalid_params") {
              logger.warn({ error, query: { page, pageSize, includeDeleted }, url: request.url }, "Invalid parameters in GET /company");
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
          },
          query: t.Object({
            page: t.Optional(t.Number({ default: 1, minimum: 1 })),
            pageSize: t.Optional(t.Number({ default: 10, minimum: 1, maximum: 100 })),
            includeDeleted: t.Optional(t.Boolean({ default: false })),
          }),
          response: {
            200: t.Object({
              data: t.Array(t.Ref("company")),
              meta: t.Object({
                total: t.Number(),
                page: t.Number(),
                pageSize: t.Number(),
              }),
            }),
            400: t.Object({
              error: t.Ref("error"),
            }),
            500: t.Object({
              error: t.Ref("error"),
            }),
          },
        }
      )

      // Get a company by id
      .get(
        "/:companyId",
        async ({ params: { companyId }, set, request }) => {
          try {
            const company = await CompanyModel.getById(Number(companyId));
            logger.info({ params: { companyId }, companyId: company.id, url: request.url }, "Company fetched in GET /company/:id");
            return {
              data: company,
            };
          } catch (error: any) {
            if (error.cause?.type === "not_found") {
              logger.warn({ error, params: { companyId }, url: request.url }, "Company not found in GET /company/:id");
              set.status = 404;
              return {
                error: {
                  code: 404,
                  message: error.message,
                },
              };
            }
            if (error.cause?.type === "deleted") {
              logger.warn({ error, params: { companyId }, url: request.url }, "Company deleted in GET /company/:id");
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
            tags: ["Company"],
            summary: "Get a company by ID",
            description: "Retrieves a company by its ID",
          },
          params: t.Object({
            companyId: t.Number({ minimum: 1 }),
          }),
          response: {
            200: t.Object({
              data: t.Ref("company"),
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

      // Get a company by ein
      .get(
        "/ein/:ein",
        async ({ params: { ein }, set, request }) => {
          try {
            const company = await CompanyModel.getByEin(ein);
            logger.info({ params: { ein }, companyId: company.id, url: request.url }, "Company fetched in GET /company/ein/:ein");
            return {
              data: company,
            };
          } catch (error: any) {
            if (error.cause?.type === "not_found") {
              logger.warn({ error, params: { ein }, url: request.url }, "Company not found in GET /company/ein/:ein");
              set.status = 404;
              return {
                error: {
                  code: 404,
                  message: error.message,
                },
              };
            }
            if (error.cause?.type === "deleted") {
              logger.warn({ error, params: { ein }, url: request.url }, "Company deleted in GET /company/ein/:ein");
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
            tags: ["Company"],
            summary: "Get a company by EIN",
            description: "Retrieves a company by its EIN",
          },
          params: t.Object({
            ein: t.String({ minLength: 1 }),
          }),
          response: {
            200: t.Object({
              data: t.Ref("company"),
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

      // Update a company by id
      .patch(
        "/:companyId",
        async ({ params: { companyId }, body: { name, surname }, set, request }) => {
          try {
            const errors = validateCompanyFields(name, surname);
            if (errors.length > 0) {
              logger.warn({ params: { companyId }, body: { name, surname }, errors, url: request.url }, "Additional validation failed for PATCH /company/:id");
              set.status = 400;
              return {
                error: {
                  code: 400,
                  message: "Validation failed",
                  details: errors,
                },
              };
            }
            const { company, updated } = await CompanyModel.update(Number(companyId), name, surname);
            set.status = updated ? 200 : 204;
            logger.info({ params: { companyId }, body: { name, surname }, updated, companyId: company.id, url: request.url }, `Company ${updated ? "updated" : "unchanged"} in PATCH /company/:id`);
            return {
              data: company,
            };
          } catch (error: any) {
            if (error.cause?.type === "not_found") {
              logger.warn({ error, params: { companyId }, body: { name, surname }, url: request.url }, "Company not found in PATCH /company/:id");
              set.status = 404;
              return {
                error: {
                  code: 404,
                  message: error.message,
                },
              };
            }
            if (error.cause?.type === "deleted") {
              logger.warn({ error, params: { companyId }, body: { name, surname }, url: request.url }, "Company deleted in PATCH /company/:id");
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
            tags: ["Company"],
            summary: "Update a company by ID",
            description: "Updates the name and surname of a company identified by its ID",
          },
          params: t.Object({
            companyId: t.Number({ minimum: 1 }),
          }),
          body: t.Object({
            name: t.String({ minLength: 1, error: "Name must not be empty" }),
            surname: t.String({ minLength: 1, error: "Surname must not be empty" }),
          }),

          response: {
            200: t.Object({
              data: t.Ref("company"),
            }),
            204: t.Object({
              data: t.Ref("company"),
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

      // Delete a company by id
      .delete(
        "/:companyId",
        async ({ params: { companyId }, set, request }) => {
          try {
            const company = await CompanyModel.softDelete(Number(companyId));
            set.status = 200;
            logger.info({ params: { companyId }, companyId: company.id, url: request.url }, "Company deleted in DELETE /company/:id");
            return {
              data: company,
            };
          } catch (error: any) {
            if (error.cause?.type === "not_found") {
              logger.warn({ error, params: { companyId }, url: request.url }, "Company not found in DELETE /company/:id");
              set.status = 404;
              return {
                error: {
                  code: 404,
                  message: error.message,
                },
              };
            }
            if (error.cause?.type === "deleted") {
              logger.warn({ error, params: { companyId }, url: request.url }, "Company already deleted in DELETE /company/:id");
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
            tags: ["Company"],
            summary: "Delete a company by ID",
            description: "Soft deletes a company and its associated groups and users",
          },
          params: t.Object({
            companyId: t.Number({ minimum: 1 }),
          }),
          response: {
            200: t.Object({
              data: t.Ref("company"),
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

      // Restore a company by id
      .patch(
        "/:companyId/restore",
        async ({ params: { companyId }, set, request }) => {
          try {
            const company = await CompanyModel.restore(Number(companyId));
            set.status = 200;
            logger.info({ params: { companyId }, companyId: company.id, url: request.url }, "Company restored in PATCH /company/:id/restore");
            return {
              data: company,
            };
          } catch (error: any) {
            if (error.cause?.type === "not_found") {
              logger.warn({ error, params: { companyId }, url: request.url }, "Company not found in PATCH /company/:id/restore");
              set.status = 404;
              return {
                error: {
                  code: 404,
                  message: error.message,
                },
              };
            }
            if (error.cause?.type === "not_deleted") {
              logger.warn({ error, params: { companyId }, url: request.url }, "Company not deleted in PATCH /company/:id/restore");
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
            summary: "Restore a company by ID",
            description: "Restores a previously soft-deleted company",
          },
          params: t.Object({
            companyId: t.Number({ minimum: 1 }),
          }),
          response: {
            200: t.Object({
              data: t.Ref("company"),
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
      );

    return app;
  });
};
