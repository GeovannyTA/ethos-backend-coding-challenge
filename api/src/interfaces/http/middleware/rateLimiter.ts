import { Elysia } from "elysia";

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

  return new Elysia().onBeforeHandle(
    { as: "global" },
    async ({ request, set }) => {
      const identifier = getIdentifier(request);
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

function getIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "unknown";
}
