import { UserRepository } from "../../domain/repositories/UserRepository";
import { NotFoundError, UnauthorizedError } from "../../domain/errors/AppError";
import argon2 from "argon2";
import { SignJWT } from "jose";

export class AuthenticateUser {
  // Constructor para inicializar el repositorio de usuarios
  constructor(private userRepo: UserRepository) {}

  async execute(email: string, password: string) {
    // Verificar si el usuario existe
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Verificar si la contraseña es correcta
    const isPasswordCorrect = await argon2.verify(user.password, password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedError("Invalid password");
    }

    // Codificar el secreto para generar el token
    const secret = new TextEncoder().encode(process.env.SECRET_RAW!);

    // Generar el token
    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secret);

    // Si la contraseña es correcta, devolver el usuario
    return { token };
  }
}
