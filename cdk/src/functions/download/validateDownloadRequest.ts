import * as joi from "joi";

import { wrapHandler } from "../../lib/observability";
import { DownloadRequest } from "../../types";

const lambdaHandler = async (
  event: DownloadRequest,
): Promise<DownloadRequest> => {
  // check if input has required fields
  const inputSchema = joi.object({
    userId: joi.string().required(),
    fileId: joi.string().required(),
    latitude: joi.string().optional(),
    longitude: joi.string().optional(),
    ipAddress: joi.string().optional(),
  });

  // validate event
  const { error } = inputSchema.validate(event);

  if (error) {
    throw new Error("Download request is invalid");
  }

  return event;
};

export const handler = wrapHandler(lambdaHandler);
