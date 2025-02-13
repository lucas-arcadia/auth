import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { AboutMe } from "../../models/user/AboutMe";
import { ElysiaHeader } from "../common/common";

export default class AboutMeController {
  constructor(readonly server: Elysia) {
    server
      .derive(({ request }) => {
        const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "";
        return { ip: clientIp };
      })

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
        async ({ ip, query: { depth }, set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            set.status = 200;
            return await AboutMe({ tokenPayload, ip, depth });
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
          detail: {
            tags: ["Users"],
            summary: "About me",
            description: "Get your user information.",
            operationId: "AboutMe",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          query: t.Object({
            depth: t.Optional(t.String({ description: "If present, search for related subdocuments" })),
          }),

          response: {
            200: t.Object(
              {
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
              },
              { description: "Success" }
            ),
            401: t.Object({ message: t.String() }, { description: "Unauthorized" }),
            403: t.Object({ message: t.String() }, { description: "Forbidden" }),
            404: t.Object({ message: t.String() }, { description: "Not found" }),
            500: t.Object({ message: t.String() }, { description: "Server error" }),
          },
        }
      );
  }
}
