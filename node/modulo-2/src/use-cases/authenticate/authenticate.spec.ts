import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { InvalidCredentialsError } from "../errors/user-invalid-credentials-error";
import { AuthenticateUseCase } from "./authenticate";

let authenticateUseCase: AuthenticateUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUseCase = new AuthenticateUseCase(inMemoryUsersRepository);
  })

  it("should be able to authenticate", async () => {

    await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await authenticateUseCase.execute({
      email: "john.doe@example.com",
      password: "123456",
    });

    expect(user).toBeDefined();
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("john.doe@example.com");
    expect(user.password_hash).toBeDefined();
  });

  it("should not be able to authenticate with wrong email", async () => {

    await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password_hash: await hash("123456", 6),
    });

    await expect(
      authenticateUseCase.execute({
        email: "wrong-email",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password_hash: await hash("123456", 6),
    });

    await expect(
      authenticateUseCase.execute({
        email: "john.doe@example.com",
        password: "wrong-password",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
