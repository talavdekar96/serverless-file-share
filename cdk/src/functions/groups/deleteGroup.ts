import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  DeleteCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const groupId = event.pathParameters?.groupId;
    const userId = event.requestContext.authorizer?.claims?.sub;
    const tableName = process.env.USER_GROUP_TABLE_NAME;

    if (!groupId || !userId || !tableName) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "Missing required parameters" }),
      };
    }

    // Get group data to verify creator and get member list
    const getCommand = new GetCommand({
      TableName: tableName,
      Key: {
        groupId,
        userId,
      },
    });

    const result = await docClient.send(getCommand);

    if (!result.Item) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Group not found or user not authorized",
        }),
      };
    }

    const groupData = result.Item.groupData;

    // Check if user is the group creator
    if (groupData.createdBy !== userId) {
      return {
        statusCode: 403,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Only group creator can delete group",
        }),
      };
    }

    // Delete all member records in batches of 25
    const deleteRequests = groupData.members.map(async (member: any) => ({
      DeleteRequest: {
        Key: {
          groupId,
          userId: member.userId,
        },
      },
    }));

    for (let i = 0; i < deleteRequests.length; i += 25) {
      const batch = deleteRequests.slice(i, i + 25);
      const batchWriteCommand = new BatchWriteCommand({
        RequestItems: {
          [tableName]: batch,
        },
      });

      await docClient.send(batchWriteCommand);
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Group deleted successfully" }),
    };
  } catch (error) {
    console.error("Error deleting group:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Error deleting group",
        error: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};
