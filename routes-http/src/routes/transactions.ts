import { randomUUID } from "node:crypto";
import { FastifyInstance } from "fastify";
import { knex } from "../database/knex";
import { z } from "zod";

enum AmountType {
  "credit" = "credit",
  "debit" = "debit",
}

export async function transactionsRoutes(server: FastifyInstance) {
  server.post("/", async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["debit", "credit"]),
    });
    const body = createTransactionBodySchema.parse(request.body);
    try {
      await knex("transactions").insert({
        id: randomUUID(),
        title: body.title,
        amount:
          body.type === AmountType.credit ? body.amount : body.amount * -1,
      });
      return reply.status(201).send();
    } catch (error: any) {
      console.error(error);
    }
  });
}
