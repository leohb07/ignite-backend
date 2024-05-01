import fastify from "fastify";
import crypt from "node:crypto";

import { knex } from "./database/knex";
import { env } from "./validations/env.validation";

const server = fastify();

server.get("/hello", async () => {
  const transactions = await knex("transactions")
    .insert({
      id: crypt.randomUUID(),
      title: "Transação de teste",
      amount: 500,
    })
    .returning("*");
  return transactions;
});

server
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log("HTTP Server Running!");
  });
