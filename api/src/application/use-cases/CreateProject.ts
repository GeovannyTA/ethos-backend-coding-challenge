import { Project } from "../../domain/entities/Project";
import { ProjectRepository } from "../../domain/repositories/ProjectRepository";
import { ConflictError } from "../../domain/errors/AppError";

export class CreateProject {
    constructor(private projectRepo: ProjectRepository){}

    async execute(name: string, description: string, userId: string): Promise<Project> {
        const existing = await this.projectRepo.findByName(name);

        if (existing) {
            throw new ConflictError("Project already exists");
        }

        // Crear el proyecto
        const project = new Project('' as unknown as string, name, description, userId, 'active', new Date());
        console.log(project);
        
        // Crear el proyecto en la base de datos
        return await this.projectRepo.create(project);
    }
}