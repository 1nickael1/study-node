import fastify, { FastifyReply } from "fastify";
import { ZodError } from "zod";
import { env } from "./env";
import { routes } from "./http/routes";

export const app = fastify();

app.register(routes);

app.setErrorHandler((error, _, reply: FastifyReply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error",
      issues: error.flatten().fieldErrors,
    });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  }

  if (error instanceof Error) {
    return reply.status(500).send({ message: error.message });
  }

  return reply.status(500).send({ message: "Internal server error" });
});
