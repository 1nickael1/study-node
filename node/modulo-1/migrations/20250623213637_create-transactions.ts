import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("transactions", (table) => {
        table.uuid("id").primary();
        table.text("title").notNullable();
        table.text("content").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("transactions");
}

