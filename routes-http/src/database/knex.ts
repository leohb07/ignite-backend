import { knex as setupKnex, Knex } from "knex";

import { env } from "../validations/env.validation";

export const config: Knex.Config = {
  client: "sqlite",
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./src/database/migrations",
  },
  seeds: {
    extension: "ts",
    directory: "./src/seeds",
  },
};

export const knex = setupKnex(config);
