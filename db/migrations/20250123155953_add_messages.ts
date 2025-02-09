import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('messages', (table) => {
        table.primary(['id']);
        table.increments('id');
        table.integer('sender_id')
            .unsigned()
            .notNullable();
        table.integer('chat_id')
            .unsigned()
            .notNullable();
        table.string('content')
            .notNullable()
            .defaultTo("");
        table.datetime('created_at').defaultTo(null);
        table.datetime('deleted_at').defaultTo(null);
        table.foreign('sender_id')
            .references('users.id')
            .onDelete('NO ACTION');
        table.foreign('chat_id')
            .references('chats.id')
            .onDelete('CASCADE');
    });

    await knex.schema.createTable('images_messages', (table) => {
        table.primary(['id']);
        table.increments('id');
        table.integer('message_id')
            .unsigned()
            .notNullable();
        table.string('image_path')
            .notNullable();
        table.foreign('message_id')
            .references('messages.id')
            .onDelete('CASCADE');
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('images_messages');
    await knex.schema.dropTableIfExists('messages');
}
