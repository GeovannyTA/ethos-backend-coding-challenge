import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { ConflictError } from "../../domain/errors/AppError";
import argon2 from "argon2";

export class CreateUser {
    constructor(private userRepo: UserRepository){}

    async execute(email: string, password: string, first_name: string, last_name: string): Promise<User> {
        const existing = await this.userRepo.findByEmail(email);

        if (existing) {
            throw new ConflictError("User already exists");
        }
        
        // Hashear la contraseña
        const hashedPassword = await argon2.hash(password);
    
        // Crear el usuario
        const user = new User('' as unknown as string, email, hashedPassword, first_name, last_name);
    
        // Crear el usuario en la base de datos
        return await this.userRepo.create(user);
    }
}