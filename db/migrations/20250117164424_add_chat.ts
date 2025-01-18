import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('chats', (table) => {
        table.primary(['id']);
        table.increments('id');
        table.integer('creator_id')
            .notNullable()
            .unsigned();
        table.string('name')
            .notNullable();
        table
            .enum('type', ['GROUP','PRIVATE'])
            .notNullable()
            .defaultTo('PRIVATE');
        table.datetime('created_at').defaultTo(null);
        table
            .foreign('creator_id')
            .references('users.id')
            .onDelete('NO ACTION');
    });

    await knex.schema.createTable('users_chats', (table) => {
        table.primary(['id']);
        table.increments('id');
        table.integer('user_id').unsigned();
        table.integer('chat_id').unsigned();
        table
            .foreign('user_id')
            .references('users.id')
            .onDelete('CASCADE');
        table
            .foreign('chat_id')
            .references('chats.id')
            .onDelete('CASCADE');
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('users_chats');
    await knex.schema.dropTableIfExists('chats');
}
