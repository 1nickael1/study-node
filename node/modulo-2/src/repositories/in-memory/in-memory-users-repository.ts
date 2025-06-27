import { Prisma, User } from "generated/prisma";
import { UsersRepository } from "../users-repository";

class InMemoryUsersRepository implements UsersRepository {
  private users: User[] = [];

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: "1",
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }
  async findByEmail(email: string) {
    const user = this.users.find((user) => user.email === email);
    return user ?? null;
  }
}

export { InMemoryUsersRepository };
