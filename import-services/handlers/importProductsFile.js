const AWS = require("aws-sdk");

const BUCKET = "import-services";
const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export const importProductsFile = async (event) => {
  console.log(event);

  try {
    const s3 = new AWS.S3({ region: "eu-west-1" });
    const pathProducts = event.queryStringParameters.name;
    const params = {
      Bucket: BUCKET,
      Key: `uploaded/${pathProducts}`,
      Expires: 300,
      ContentType: "text/csv",
    };

    const url = await s3.getSignedUrl("putObject", params);

    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify(url, null, 2),
    };
  } catch (e) {
    console.error(e);

    return {
      statusCode: 500,
      headers: HEADERS,
      body: JSON.stringify("myInternal server error", null, 2),
    };
  }
};
