import fastify from "fastify";
import { env } from "./validations/env.validation";
import { transactionsRoutes } from "./routes/transactions";

const server = fastify();

server.register(transactionsRoutes, {
  prefix: "transactions",
});

server
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log("HTTP Server Running!");
  });