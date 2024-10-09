import Elysia, { t } from "elysia";
import { ip } from "elysia-ip";
import jwt from "../../libs/jwt";
import { AboutMe } from "../../models/user/AboutMe";
import { ElysiaHeader, ElysiaQuery, ElysiaResponse } from "../common/common";

export default class AboutMeController {
  constructor(readonly server: Elysia) {
    server
      .use(ip())
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
<<<<<<< Updated upstream
        async ({ ip, query: { companyId, depth }, set, tokenPayload }) => {
=======
        async ({ query: { depth }, set, tokenPayload }) => {
>>>>>>> Stashed changes
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            set.status = 200;
<<<<<<< Updated upstream
            return await AboutMe({ tokenPayload, ip, companyId, depth });
=======
            return await AboutMe({ tokenPayload, depth });
>>>>>>> Stashed changes
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
            tags: ["Users"],
            summary: "About me",
<<<<<<< Updated upstream
            description: "Get information about your user",
=======
            description: "Get your user information.",
>>>>>>> Stashed changes
            operationId: "AboutMe",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          query: t.Object({
<<<<<<< Updated upstream
            companyId: ElysiaQuery.companyId,
            depth: ElysiaQuery.depth,
=======
            depth: t.Optional(t.String({ description: "If present, search for related subdocuments" })),
>>>>>>> Stashed changes
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
            }, { description: "Success" }),
<<<<<<< Updated upstream
            401: ElysiaResponse[401],
            403: ElysiaResponse[403],
            404: ElysiaResponse[404],
            500: ElysiaResponse[500],
=======
            401: t.Object({ message: t.String() }, { description: "Unauthorized" }),
            403: t.Object({ message: t.String() }, { description: "Forbidden" }),
            404: t.Object({ message: t.String() }, { description: "Not found" }),
            500: t.Object({ message: t.String() }, { description: "Server error" }),
>>>>>>> Stashed changes
          },
        }
      );
  }
}
