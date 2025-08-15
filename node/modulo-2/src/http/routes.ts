import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { authenticate } from "./controllers/authenticate";
import { register } from "./controllers/register";

export async function routes(app: FastifyInstance) {
  app.get("/users", async () => {
    const users = await prisma.user.findMany();
    return users;
  });

  app.post("/users", register);
  app.post("/sessions", authenticate);
}
