import { Project } from "../../domain/entities/Project";
import { ProjectRepository } from "../../domain/repositories/ProjectRepository";
import { NotFoundError } from "../../domain/errors/AppError";

export class DeleteProject {
    constructor(private projectRepo: ProjectRepository){}

    async execute(id: string): Promise<Project> {
        const existing = await this.projectRepo.findById(id);

        if (!existing) {
            throw new NotFoundError("Project not found");
        }
        
        return await this.projectRepo.delete(id);
    }
}