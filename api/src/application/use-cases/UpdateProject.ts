import { Project } from "../../domain/entities/Project";
import { ProjectRepository } from "../../domain/repositories/ProjectRepository";
import { NotFoundError } from "../../domain/errors/AppError";

export class UpdateProject {
    constructor(private projectRepo: ProjectRepository){}

    async execute(id: string, name: string, description: string, status: string): Promise<Project> {
        const existing = await this.projectRepo.findById(id);

        if (!existing) {
            throw new NotFoundError("Project not found");
        }
        
        const project = new Project(existing.id, name, description, existing.user_id, status, existing.created_at);
        return await this.projectRepo.update(project);
    }
}