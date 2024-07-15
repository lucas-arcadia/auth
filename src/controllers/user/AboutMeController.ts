import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { AboutMe } from "../../models/user/AboutMe";

export default class AboutMeController {
  constructor(readonly server: Elysia) {
    server
      .derive(async ({ headers }) => {
        try {
          const auth = headers["authorization"];
          if (!auth) return { tokenPayload: null };

          const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
          if (!token) return { tokenPayload: null };

          return { tokenPayload: await jwt.verify(token) };
        } catch (error) {
          return { tokenPayload: null };
        }
      })

      .get(
        "/user/aboutme",
        async ({ query: { companyId, depth }, set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            set.status = 200;
            return await AboutMe({ tokenPayload, companyId, depth });
          } catch (error: any) {
            if (error.message.startsWith("Unauthorized")) set.status = 401;
            else if (error.message.startsWith("Forbidden")) set.status = 403;
            else if (error.message.includes("not found")) set.status = 404;
            else set.status = 500;

            return {
              message: error.message,
            };
          }
        },
        {
          type: "application/json",

          detail: {
            tags: ["Usuários"],
            summary: "Sobre mim",
            description: "Obtém as informações do seu usuário.",
            operationId: "AboutMe",
          },

          headers: t.Object({
            authorization: t.String({
              description: "Token authorization",
              error: JSON.stringify({ message: "Token is required" }),
            }),
          }),

          query: t.Object({
            companyId: t.Optional(t.String({ description: "Company Id" })),
            depth: t.Optional(t.String({ description: "If present, search for related subdocuments" })),
          }),

          response: {
            200: t.Object({
              id: t.String(),
              name: t.String(),
              email: t.String(),
              phone: t.String(),
              attempts: t.Number(),
              active: t.Boolean(),
              companyId: t.String(),
              ruleId: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
              Company: t.Optional(t.Any()),
              Rule: t.Optional(t.Any()),
            }),
            401: t.Object({ message: t.String() }, { description: "Unauthorized" }),
            403: t.Object({ message: t.String() }, { description: "Forbidden" }),
            404: t.Object({ message: t.String() }, { description: "Not found" }),
            500: t.Object({ message: t.String() }, { description: "Server error" }),
          },
        }
      );
  }
}
