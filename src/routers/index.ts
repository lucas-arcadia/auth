import { Elysia } from "elysia";
import { authController } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

type User = {
  id: string;
  name: string;
  email: string;
  companyId: string;
  permissions: string[];
};

type Body = {
  user: User;
};

const routes = new Elysia()
  // Apply auth middleware globally but only for derivation
  .use(authMiddleware)
  // Group auth routes
  .group("/api/auth", (app) =>
    app
      .use(authController)
      // Protected routes
      .guard(
        {
          beforeHandle: ({ body, set }) => {
            const { user } = body as Body;
            if (!user) {
              set.status = 401;
              return { message: "Authentication required" };
            }
          },
        },
        (app) =>
          app.get("/profile", ({ body }) => {
            const { user } = body as Body;
            return {
              message: `Hello ${user?.email}`,
            };
          })
      )
  );

// Export as a function that takes the main app instance
export default function setupRoutes(app: Elysia) {
  return app.use(routes);
}
