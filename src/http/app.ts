import cors from "@fastify/cors";
import fastify, { FastifyInstance } from "fastify";
import routes from "../routes";

class App {
  private readonly app: FastifyInstance;

  constructor() {
    this.app = fastify({
      ignoreDuplicateSlashes: true,
      // logger: true,
    });

    this.initRoutes();
  }

  async init() {
    const port = parseInt(process.env.PORT || "3333", 10);
    const host = process.env.HOST || "";
    this.app.listen({ port, host }).then(() => {
      console.log(`🚀 HTTP server running on port ${port}`);
      console.log(this.app.printRoutes());
    });
    this.app.register(cors, {
      origin: ["http://localhost:3333"],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    });
  }

  private initRoutes() {
    this.app.register(routes);
    this.app.get("/", (_, res) => {
      res.send({ message: "OBD-II Decoder API" });
    });
    this.app.get("/ping", (_, res) => {
      res.send("pong");
    });
  }
}

export default App;
