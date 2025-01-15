import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', (table) => {
        table.primary(['id']);
        table.increments('id');
        table.string('name').notNullable().unique();
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.boolean('admin').defaultTo(false);
        table.datetime('created_at').defaultTo(null);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('users');
}
