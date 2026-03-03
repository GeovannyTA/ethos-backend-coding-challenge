import { Elysia } from "elysia";
import { authMiddleware } from "../middleware/authMiddleware";
import { GetProjects } from "../../../application/use-cases/GetProjects";
import { ProjectRepository } from "../../../domain/repositories/ProjectRepository";
import { CreateProject } from "../../../application/use-cases/CreateProject";

export const projectRouter = (deps: { projectRepository: ProjectRepository }) =>
  new Elysia()
    .use(authMiddleware)
    .get("/projects", async () => {
      const useCase = new GetProjects(deps.projectRepository);
      return await useCase.execute();
    })
    .post("/projects", async ({ body, user }) => {
      const useCase = new CreateProject(deps.projectRepository);

      return await useCase.execute(
        body.name,
        body.description,
        String(user.userId),
      );
    });
    