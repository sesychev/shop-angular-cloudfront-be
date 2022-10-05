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

export const getProductById = async (event) => {
  const client = new Client(dbOptions);
  await client.connect();

  console.log(event);

  try {
    const productId = event.pathParameters.productId;
    const response = await client.query(
      `select * from products where id='${productId}`
    );

    console.log(response);

    if (response.rows.length > 0) {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(response.rows[0], null, 2),
      };
    } else {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify("Product not found", null, 2),
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

