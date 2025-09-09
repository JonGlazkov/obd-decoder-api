import { FastifyInstance } from "fastify";
import { DecodeRoutes } from "./routes/decode.routes";

const registerRoutes = (app: FastifyInstance) => {
  app.register(DecodeRoutes, { prefix: "/decode-dtc" });
};

export default registerRoutes;
