import Elysia, { t } from "elysia";
import jwt from "../../libs/jwt";
import { UpdateUser } from "../../models/user/UpdateUser";
import { IUpdateUser } from "../../models/user/UserInterface";
import { ElysiaHeader, ElysiaQuery, ElysiaResponse } from "../common/common";

export default class UpdateUserController {
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
        "/user/:id",
        async ({ body, query: { companyId }, params: { id }, set, tokenPayload }) => {
          console.log(body, id);
          try {
            if (!tokenPayload) throw new Error("Unauthorized");

            const { companyId, name, phone, active, attempts, ruleId } = body as IUpdateUser;

            set.status = 200;
            return await UpdateUser({ tokenPayload, id, companyId, name, phone, active, attempts, ruleId });
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
            summary: "Update User",
            description: "If the companyId is provided, a user from another company can be updated as long as the requester is a member of the Administrator or Manager group.",
            operationId: "UpdateUser",
          },

          headers: t.Object({
            authorization: ElysiaHeader.authorization,
          }),

          query: t.Object({
            companyId: ElysiaQuery.companyId,
          }),

          params: t.Object({
            id: t.String({ description: "User ID", error: JSON.stringify({ message: "The user ID is required" }) }),
          }),

          body: t.Object({
            companyId: t.Optional(t.String()),
            name: t.Optional(t.String()),
            phone: t.Optional(t.String()),
            active: t.Optional(t.Boolean()),
            attempts: t.Optional(t.Number()),
            ruleId: t.Optional(t.String()),
          }),

          response: {
            200: t.Object(
              {
                id: t.String(),
                name: t.String(),
                email: t.String(),
                phone: t.String(),
                active: t.Boolean(),
                attempts: t.Number(),
                companyId: t.String(),
                ruleId: t.String(),
                createdAt: t.Date(),
                updatedAt: t.Date(),
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
