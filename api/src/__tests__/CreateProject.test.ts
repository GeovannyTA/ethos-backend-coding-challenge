import { describe, expect, test } from "bun:test";
import { ConflictError } from "../domain/errors/AppError";
import { ProjectRepository } from "../domain/repositories/ProjectRepository";
import { Project } from "../domain/entities/Project";
import { CreateProject } from "../application/use-cases/CreateProject";

class MockProjectRepository implements ProjectRepository {
  private existingName: string | null = null;

  async create(project: Project): Promise<Project> {
    return project;
  }
  async update(project: Project): Promise<Project> {
    throw new Error("No implementado");
  }
  async findByName(name: string) {
    if (this.existingName === name) {
      return new Project("1", name, "description", "userId", "status", new Date());
    }
    return null;
  }
  async delete(id: string): Promise<Project> {
    throw new Error("No implementado");
  }
  async findById(id: string): Promise<Project | null> {
    return null;
  }
  async findAll(): Promise<Project[]> {
    return [];
  }

  setExistingName(name: string | null) {
    this.existingName = name;
  }
}

describe("CreateProject", () => {
  test("debe lanzar ConflictError cuando el nombre ya existe", async () => {
    const mockRepo = new MockProjectRepository();
    mockRepo.setExistingName("existente");
    const createProject = new CreateProject(mockRepo);

    await expect(
      createProject.execute("existente", "description", "userId")
    ).rejects.toThrow(ConflictError);

    await expect(
      createProject.execute("existente", "description", "userId")
    ).rejects.toThrow("Project already exists");
  });
});
