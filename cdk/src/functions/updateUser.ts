import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  UpdateCommand,
  GetCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { Role } from "../types";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const targetUserId = event.pathParameters?.userId;
    const updates = JSON.parse(event.body || "{}");
    const userTableName = process.env.USER_TABLE_NAME;
    const roleTableName = process.env.ROLE_TABLE_NAME;

    console.log("Target userId:", targetUserId);
    console.log("Table name:", userTableName);
    if (!targetUserId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "userId is required in path parameters",
        }),
      };
    }

    
    // If roleId is being updated, verify that the role exists
    if (updates.roleId) {
      const roleCommand = new GetCommand({
        TableName: roleTableName,
        Key: { roleId: updates.roleId },
      });

      const roleResult = await docClient.send(roleCommand);

      if (!roleResult.Item) {
        return {
          statusCode: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ message: "Invalid roleId provided" }),
        };
      }

      // Get the privileges from the role
      const role = roleResult.Item as Role;
      updates.privileges = role.privileges; // Using first set of privileges
    }

    // Prepare update expression
    let updateExpression = "SET updatedAt = :updatedAt";
    const expressionAttributeValues: any = {
      ":updatedAt": new Date().toISOString(),
    };
    const expressionAttributeNames: any = {};

    if (updates.status) {
      updateExpression += ", #status = :status";
      expressionAttributeValues[":status"] = updates.status;
      expressionAttributeNames["#status"] = "status";
    }

    if (updates.roleId) {
      updateExpression += ", roleId = :roleId";
      expressionAttributeValues[":roleId"] = updates.roleId;
    }

    if (updates.privileges) {
      updateExpression += ", #privileges = :privileges";
      expressionAttributeValues[":privileges"] = updates.privileges;
      expressionAttributeNames["#privileges"] = "privileges";
    }

    // Add before the UpdateCommand
 
    // Create update command
    const updateCommand = new UpdateCommand({
      TableName: userTableName,
      Key: { userId: targetUserId },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: "ALL_NEW",
    });
    console.log("Update params:", JSON.stringify(updateCommand.input, null, 2));
    const result = await docClient.send(updateCommand);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Error updating user",
        error: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};
