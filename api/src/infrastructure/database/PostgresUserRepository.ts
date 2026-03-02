import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { pool } from "./connection";

export class PostgresUserRepository implements UserRepository {
    // Crear un usuario en la base de datos
    async create(user: User): Promise<User> {
        await pool.query(
            'insert into users (email, password, first_name, last_name) values ($1, $2, $3, $4)',
            [user.email, user.password, user.first_name, user.last_name]
        )
        return user;
    }

    // Buscar un usuario por su email, si no existe, retornar null
    async findByEmail(email: string): Promise<User | null> {
        const result = await pool.query(
            'select * from users where email = $1',
            [email]
        )

        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        // Retornar un nuevo usuario 
        return new User(row.id, row.email, row.password, row.first_name, row.last_name);
    }
}
