import { Elysia } from "elysia";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AuthenticateUser } from "../../../application/use-cases/AuthenticateUser";

// Ruta para autenticar un usuario
export const authRouter = (deps: { userRepository: UserRepository }) =>
  new Elysia().post("/auth/login", async ({ body, set }) => {
    try {
      // Crear una instancia del caso de uso de autenticación
      const useCase = new AuthenticateUser(deps.userRepository);
      return await useCase.execute(body.email, body.password);
    } catch (error) {
      set.status = 401;
      return { error: "Invalid credentials" };
    }
  });
