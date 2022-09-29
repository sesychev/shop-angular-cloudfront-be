import products from "../mocks/products.json";

const getProductById = async (event: any) => {
  const product = event.pathParameters.productId;
  const check = products.find((p) => p.id === product);
  if (check) {
    return {
      statusCode: 200,
      headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
      body: JSON.stringify(check, null, 2),
    };
  } else {
    return {
      statusCode: 404,
      headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
      body: JSON.stringify("Product not found"),
    };
  }
};

export default getProductById;