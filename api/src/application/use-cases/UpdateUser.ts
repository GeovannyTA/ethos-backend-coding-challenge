import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { NotFoundError } from "../../domain/errors/AppError";
import argon2 from "argon2";

export class UpdateUser {
    constructor(private userRepo: UserRepository){}

    async execute(id: string, email: string, password: string, first_name: string, last_name: string): Promise<User> {
        const existing = await this.userRepo.findById(id);

        if (!existing) {
            throw new NotFoundError("User not found");
        }

        // Hashear la contraseña
        const hashedPassword = await argon2.hash(password);

        const user = new User(existing.id, email, hashedPassword, first_name, last_name);
        return await this.userRepo.update(user);
    }
}