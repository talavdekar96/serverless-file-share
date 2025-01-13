import { recordDownload } from "../../lib/database";
import { wrapHandler } from "../../lib/observability";
import { DownloadEventWithUserAndFileInfo } from "../../types";

const lambdaHandler = async (
  event: DownloadEventWithUserAndFileInfo,
): Promise<DownloadEventWithUserAndFileInfo> => {
  const { fileId, userId, latitude, longitude, ipAddress } = event;
  const dateTimeStamp = new Date().toISOString();

  console.log(latitude);
  console.log(longitude);
  console.log(ipAddress);

  // Record download request to database
  await recordDownload(fileId, userId, dateTimeStamp, latitude, longitude, ipAddress);

  return event;
};

export const handler = wrapHandler(lambdaHandler);
