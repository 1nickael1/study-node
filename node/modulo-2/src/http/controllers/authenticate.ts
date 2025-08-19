
import { InvalidCredentialsError } from "@/use-cases/errors/user-invalid-credentials-error";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case";
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
    const authenticateUseCase = makeAuthenticateUseCase();

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
