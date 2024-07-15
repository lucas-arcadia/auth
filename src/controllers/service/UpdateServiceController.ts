import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { UpdateService } from "../../models/service/UpdateService";
import { IUpdateService } from "../../models/service/ServiceInterfaces";
import { ElysiaHeader, ElysiaQuery, ElysiaResponse } from "../common/common";

export default class UpdadeServiceController {
  constructor(readonly server: Elysia) {
    server
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
        "/service/:id",
        async ({ body, query: { depth }, params: { id }, set, tokenPayload }) => {
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            const { name, description, active, Company, Police } = body as IUpdateService;

            set.status = 200;
            return await UpdateService({ tokenPayload, id, name, description, active, Company, Police, depth });
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
            tags: ["Serviços"],
            summary: "Atualizar serviço",
            description: "Atualiza os dados de um serviço",
            operationId: "UpdateService",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          query: t.Object({
            depth: ElysiaQuery.depth,
          }),

          params: t.Object({
            id: t.String({ description: "ID do serviço" }),
          }),

          body: t.Object({
            name: t.Optional(t.String()),
            description: t.Optional(t.String()),
            active: t.Optional(t.Boolean()),
            Company: t.Optional(t.Array(t.Object({ id: t.String() }))),
            Police: t.Optional(t.Array(t.Object({ id: t.String() }))),
          }),

          response: {
            200: t.Object({
              id: t.String(),
              name: t.String(),
              description: t.String(),
              active: t.Boolean(),
              imutable: t.Boolean(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
              Company: t.Optional(t.Any()),
              Police: t.Optional(t.Any()),
            }),
            401: ElysiaResponse[401],
            403: ElysiaResponse[403],
            404: ElysiaResponse[404],
            500: ElysiaResponse[500],
          },
        }
      );
  }
}
