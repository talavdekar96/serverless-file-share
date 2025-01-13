import { DynamoDB } from "aws-sdk";
import { User } from "../types/user";

const dynamoDB = new DynamoDB.DocumentClient();
const USER_TABLE_NAME = process.env.USER_TABLE_NAME!;

export async function getUserById(userId: string): Promise<User | null> {
  const result = await dynamoDB
    .get({
      TableName: USER_TABLE_NAME,
      Key: { userId },
    })
    .promise();

  return (result.Item as User) || null;
}

export async function getUserByUsername(
  username: string,
): Promise<User | null> {
  const result = await dynamoDB
    .query({
      TableName: USER_TABLE_NAME,
      IndexName: "username-index",
      KeyConditionExpression: "username = :username",
      ExpressionAttributeValues: {
        ":username": username,
      },
    })
    .promise();

  return (result.Items?.[0] as User) || null;
}
