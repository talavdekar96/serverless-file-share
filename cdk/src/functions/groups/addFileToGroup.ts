import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { GroupMember } from "../../types";

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const groupId = event.pathParameters?.groupId;
    const { fileId } = JSON.parse(event.body || "{}");
    const userId = event.requestContext.authorizer?.claims?.sub;

    if (!groupId || !fileId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Group ID and File ID are required" }),
      };
    }

    // Get the group data
    const result = await dynamoDB
      .get({
        TableName: process.env.USER_GROUP_TABLE_NAME!,
        Key: {
          groupId,
          userId,
        },
      })
      .promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Group not found or user not authorized",
        }),
      };
    }

    const groupData = result.Item.groupData;

    // Add file to group's files array
    groupData.files = [...(groupData.files || []), fileId];

    // Update all group member records with new file
    const updatePromises = groupData.members.map((member: GroupMember) =>
      dynamoDB
        .update({
          TableName: process.env.USER_GROUP_TABLE_NAME!,
          Key: {
            groupId,
            userId: member.userId,
          },
          UpdateExpression: "SET groupData = :groupData",
          ExpressionAttributeValues: {
            ":groupData": groupData,
          },
        })
        .promise(),
    );

    await Promise.all(updatePromises);

    return {
      statusCode: 200,
      body: JSON.stringify(groupData),
    };
  } catch (error) {
    console.error("Error adding file to group:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error adding file to group" }),
    };
  }
};
