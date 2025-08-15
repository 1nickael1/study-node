import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "@/use-cases/authenticate/authenticate";
import { InvalidCredentialsError } from "@/use-cases/errors/user-invalid-credentials-error";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const { email, password } = authBodySchema.parse(request.body);

  try {
    const authenticateUseCase = new AuthenticateUseCase(
      new PrismaUsersRepository()
    );

    const { user } = await authenticateUseCase.execute({
      email: email,
      password: password,
    });

    return reply.status(200).send({
      user,
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
}
