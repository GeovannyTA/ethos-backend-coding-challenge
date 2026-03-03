import { verifyToken } from "../../../infrastructure/auth/jwt";
import { UnauthorizedError } from "../../../domain/errors/AppError";
import { Elysia } from "elysia";

export const authMiddleware = new Elysia().derive(
  { as: "scoped" },
  async ({ request }) => {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      throw new UnauthorizedError("Missing authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    try {
      const payload = await verifyToken(token);
      return { user: payload as { userId: string } };
    } catch {
      throw new UnauthorizedError("Invalid token");
    }
  }
);
