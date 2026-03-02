// infrastructure/auth/JwtService.ts
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.SECRET_RAW);

// Verificar si el token es válido
export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  // Retornar el payload del token
  return payload;
}