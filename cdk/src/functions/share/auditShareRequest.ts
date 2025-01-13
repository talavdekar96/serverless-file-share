import { wrapHandler } from "../../lib/observability";
import { ShareRequestWithUserAndFileInfo } from "../../types";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.AUDIT_SHARE_TABLE;

const lambdaHandler = async (
  event: ShareRequestWithUserAndFileInfo,
): Promise<ShareRequestWithUserAndFileInfo> => {
  console.log("Received event:", JSON.stringify(event)); // Log the incoming event
  const { fileId, user, recipients, expiryDate, downloadLimit } = event;
  
  for (const recipient of recipients) {
    const metadata = {
      fileId,
      auditId: uuidv4(),
      recipientEmail: recipient.recipientEmail,
      ownerEmail: user.email,
      ownerName: user.name,
      notify: recipient.notify || false,
      expiryDate: expiryDate || "",
      expiryDateEnabled: !!expiryDate,
      downloadLimit: downloadLimit ? downloadLimit.toString() : "0",
      downloadLimitEnabled: !!downloadLimit,
      ownerId: user.id,
      dateShared: new Date().toISOString(),
    };
    console.log("Metadata for recipient:", JSON.stringify(metadata)); // Log metadata for each recipient
    await dynamodb.send(
      new PutCommand({
      TableName: TABLE_NAME,
      Item: metadata
    })
    );
  }

  return event;
};

export const handler = wrapHandler(lambdaHandler);
