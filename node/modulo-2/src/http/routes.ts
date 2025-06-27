import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { register } from "./controllers/register";

export async function routes(app: FastifyInstance) {
  app.get("/users", async () => {
    const users = await prisma.user.findMany();
    return users;
  });

  app.post("/users", register);
}
