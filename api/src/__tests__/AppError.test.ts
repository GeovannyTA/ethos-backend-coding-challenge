import { describe, expect, test } from "bun:test";
import {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} from "../domain/errors/AppError";

describe("AppError", () => {
  test("AppError debe tener mensaje y status", () => {
    const error = new AppError("Error genérico", 500);
    expect(error.message).toBe("Error genérico");
    expect(error.status).toBe(500);
    expect(error).toBeInstanceOf(Error);
  });

  test("NotFoundError debe tener status 404", () => {
    const error = new NotFoundError("User not found");
    expect(error.message).toBe("User not found");
    expect(error.status).toBe(404);
    expect(error).toBeInstanceOf(AppError);
  });

  test("UnauthorizedError debe tener status 401", () => {
    const error = new UnauthorizedError("Invalid password");
    expect(error.message).toBe("Invalid password");
    expect(error.status).toBe(401);
  });

  test("ConflictError debe tener status 409", () => {
    const error = new ConflictError("Email already exists");
    expect(error.message).toBe("Email already exists");
    expect(error.status).toBe(409);
  });
});
