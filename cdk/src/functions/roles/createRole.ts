import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { Role, Privileges } from "../../types";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
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

    const roleId = uuidv4();
    const timestamp = new Date().toISOString();

    const role: Role = {
      roleId,
      name,
      privileges: privileges as Privileges,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await docClient.send(
      new PutCommand({
        TableName: tableName,
        Item: role,
      }),
    );

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(role),
    };
  } catch (error) {
    console.error("Error creating role:", error);
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

// Helper function to validate privilege structure
function isValidPrivilege(privilege: any): privilege is Privileges {
  return (
    privilege &&
    typeof privilege.canRead === "boolean" &&
    typeof privilege.canUpload === "boolean" &&
    typeof privilege.canDelete === "boolean" &&
    typeof privilege.canShare === "boolean"
  );
}
