import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const tableName = process.env.ROLE_TABLE_NAME;

    if (!tableName) {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "ROLE_TABLE_NAME environment variable is not defined",
        }),
      };
    }

    const result = await docClient.send(
      new ScanCommand({
        TableName: tableName,
        ProjectionExpression:
          "roleId, #name, #privileges, createdAt, updatedAt",
        ExpressionAttributeNames: {
          "#name": "name",
          "#privileges": "privileges",
        },
      }),
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error("Error listing roles:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Error listing roles",
        error: (error as Error).message,
      }),
    };
  }
};
