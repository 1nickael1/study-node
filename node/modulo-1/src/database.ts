import knex, { type Knex } from "knex";

export const config: Knex.Config = {
    client: "sqlite",
    connection: {
      filename: "./db.sqlite",
    },
    useNullAsDefault: true,
    migrations: {
      extension: "ts",
      directory: "./migrations",
    },
  }
export const db = knex(config);