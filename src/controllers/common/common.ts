import { t } from "elysia";

export const ElysiaHeader = {
  authorization: t.String({
    description: "Token de autorização",
    error: JSON.stringify({ message: "O Token é necessário" }),
  }),
};

export const ElysiaQuery = {
  companyId: t.Optional(t.String({ description: "ID da empresa." })),
  depth: t.Optional(t.String({ description: "Se presente, traz resultado com profundidade." })),
  limit: t.Optional(t.String({ description: "Registros por página. O padrão são até 10 registros." })),
  page: t.Optional(t.String({ description: "Página para ser retornada." })),
};

export const ElysiaResponse = {
  401: t.Object({ message: t.String() }, { description: "Unauthorized" }),
  403: t.Object({ message: t.String() }, { description: "Forbidden" }),
  404: t.Object({ message: t.String() }, { description: "Not found" }),
  409: t.Object({ message: t.String() }, { description: "Conflict"}),
  500: t.Object({ message: t.String() }, { description: "Server error" }),
};

export const ElysiaPaginationReturn = {
  totalDocs: t.Number({ description: "Total de registos encontrados." }),
  limit: t.Number({ description: "Limit de registros por página." }),
  totalPages: t.Number({ description: "Total de página encontradas." }),
  page: t.Number({ description: "Página corrente." }),
  hasPrevPage: t.Boolean({ description: "Indica se há página anterior." }),
  hasNextPage: t.Boolean({ description: "Indica se há próxima página." }),
  prevPage: t.Nullable(t.Number({ description: "Número da página anterior." })),
  nextPage: t.Nullable(t.Number({ description: "Número da próxima página." })),
};
