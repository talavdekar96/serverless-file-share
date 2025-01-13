import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const userId = event.requestContext.authorizer?.claims?.sub;
    const tableName = process.env.USER_GROUP_TABLE_NAME;

    if (!userId || !tableName) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Missing required parameters",
        }),
      };
    }

    const queryParams: QueryCommandInput = {
      TableName: tableName,
      IndexName: "userId-index",
      KeyConditionExpression: "userId = :userId",
      FilterExpression: "groupData.createdBy = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
      ProjectionExpression: "groupData",
    };

    const command = new QueryCommand(queryParams);
    const result = await docClient.send(command);

    // Extract unique groups
    const uniqueGroups = Array.from(
      new Map(
        result.Items?.map((item) => [item.groupData.groupId, item.groupData]) ||
          [],
      ).values(),
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        groups: uniqueGroups,
        count: uniqueGroups.length,
      }),
    };
  } catch (error) {
    console.error("Error listing groups:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Error listing groups",
        error: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};
