import Table from "@aws-northstar/ui/components/Table";
import { ContentLayout, Header } from "@cloudscape-design/components";
import moment from "moment";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { ApiService } from "../../../services/ApiService";
import { AppContext } from "../../common/AppLayout/context";

const Logs: FunctionComponent = () => {
  const { setBreadcrumb } = useContext(AppContext);
  const [isLoading, setLoading] = useState(true);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState<string>();

  const api = ApiService.getInstance();

  const init = async () => {
    setBreadcrumb([
      { text: "Home", href: "/" },
      { text: "Logs", href: "/logs" },
    ]);

    fetchLogs();
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await api.getAuditLogs(50, lastEvaluatedKey);
      setLogs(response.items);
      setLastEvaluatedKey(
        response.lastEvaluatedKey
          ? JSON.stringify(response.lastEvaluatedKey)
          : undefined
      );
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  const columnDefinitions = [
    {
      id: "filename",
      header: "File Name",
      cell: (log: AuditLog) => log.filename,
    },
    {
      id: "username",
      header: "User",
      cell: (log: AuditLog) => log.username,
    },
    {
      id: "ipAddress",
      header: "IP Address",
      cell: (log: AuditLog) => log.ipAddress || "N/A",
    },
    {
      id: "dateTimeStamp",
      header: "Download Date",
      cell: (log: AuditLog) =>
        moment(log.dateTimeStamp).format("MMM D, YYYY h:mm A"),
    },
  ];

  useEffect(() => {
    init();
  }, []);

  return (
    <ContentLayout header={<Header variant="h1">Download Logs</Header>}>
      <Table
        columnDefinitions={columnDefinitions}
        items={logs}
        loading={isLoading}
        loadingText="Loading logs..."
        empty={<div>No logs found</div>}
      />
    </ContentLayout>
  );
};

export default Logs;
