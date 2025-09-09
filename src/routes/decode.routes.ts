import { DecodeRequestBody } from "@src/interfaces/decode.interface";
import { DecodeUseCases } from "@src/usecases/decode.usecases";
import { FastifyInstance } from "fastify";

export async function DecodeRoutes(fastify: FastifyInstance) {
  const decodeUseCases = new DecodeUseCases();

  fastify.post<{ Body: DecodeRequestBody }>("/", async (request, reply) => {
    const rawResponse = request.body.rawResponse;

    try {
      const result = decodeUseCases.decode(rawResponse);
      return reply.send(result);
    } catch (error) {
      return reply
        .status(500)
        .send({ error: "Internal Server Error", details: error });
    }
  });
}
