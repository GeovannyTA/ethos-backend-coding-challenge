import { User, UserResponse } from "../entities/User";

export interface UserRepository {
    create(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<UserResponse[]>;
}