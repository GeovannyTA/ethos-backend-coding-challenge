import { Project } from "../entities/Project";

export interface ProjectRepository {
    create(project: Project): Promise<void>;
    findAll(): Promise<Project[]>;
}