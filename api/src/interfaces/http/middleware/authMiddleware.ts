import { verifyToken } from "../../../infrastructure/auth/jwt";
import { Elysia } from "elysia";

export const authMiddleware = new Elysia().onBeforeHandle(
    // Asignar el middleware a un scope para que se aplique a las rutas de la clase
  { as: "scoped" }, 
  async ({ request }) => {
    // Obtener el token de la cabecera de la solicitud
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      // Si no hay token, lanzar un error de autorización
      throw new Error("Unauthorized");
    }

    // Verificar si el token es válido
    const token = authHeader.replace("Bearer ", "");
    try {
      await verifyToken(token);
    } catch {
      throw new Error("Invalid token");
    }
  }
);
