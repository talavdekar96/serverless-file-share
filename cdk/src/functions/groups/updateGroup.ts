import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const groupId = event.pathParameters?.groupId;
    const userId = event.requestContext.authorizer?.claims?.sub;
    const updates = JSON.parse(event.body || "{}");
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

    // Get existing group data
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
          message: "Only group creator can update group",
        }),
      };
    }

    // Update group data
    const updatedGroupData = {
      ...groupData,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Update all member records with new group data
    const updatePromises = groupData.members.map(async (member: any) => {
      const updateCommand = new UpdateCommand({
        TableName: tableName,
        Key: {
          groupId,
          userId: userId,
        },
        UpdateExpression: "SET groupData = :groupData",
        ExpressionAttributeValues: {
          ":groupData": updatedGroupData,
        },
      });

      return docClient.send(updateCommand);
    });

    await Promise.all(updatePromises);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(updatedGroupData),
    };
  } catch (error) {
    console.error("Error updating group:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Error updating group",
        error: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};
