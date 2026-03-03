import { Elysia } from "elysia";
import { CreateUser } from "../../../application/use-cases/CreateUser";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { authMiddleware } from "../middleware/authMiddleware";
import { GetUsers } from "../../../application/use-cases/GetUsers";

export const userRouter = (deps: { userRepository: UserRepository }) =>
  new Elysia()
    .use(authMiddleware)
    .get("/users", async () => {
      const useCase = new GetUsers(deps.userRepository);
      return await useCase.execute();
    })
    .post("/users", async ({ body }) => {
      const useCase = new CreateUser(deps.userRepository);

      return await useCase.execute(
        body.email,
        body.password,
        body.first_name,
        body.last_name,
      );
    });
    