import request from "supertest"
import { execSync } from "node:child_process"
import { it, describe, beforeAll, afterAll, expect } from "vitest"
import { app } from "../src/app"
import { beforeEach } from "node:test"

describe("Transactions routes", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('yarn run knex migrate:rollback --all')
    execSync('yarn run knex migrate:latest')
  })

  it("should be able to create create a new transaction", async () => {
    await request(app.server).post('/transactions').send({
      title: "New transaction",
      amount: 5000,
      type: "credit"
    }).expect(201)
  })

  it("should be able to list all transactions", async () => {
    const createTransactionResponse = await request(app.server).post('/transactions').send({
      title: "New transaction",
      amount: 10000,
      type: "credit"
    })
    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: "New transaction",
        amount: 10000,
      })
    ])
  })
})