import { Project } from "../../domain/entities/Project";
import { ProjectRepository } from "../../domain/repositories/ProjectRepository";
import { pool } from "./connection";

export class PostgresProjectRepository implements ProjectRepository {
    // Crear un proyecto en la base de datos
    async create(project: Project): Promise<Project> {
        await pool.query(
            'insert into projects (name, description, "userId", status, "createdAt") values ($1, $2, $3, $4, $5)',
            [project.name, project.description, project.user_id, project.status, project.created_at]
        )
        return project;
    }

    // Buscar un proyecto por su nombre, si no existe, retornar null
    async findByName(name: string): Promise<Project | null> {
        const result = await pool.query(
            'select * from projects where name = $1',
            [name]
        )

        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        // Retornar un nuevo proyecto 
        return new Project(row.id, row.name, row.description, row.userid, row.status, row.createdAt ?? row.created_at);
    }

    // Buscar todos los proyectos
    async findAll(): Promise<Project[]> {
        const result = await pool.query('select * from projects');
        return result.rows.map(row => new Project(row.id, row.name, row.description, row.userid, row.status, row.createdAt ?? row.created_at));
    }
}
