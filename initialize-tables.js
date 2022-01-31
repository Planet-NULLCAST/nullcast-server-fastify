// @ts-nocheck
const fs = require("fs");
const { Client } = require("pg");

require("dotenv").config();

const client = new Client({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  port: Number(process.env.PG_PORT),
});

const superAdminQueries = [
  `CREATE SCHEMA IF NOT EXISTS public`,
  `CREATE EXTENSION IF NOT EXISTS pgcrypto`,
  `GRANT ALL ON schema public TO ${client.user}`,
];

/**
 * Process the sql queries in a file.
 *
 * @param {String} fileName full path of the sql file
 * @returns {Promise}
 */
async function processSQLFile(fileName) {
  // Extract SQL queries from files. Assumes no ';' in the fileNames
  const queries = fs
    .readFileSync(fileName)
    .toString()
    .replace(/(\r\n|\n|\r)/gm, " ") // remove newlines
    .replace(/\s+/g, " ") // excess white space
    .split(";") // split into all statements
    .map(Function.prototype.call, String.prototype.trim)
    .filter(function (el) {
      return el.length != 0;
    }); // remove any empty ones

  queries.unshift(...superAdminQueries);

  for await (const query of queries) {
    await new Promise(function (resolve, reject) {
      execQueries(query, resolve);
    });
  }
}

/**
 * Execute the sql statements using pg
 *
 * @param {String} query An SQL query
 * @param {Promise} done
 */
async function execQueries(query, done) {
  if (query.indexOf("COPY") === 0) {

    // COPY - needs special treatment
    const regexp = /COPY\ (.*)\ FROM\ (.*)\ DELIMITERS/gim;
    const matches = regexp.exec(query);
    const table = matches[1];
    const fileName = matches[2];
    const copyString =
      "COPY " + table + " FROM STDIN DELIMITERS ',' CSV HEADER";
    const stream = client.copyFrom(copyString);

    stream.on("close", function () {
      done();
    });

    const csvFile = __dirname + "/" + fileName;
    const str = fs.readFileSync(csvFile);

    stream.write(str);
    stream.end();
  } else {
    // Other queries don't need special treatment
    query = query + ";";
    const res = await client.query(query);
    done();
  }
}

async function InitializeTables() {
  try {
    await client.connect();

    await processSQLFile(`${__dirname}/db.sql`);
    console.log("tables created");

    //close connection
    await client.end();
    process.exit(0);
  } catch (error) {
    client.end();
    console.error(error);
    process.exit(1);
  }
}

InitializeTables();
