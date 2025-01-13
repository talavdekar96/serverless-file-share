import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  BatchWriteCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { UserGroup, GroupMember } from "../../types";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { name, description, members } = JSON.parse(event.body || "{}");
    const userId = event.requestContext.authorizer?.claims?.sub;
    const tableName = process.env.USER_GROUP_TABLE_NAME;

    if (!tableName) {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "USER_GROUP_TABLE_NAME environment variable is not defined",
        }),
      };
    }

    const groupId = uuidv4();
    const timestamp = new Date().toISOString();

    const group: UserGroup = {
      groupId,
      name,
      description,
      createdBy: userId,
      createdAt: timestamp,
      updatedAt: timestamp,
      members: members.map((member: GroupMember) => ({
        ...member,
        addedAt: timestamp,
      })),
    };

    // Process in batches of 25 (DynamoDB limit)
    const writeRequests = members.map((member: GroupMember) => ({
      PutRequest: {
        Item: {
          groupId,
          userId: userId,
          groupData: group,
        },
      },
    }));

    for (let i = 0; i < writeRequests.length; i += 25) {
      const batch = writeRequests.slice(i, i + 25);

      const batchWriteCommand: BatchWriteCommandInput = {
        RequestItems: {
          [tableName]: batch,
        },
      };

      const command = new BatchWriteCommand(batchWriteCommand);
      await docClient.send(command);
    }

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(group),
    };
  } catch (error) {
    console.error("Error creating group:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Error creating group",
        error: error instanceof Error ? error.message : String(error),
        tableName: process.env.USER_GROUP_TABLE,
        environment: process.env,
      }),
    };
  }
};
