const AWS = require("aws-sdk");

import { postProducts } from "../../product-services/handlers/postProducts";

export const catalogBatchProcess = async (event) => {
  const sns = new AWS.SNS({ region: "eu-west-1" });

  try {
    const products = event.Records.map(({ body }) => JSON.parse(body));

    for (const product of products) {
      const item = await postProducts(product); //

      if (item) {
        const params = {
          Subject: "No subject",
          Message: JSON.stringify(item),
          TopicArn: process.env.SNS_ARN,
          MessageAttributes: {
            description: {
              DataType: "String",
              StringValue: item.description.includes("compression")
                ? "yes"
                : "no",
            },
          },
        };

        await sns.publish(params).promise();
        console.log("mySuccess");
      }
    }
  } catch (e) {
    console.log("myError: ", e);
  }
};
