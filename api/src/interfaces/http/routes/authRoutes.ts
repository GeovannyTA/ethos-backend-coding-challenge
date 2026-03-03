import { Elysia } from "elysia";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AuthenticateUser } from "../../../application/use-cases/AuthenticateUser";

// Ruta para autenticar un usuario (errores manejados por el handler global)
export const authRouter = (deps: { userRepository: UserRepository }) =>
  new Elysia().post("/auth/login", async ({ body }) => {
    const useCase = new AuthenticateUser(deps.userRepository);
    return await useCase.execute(body.email, body.password);
  });
