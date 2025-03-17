import { Context, Elysia } from "elysia";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode("your-secret-key-here");

export const authMiddleware = new Elysia().derive(
  async ({ request, set }: Context) => {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      set.status = 401;
      return { message: "Authentication required" };
    }

    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      return { user: payload };
    } catch (error) {
      set.status = 403;
      return { message: "Invalid or expired token" };
    }
  }
);
