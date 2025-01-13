import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const groupId = event.pathParameters?.groupId;
    const userId = event.requestContext.authorizer?.claims?.sub;

    if (!groupId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Group ID is required" }),
      };
    }

    // Check if user is member of the group
    const result = await dynamoDB
      .get({
        TableName: process.env.USER_GROUP_TABLE_NAME!,
        Key: {
          groupId,
          userId,
        },
      })
      .promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Group not found or user not authorized",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item.groupData),
    };
  } catch (error) {
    console.error("Error getting group:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error getting group" }),
    };
  }
};
