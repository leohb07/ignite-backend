import { randomUUID } from "node:crypto";
import { FastifyInstance } from "fastify";
import { knex } from "../database/knex";
import { AmountType } from "../enums/amount-type.enum";
import { createTransactionValidation } from "../validations/create-transaction.validation";
import { z } from "zod";
import { getTransactionParamsSchema } from "../validations/get-transaction.validation";

export async function transactionsRoutes(server: FastifyInstance) {
  server.get("/", async () => {
    try {
      const transactions = await knex("transactions").select();
      return { transactions };
    } catch (error) {
      console.log(error);
    }
  });

  server.get("/:id", async (request) => {
    try {
      const params = getTransactionParamsSchema.parse(request.params);
      const transaction = await knex("transactions")
        .where("id", params.id)
        .first();
      return { transaction };
    } catch (error) {
      console.error(error);
    }
  });

  server.get("/summary", async () => {
    try {
      const summary = await knex("transactions")
        .sum("amount", {
          as: "amount",
        })
        .first();
      return { summary };
    } catch (error) {
      console.error(error);
    }
  });

  server.post("/", async (request, reply) => {
    const body = createTransactionValidation.parse(request.body);
    try {
      await knex("transactions").insert({
        id: randomUUID(),
        title: body.title,
        amount:
          body.type === AmountType.credit ? body.amount : body.amount * -1,
      });
      return reply.status(201).send();
    } catch (error) {
      console.error(error);
    }
  });
}
