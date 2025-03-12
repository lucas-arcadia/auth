import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { UpdadeContact } from "../../models/contact/UpdateContact";
import { IUpdateContact } from "../../models/contact/ContactInterfaces";
import { ElysiaHeader, ElysiaResponse } from "../common/common";

export default class UpdadeContactController {
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

          const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : null;
          if (!bearer) return { tokenPayload: null };

          return {
            tokenPayload: await jwt.verify(bearer),
          };
        } catch (error) {
          return { tokenPayload: null };
        }
      })

      .patch(
        "/contact",
        async ({ tokenPayload, ip, body, set }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");
            const { id, name, email, phone, active } = body as IUpdateContact;
            return await UpdadeContact({ tokenPayload, ip, id, name, email, phone, active });
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
            tags: ["Contact"],
            summary: "Update Contact",
            description: "Update the data of a contact",
            operationId: "UpdateContact",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          body: t.Object({
            id: t.String({ description: "Contact ID" }),
            name: t.Optional(t.String()),
            email: t.Optional(t.String()),
            phone: t.Optional(t.String()),
            active: t.Optional(t.Boolean()),
          }),

          response: {
            200: t.Object(
              {
                id: t.String(),
                name: t.String(),
                email: t.String(),
                phone: t.String(),
                active: t.Boolean(),
              },
              { description: "Success" }
            ),
            401: ElysiaResponse[401],
            403: ElysiaResponse[403],
            404: ElysiaResponse[404],
            500: ElysiaResponse[500],
          },
        }
      );
  }
}
