import knex from 'knex';
import dotenv from "dotenv";

dotenv.config();

const database_config = {
    client: 'mysql2',
    connection: process.env.DATABASE_URL,
    pool: { min: 0, max: 7 },
};

const database = knex(database_config);

export default database;
