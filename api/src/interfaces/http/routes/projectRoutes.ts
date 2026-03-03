import { Elysia } from "elysia";
import { authMiddleware } from "../middleware/authMiddleware";
import { GetProjects } from "../../../application/use-cases/GetProjects";
import { ProjectRepository } from "../../../domain/repositories/ProjectRepository";
import { CreateProject } from "../../../application/use-cases/CreateProject";
import { UpdateProject } from "../../../application/use-cases/UpdateProject";
import { DeleteProject } from "../../../application/use-cases/DeleteProject";

export const projectRouter = (deps: { projectRepository: ProjectRepository }) =>
  new Elysia()
    .use(authMiddleware)
    .get("/projects", async () => {
      const useCase = new GetProjects(deps.projectRepository);
      return await useCase.execute();
    })
    .put("/projects/:id", async ({ body, params }) => {
      const useCase = new UpdateProject(deps.projectRepository);
      return await useCase.execute(params.id, body.name, body.description, body.status);
    })
    .delete("/projects/:id", async ({ params }) => {
      const useCase = new DeleteProject(deps.projectRepository);
      await useCase.execute(params.id);
      return { message: "Project deleted successfully" };
    })
    .post("/projects", async ({ body, user }) => {
      const useCase = new CreateProject(deps.projectRepository);
      return await useCase.execute(body.name, body.description, String(user.userId));
    });
    