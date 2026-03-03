import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { NotFoundError } from "../../domain/errors/AppError";

export class DeleteUser {
    constructor(private userRepo: UserRepository){}

    async execute(id: string): Promise<User> {
        const existing = await this.userRepo.findById(id);

        if (!existing) {
            throw new NotFoundError("User not found");
        }
        
        return await this.userRepo.delete(id);
    }
}