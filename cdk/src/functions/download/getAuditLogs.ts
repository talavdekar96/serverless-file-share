import { APIGatewayProxyEvent } from "aws-lambda";
import { getAuditLogs } from "../../lib/database";
import { wrapHandler } from "../../lib/observability";

const lambdaHandler = async (event: APIGatewayProxyEvent) => {
  const limit = event.queryStringParameters?.limit 
    ? parseInt(event.queryStringParameters.limit) 
    : 50;
    
  const lastEvaluatedKey = event.queryStringParameters?.lastEvaluatedKey 
    ? JSON.parse(decodeURIComponent(event.queryStringParameters.lastEvaluatedKey))
    : undefined;

  const auditLogs = await getAuditLogs(limit, lastEvaluatedKey);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*"
    },
    body: JSON.stringify(auditLogs)
  };
};

export const handler = wrapHandler(lambdaHandler); 