import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { Role } from "../types";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const userId = event.pathParameters?.userId;
    const userTableName = process.env.USER_TABLE_NAME!;
    const roleTableName = process.env.ROLE_TABLE_NAME!;

    if (!userId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: "User ID is required" }),
      };
    }

    // Get user data
    const userCommand = new GetCommand({
      TableName: userTableName,
      Key: {
        userId: userId,
      },
    });

    const userResult = await docClient.send(userCommand);

    if (!userResult.Item) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: "User not found",
        }),
      };
    }

    // Get role data
    const roleCommand = new GetCommand({
      TableName: roleTableName,
      Key: {
        roleId: userResult.Item.roleId,
      },
    });

    const roleResult = await docClient.send(roleCommand);
    const role = roleResult.Item as Role;

    // Combine user and role data
    const responseData = {
      ...userResult.Item,
      roleName: role?.name || "Unknown Role",
      privileges: role?.privileges || {
        canRead: false,
        canUpload: false,
        canDelete: false,
        canShare: false,
      },
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(responseData),
    };
  } catch (error) {
    console.error("Error getting user:", error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: "Error getting user" }),
    };
  }
};
