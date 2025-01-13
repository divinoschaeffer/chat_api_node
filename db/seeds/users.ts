import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert([
        { name: "Dupont", email: "dupont@gmail.com", password: "azduyiadbiabs" },
        { name: "Martin", email: "martin@example.com", password: "kajdh2398adsf" },
        { name: "Bernard", email: "bernard@yahoo.com", password: "p02kq9fhwe29w" },
        { name: "Thomas", email: "thomas@hotmail.com", password: "qwertzuiop123" },
        { name: "Petit", email: "petit@gmail.com", password: "abc123xyz890" },
        { name: "Robert", email: "robert@mail.com", password: "passw0rd2023" },
        { name: "Richard", email: "richard@protonmail.com", password: "nsi93jd02p3kd" },
        { name: "Durand", email: "durand@example.org", password: "vbnm457asd89" },
        { name: "Moreau", email: "moreau@outlook.com", password: "xczvqw8765kl" },
        { name: "Laurent", email: "laurent@mail.fr", password: "lkj098mnb567" }
    ]);
};
