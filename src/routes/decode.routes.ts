import { FastifyInstance } from "fastify";
import { DecodeRequestBody } from "../interfaces/decode.interface";
import { DecodeUseCases } from "../usecases/decode.usecases";

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
