import { wrapHandler } from "../../lib/observability";
import { ShareRequestWithUserAndFileInfo } from "../../types";
import { PinpointClient, SendMessagesCommand } from "@aws-sdk/client-pinpoint";

const pinpoint = new PinpointClient({ region: "ap-south-1" });
const PROJECT_ID = "f3509ea4d0ba4b67a9a02cc53e8b9307";

const API_URL = process.env.API_URL;
console.log("API URL", API_URL);

const lambdaHandler = async (
  event: ShareRequestWithUserAndFileInfo,
): Promise<ShareRequestWithUserAndFileInfo> => {
  const { fileId, user, recipients } = event;

  for (const recipient of recipients) {
    if (!recipient.notify) continue;

    // const downloadLink = `${API_URL}/download?fileId=${fileId}&ownerId=${user.id}`;
    const downloadLink = "https://d3nnye8oytn3kc.cloudfront.net";
    console.log("Download link", downloadLink);
    
    const htmlBody = `
      <html>
        <body>
          <h1>Hello,</h1>
          <p>You can download your file using the following link:</p>
          <a href="${downloadLink}">Download Link</a>
        </body>
      </html>
    `;

    const textBody = `Hello,\nYou can download your file using the following link: ${downloadLink}`;

    const command = new SendMessagesCommand({
      ApplicationId: PROJECT_ID,
      MessageRequest: {
        Addresses: {
          [recipient.recipientEmail]: {
            ChannelType: 'EMAIL'
          }
        },
        MessageConfiguration: {
          EmailMessage: {
            FromAddress: user.email,
            SimpleEmail: {
              Subject: {
                Charset: 'UTF-8',
                Data: 'Download Link for Your File'
              },
              HtmlPart: {
                Charset: 'UTF-8',
                Data: htmlBody
              },
              TextPart: {
                Charset: 'UTF-8',
                Data: textBody
              }
            }
          }
        }
      }
    });

    try {
      console.log("Sending command:", JSON.stringify(command, null, 2));
      const response = await pinpoint.send(command);
      console.log('Email sent successfully:', JSON.stringify(response, null, 2));
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
  console.log("Received event:", JSON.stringify(event, null, 2));
  return event;
};

export const handler = wrapHandler(lambdaHandler);
