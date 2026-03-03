import { Project } from "../entities/Project";

export interface ProjectRepository {
    create(project: Project): Promise<Project>;
    findByName(name: string): Promise<Project | null>;
    findAll(): Promise<Project[]>;
}