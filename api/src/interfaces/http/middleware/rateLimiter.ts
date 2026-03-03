import { Elysia } from "elysia";
import { verifyToken } from "../../../infrastructure/auth/jwt";

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

/**
 * Rate Limiter middleware - Implementación sin paquetes externos.
 * Almacena peticiones en memoria por IP usando estructuras nativas (Map).
 *
 * @param maxRequests - Número máximo de peticiones por ventana (ej: 100)
 * @param windowMs - Ventana de tiempo en milisegundos (ej: 60_000 = 1 min, 900_000 = 15 min)
 */
export function rateLimiter(maxRequests: number, windowMs: number) {
  const store = new Map<string, RateLimitEntry>();
  console.log("Store: ", store);

  return new Elysia().onBeforeHandle(
    { as: "global" },
    async ({ request, set }) => {
      const identifier = await getIdentifier(request);
      const now = Date.now();

      let entry = store.get(identifier);

      // Si la ventana expiró, reiniciar
      if (!entry || now - entry.windowStart >= windowMs) {
        entry = { count: 0, windowStart: now };
        store.set(identifier, entry);
      }

      entry.count++;

      if (entry.count > maxRequests) {
        set.status = 429;
        return { error: "Too Many Requests", message: "Has excedido el límite de peticiones" };
      }
    }
  );
}

async function getIdentifier(request: Request): Promise<string> {
  // Si hay token válido, usar userId
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      const payload = await verifyToken(token) as { userId?: string };
      if (payload?.userId) {
        console.log("User ID: ", payload.userId);
        return `user:${payload.userId}`;
      }
    } catch {
      // Token inválido, continuar con IP
    }
  }

  // Sin token o inválido: usar IP
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
