const {Client} = require('pg');

const client = new Client(
    {
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABSE,
        // @ts-ignore
        port: parseInt(process.env.PG_PORT,10)
    }
)

/**
 * @param {Client} client
 */
async function createUsers(client) {

    await client.query(
        `CREATE  TABLE IF NOT EXISTS users (
            id integer GENERATED ALWAYS AS IDENTITY (MINVALUE 10000000 START WITH 10000000 CACHE 200) PRIMARY KEY, 
            user_name varchar(64) NOT NULL UNIQUE,
            full_name varchar(64) NOT NULL,
            email varchar(64) NOT NULL UNIQUE,
            password varchar(64) NOT NULL,
            created_at timestamp NOT NULL,
            updated_at timestamp NOT NULL,
            cover_image varchar(512),
            bio varchar(1024),
            status varchar(10)
        );`
    )
}

async function InitializeTables() {
    try {
        
        await client.connect();
        
        await createUsers(client);
        console.log('users table created');

        //close connection
        await client.end();
        process.exit(0);
    } catch(error) {
        client.end();
        console.error(error);
        process.exit(1)
    }

}

InitializeTables();