const AWS = require("aws-sdk");
const csv = require("csv-parser");

const BUCKET = "import-services";

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export const importFileParser = async (event) => {
  console.log(event);

  try {
    const s3 = new AWS.S3({ region: "eu-west-1" });
    const sqs = new AWS.SQS();

    for (const record of event.Records) {
      const key = record.s3.object.key;
      const params = {
        Bucket: BUCKET,
        Key: key,
      };

      const s3Stream = await s3.getObject(params).createReadStream();

      await new Promise(() => {
        s3Stream
          .pipe(csv())
          .on("data", (data) => {
            sqs.sendMessage(
              {
                QueueUrl: process.env.SQS_URL,
                MessageBody: JSON.stringify(data),
              },
              function (error, inf) {
                return error ? console.log(error) : console.log(inf);
              }
            );
          })
          .on("end", async () => {
            await s3
              .copyObject({
                Bucket: BUCKET,
                CopySource: BUCKET + "/" + key,
                Key: key.replace("uploaded", "parsed"),
              })
              .promise();

            await s3
              .deleteObject({
                Bucket: BUCKET,
                Key: key,
              })
              .promise();
          });
      });
    }
    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify("parsed", null, 2),
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
