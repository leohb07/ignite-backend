import { randomUUID } from "node:crypto";
import { FastifyInstance } from "fastify";
import { knex } from "../database/knex";
import { AmountType } from "../enums/amount-type.enum";
import { createTransactionValidation } from "../validations/create-transaction.validation";
import { getTransactionParamsSchema } from "../validations/get-transaction.validation";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export async function transactionsRoutes(server: FastifyInstance) {
  server.get(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      try {
        const sessionId = request.cookies.sessionId;
        const transactions = await knex("transactions")
          .where("session_id", sessionId)
          .select();
        return { transactions };
      } catch (error) {
        console.log(error);
      }
    }
  );

  server.get(
    "/:id",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      try {
        const sessionId = request.cookies.sessionId;
        const params = getTransactionParamsSchema.parse(request.params);
        const transaction = await knex("transactions")
          .where({
            id: params.id,
            session_id: sessionId,
          })
          .first();
        return { transaction };
      } catch (error) {
        console.error(error);
      }
    }
  );

  server.get(
    "/summary",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      try {
        const sessionId = request.cookies.sessionId;
        const summary = await knex("transactions")
          .where("session_id", sessionId)
          .sum("amount", {
            as: "amount",
          })
          .first();
        return { summary };
      } catch (error) {
        console.error(error);
      }
    }
  );

  server.post("/", async (request, reply) => {
    const body = createTransactionValidation.parse(request.body);
    try {
      let sessionId = request.cookies.sessionId;
      if (!sessionId) {
        sessionId = randomUUID();
        reply.cookie("sessionId", sessionId, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // in seconds7
        });
      }
      await knex("transactions").insert({
        id: randomUUID(),
        title: body.title,
        amount:
          body.type === AmountType.credit ? body.amount : body.amount * -1,
        session_id: sessionId,
      });
      return reply.status(201).send();
    } catch (error) {
      console.error(error);
    }
  });
}
