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
        async ({ ip, query: { companyId, depth }, set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            set.status = 200;
            return await AboutMe({ tokenPayload, ip, companyId, depth });
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
            description: "Get information about your user",
            operationId: "AboutMe",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          query: t.Object({
            companyId: ElysiaQuery.companyId,
            depth: ElysiaQuery.depth,
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
            401: ElysiaResponse[401],
            403: ElysiaResponse[403],
            404: ElysiaResponse[404],
            500: ElysiaResponse[500],
          },
        }
      );
  }
}
