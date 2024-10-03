import { t } from "elysia";

export const ElysiaHeader = {
  authorization: t.String({
    description: "Authorization token",
    error: JSON.stringify({ message: "The token is required" }),
  }),
};

export const ElysiaQuery = {
  companyId: t.Optional(t.String({ description: "Company ID." })),
  depth: t.Optional(t.String({ description: "If present, brings result with depth." })),
  limit: t.Optional(t.String({ description: "Records per page. The default is up to 10 records." })),
  page: t.Optional(t.String({ description: "Page to be returned." })),
};

export const ElysiaResponse = {
  401: t.Object({ message: t.String() }, { description: "Unauthorized" }),
  403: t.Object({ message: t.String() }, { description: "Forbidden" }),
  404: t.Object({ message: t.String() }, { description: "Not Found" }),
  409: t.Object({ message: t.String() }, { description: "Conflict"}),
  500: t.Object({ message: t.String() }, { description: "Server Error" }),
};

export const ElysiaPaginationReturn = {
  totalDocs: t.Number({ description: "Total number of records found." }),
  limit: t.Number({ description: "Records per page limit." }),
  totalPages: t.Number({ description: "Total number of pages found." }),
  page: t.Number({ description: "Current page." }),
  hasPrevPage: t.Boolean({ description: "Indicates if there is a previous page." }),
  hasNextPage: t.Boolean({ description: "Indicates if there is a next page." }),
  prevPage: t.Nullable(t.Number({ description: "Previous page number." })),
  nextPage: t.Nullable(t.Number({ description: "Next page number." })),
};
