import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { Privileges } from "../../types";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Get roleId from path parameters
    const roleId = event.pathParameters?.roleId;

    if (!roleId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "roleId is required" }),
      };
    }
    const { name, privileges } = JSON.parse(event.body || "{}");
    const tableName = process.env.ROLE_TABLE_NAME;

    // Validate privileges object
    if (!isValidPrivilege(privileges)) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message:
            "Invalid privileges format. Privileges must contain canRead, canUpload, canDelete, and canShare",
        }),
      };
    }

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

    const timestamp = new Date().toISOString();

    const updateResult = await docClient.send(
      new UpdateCommand({
        TableName: tableName,
        Key: { roleId },
        UpdateExpression:
          "set #name = :name, #privileges = :privileges, updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#name": "name",
          "#privileges": "privileges",
        },
        ExpressionAttributeValues: {
          ":name": name,
          ":privileges": privileges,
          ":updatedAt": timestamp,
        },
        ReturnValues: "ALL_NEW",
      }),
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(updateResult.Attributes),
    };
  } catch (error) {
    console.error("Error updating role:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Error creating role",
        error: (error as Error).message,
      }),
    };
  }
};

function isValidPrivilege(privilege: any): privilege is Privileges {
  return (
    privilege &&
    typeof privilege.canRead === "boolean" &&
    typeof privilege.canUpload === "boolean" &&
    typeof privilege.canDelete === "boolean" &&
    typeof privilege.canShare === "boolean"
  );
}
