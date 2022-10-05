"use strict";
import pg from "pg";
const { Client } = pg;

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

export const postProducts = async (event) => {
  const client = new Client(dbOptions);
  await client.connect();

  console.log(event);

  try {
    const body = JSON.parse(event.body);
    const check =
      body &&
      body.hasOwnProperty("title") &&
      body.hasOwnProperty("description") &&
      body.hasOwnProperty("price");

    if (check) {
      const response = await client.query(
        `insert into products (title, description, price) values ('${title}', '${description}', ${price})`
      );

      console.log(response);

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(response.rows[0]),
      };
    } else {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify("Product is NOT created", null, 2),
      };
    }
  } catch (e) {
    console.error("console.log: ", e);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify("Internal server error", null, 2),
    };
  } finally {
    client.end();
  }
};
