import { Elysia } from "elysia";
import { CreateUser } from "../../../application/use-cases/CreateUser";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { authMiddleware } from "../middleware/authMiddleware";
import { GetUsers } from "../../../application/use-cases/GetUsers";
import { UpdateUser } from "../../../application/use-cases/UpdateUser";
import { DeleteUser } from "../../../application/use-cases/DeleteUser";

export const userRouter = (deps: { userRepository: UserRepository }) =>
  new Elysia()
    .use(authMiddleware)
    .get("/users", async () => {
      const useCase = new GetUsers(deps.userRepository);
      return await useCase.execute();
    })
    .put("/users/:id", async ({ body, params }) => {
      const useCase = new UpdateUser(deps.userRepository);
      return await useCase.execute(params.id, body.email, body.password, body.first_name, body.last_name);
    })
    .delete("/users/:id", async ({ params }) => {
      const useCase = new DeleteUser(deps.userRepository);
      await useCase.execute(params.id);
      return { message: "User deleted successfully" };
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
    