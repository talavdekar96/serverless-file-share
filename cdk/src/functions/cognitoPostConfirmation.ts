import { PostConfirmationTriggerEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { User, UserStatus } from "../types/user";
import { Role } from "../types";

const dynamoDB = new DynamoDB.DocumentClient();
const USER_TABLE_NAME = process.env.USER_TABLE_NAME!;
const ROLE_TABLE_NAME = process.env.ROLE_TABLE_NAME!;
const DEFAULT_ROLE_NAME = "user";

export const handler = async (event: PostConfirmationTriggerEvent) => {
  try {
    console.log('Environment variables:', {
      USER_TABLE_NAME,
      ROLE_TABLE_NAME,
    });

    const timestamp = new Date().toISOString();

    // Fetch the default user role from the Role table
    const scanParams = {
      TableName: ROLE_TABLE_NAME,
      FilterExpression: "#name = :roleName",
      ExpressionAttributeNames: {
        "#name": "name",
      },
      ExpressionAttributeValues: {
        ":roleName": DEFAULT_ROLE_NAME,
      },
    };
    
    console.log('Scan params:', scanParams);
    
    const defaultRoleResponse = await dynamoDB
      .scan(scanParams)
      .promise();

    if (!defaultRoleResponse.Items || defaultRoleResponse.Items.length === 0) {
      throw new Error("Default user role not found in Role table");
    }

    const defaultRole = defaultRoleResponse.Items[0] as Role;

    const newUser: User = {
      userId: event.request.userAttributes.sub,
      username: event.request.userAttributes.email,
      status: UserStatus.ACTIVE,
      roleId: defaultRole.roleId,
      privileges: defaultRole.privileges || {
        canRead: true,
        canUpload: true,
        canDelete: false,
        canShare: true,
      },
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await dynamoDB
      .put({
        TableName: USER_TABLE_NAME,
        Item: newUser,
      })
      .promise();

    return event;
  } catch (error) {
    console.error("Error in post confirmation:", error);
    throw error;
  }
};
