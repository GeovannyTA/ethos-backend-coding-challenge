import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";

export class GetUsers {
    constructor(private userRepo: UserRepository){}

    async execute(): Promise<User[]> {
        return await this.userRepo.findAll();
    }
}