import { User, UserResponse } from "../entities/User";

export interface UserRepository {
    create(user: User): Promise<User>;
    update(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    delete(id: string): Promise<User>;
    findById(id: string): Promise<User | null>;
    findAll(): Promise<UserResponse[]>;
}