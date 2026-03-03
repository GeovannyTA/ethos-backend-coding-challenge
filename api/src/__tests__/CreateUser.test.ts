import { describe, expect, test } from "bun:test";
import { CreateUser } from "../application/use-cases/CreateUser";
import { UserRepository } from "../domain/repositories/UserRepository";
import { User } from "../domain/entities/User";
import { ConflictError } from "../domain/errors/AppError";

class MockUserRepository implements UserRepository {
  private existingEmail: string | null = null;

  async create(user: User): Promise<User> {
    return user;
  }
  async update() {
    throw new Error("No implementado");
  }
  async findByEmail(email: string) {
    if (this.existingEmail === email) {
      return new User("1", email, "hash", "Test", "User");
    }
    return null;
  }
  async delete() {
    throw new Error("No implementado");
  }
  async findById() {
    return null;
  }
  async findAll() {
    return [];
  }

  setExistingEmail(email: string | null) {
    this.existingEmail = email;
  }
}

describe("CreateUser", () => {
  test("debe lanzar ConflictError cuando el email ya existe", async () => {
    const mockRepo = new MockUserRepository();
    mockRepo.setExistingEmail("existente@test.com");
    const createUser = new CreateUser(mockRepo);

    await expect(
      createUser.execute("existente@test.com", "password123", "Juan", "Pérez")
    ).rejects.toThrow(ConflictError);

    await expect(
      createUser.execute("existente@test.com", "password123", "Juan", "Pérez")
    ).rejects.toThrow("User already exists");
  });
});