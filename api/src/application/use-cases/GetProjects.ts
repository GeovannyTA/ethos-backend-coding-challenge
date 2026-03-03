import { Project } from "../../domain/entities/Project";
import { ProjectRepository } from "../../domain/repositories/ProjectRepository";

export class GetProjects {
    constructor(private projectRepo: ProjectRepository){}

    async execute(): Promise<Project[]> {
        return await this.projectRepo.findAll();
    }
}