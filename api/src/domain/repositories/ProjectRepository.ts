import { Project } from "../entities/Project";

export interface ProjectRepository {
    create(project: Project): Promise<Project>;
    update(project: Project): Promise<Project>;
    delete(id: string): Promise<Project>;
    findById(id: string): Promise<Project | null>;
    findByName(name: string): Promise<Project | null>;
    findAll(): Promise<Project[]>;
}