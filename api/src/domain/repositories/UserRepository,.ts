import { User } from "../entities/User";

export interface UserRepository {
    create(user: User): Promise<void>;
    findAll(): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    update(user: User): Promise<void>;
    delete(id: string): Promise<void>;
}