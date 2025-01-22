import knex,  { type Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users_chats").del();
    await knex("chats").del();

    // Inserts seed entries
    await knex("chats").insert([
        {
            creator_id: 2,
            name: "Travail",
            type: "PRIVATE",
        },
        {
            creator_id: 3,
            name: "Famille",
            type: "GROUP",
        },
        {
            creator_id: 4,
            name: "Amis du sport",
            type: "PRIVATE",
        },
        {
            creator_id: 5,
            name: "Projet Startup",
            type: "GROUP",
        },
        {
            creator_id: 1,
            name: "Gaming Squad",
            type: "GROUP",
        }
    ]);

    await knex("users_chats").insert([
        // Chat ID 1: PRIVATE (2 users)
        { user_id: 1, chat_id: 1 },
        { user_id: 2, chat_id: 1 },

        // Chat ID 2: PRIVATE (2 users)
        { user_id: 3, chat_id: 2 },
        { user_id: 4, chat_id: 2 },

        // Chat ID 3: GROUP (3 users)
        { user_id: 5, chat_id: 3 },
        { user_id: 6, chat_id: 3 },
        { user_id: 7, chat_id: 3 },

        // Chat ID 4: GROUP (4 users)
        { user_id: 8, chat_id: 4 },
        { user_id: 9, chat_id: 4 },
        { user_id: 10, chat_id: 4 },
        { user_id: 1, chat_id: 4 },

        // Chat ID 5: GROUP (5 users)
        { user_id: 2, chat_id: 5 },
        { user_id: 3, chat_id: 5 },
        { user_id: 4, chat_id: 5 },
        { user_id: 5, chat_id: 5 },
        { user_id: 6, chat_id: 5 },
    ]);
};
