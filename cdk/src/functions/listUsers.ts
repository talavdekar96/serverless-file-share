import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { Role } from "../types";

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const userTableName = process.env.USER_TABLE_NAME;
    const roleTableName = process.env.ROLE_TABLE_NAME;

    if (!userTableName || !roleTableName) {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Required environment variables are not defined",
        }),
      };
    }

    // Get users
    const userCommand = new ScanCommand({
      TableName: userTableName,
      ProjectionExpression:
        "userId, username, #status, roleId, createdAt, updatedAt",
      ExpressionAttributeNames: {
        "#status": "status",
      },
    });

    // Execute the command
    const userResponse = await docClient.send(userCommand);

    // Format the response
    const users = userResponse.Items || [];

    // Get role details for each user
    const usersWithRoles = await Promise.all(
      users.map(async (user) => {
        try {
          const roleCommand = new GetCommand({
            TableName: roleTableName,
            Key: { roleId: user.roleId },
          });

          const roleResponse = await docClient.send(roleCommand);
          const role = roleResponse.Item as Role;

          return {
            ...user,
            roleName: role?.name || "Unknown Role", // Add role name to user object
            privileges: role?.privileges || {
              // Single privileges object from role
              canRead: false,
              canUpload: false,
              canDelete: false,
              canShare: false,
            },
          };
        } catch (error) {
          console.error(`Error fetching role for user ${user.userId}:`, error);
          return {
            ...user,
            roleName: "Unknown Role",
            privileges: {
              canRead: false,
              canUpload: false,
              canDelete: false,
              canShare: false,
            },
          };
        }
      }),
    );
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        users: usersWithRoles,
        count: usersWithRoles.length,
      }),
    };
  } catch (error) {
    console.error("Error listing users:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Error listing users",
        error: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};
