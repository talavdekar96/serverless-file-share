import {
  Alert,
  Box,
  SpaceBetween,
  Spinner,
} from "@cloudscape-design/components";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ApiService } from "../../../services/ApiService";

export const Download = () => {
  const [isError, setError] = useState(false);
  const { fileId } = useParams();

  const init = async () => {
    const api = ApiService.getInstance();

    try {
      // Get location before making API call
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipResponse.json();
      const userIp = ipData.ip;

      // retrieve s3 presigned download url via api
      const downloadUrl = await api.getDownloadUrl(
        fileId!,
        position.coords.latitude.toString(),
        position.coords.longitude.toString(),
        userIp
      );

      // redirect to download url
      window.location.href = downloadUrl;
    } catch (err) {
      console.error("Download error:", err);
      setError(true);
    }
  };

  useEffect(() => {
    init();
  }, []);

  if (isError) {
    return (
      <Alert statusIconAriaLabel="Error" type="error" header="Access denied">
        You do not have access to this file or the file has been removed.
      </Alert>
    );
  }

  return (
    <SpaceBetween size="s">
      <Box textAlign="center">
        <Spinner size="large" />
      </Box>
      <Box textAlign="center">Loading file...</Box>
    </SpaceBetween>
  );
};

export default Download;
