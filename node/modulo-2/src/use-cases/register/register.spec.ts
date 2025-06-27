import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { compare } from "bcryptjs";
import { describe, expect, it } from "vitest";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";
import { RegisterUseCase } from "./register";

describe("Register use case", () => {
  it("should hash user password upon registration", async () => {
    const registerUseCase = new RegisterUseCase(new InMemoryUsersRepository());

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should be able to register a new user", async () => {
    const registerUseCase = new RegisterUseCase(new InMemoryUsersRepository());

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456",
    });

    expect(user).toBeDefined();
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("john.doe@example.com");
    expect(user.password_hash).toBeDefined();
  });

  it("should not be able to register a new user with same email twice", async () => {
    const registerUseCase = new RegisterUseCase(new InMemoryUsersRepository());

    await registerUseCase.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456",
    });

    await expect(
      registerUseCase.execute({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
