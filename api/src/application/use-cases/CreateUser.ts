import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository,";

export class CreateUser {
    constructor(private userRepo: UserRepository){}

    async execute(email: string, password: string): Promise<void> {
        // Verificar si el usuario ya existe
        const existing = await this.userRepo.findByEmail(email);

        // Si el usuario ya existe, lanzar un error
        if (existing) {
            throw new Error("User already exists");
        }

        // Crear un nuevo usuario
        const user = new User(crypto.randomUUID(), email, password);

        // Crear el usuario en la base de datos
        return await this.userRepo.create(user);
    }
}