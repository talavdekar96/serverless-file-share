import Table, {
  SelectionChangeDetail,
} from "@aws-northstar/ui/components/Table";
import {
  Box,
  Button,
  ContentLayout,
  Header,
  Link,
  SpaceBetween,
} from "@cloudscape-design/components";
// import { NonCancelableEventHandler } from "@cloudscape-design/components/internal/events";
import moment from "moment";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { formatBytes } from "../../../helpers/util";
import { ApiService } from "../../../services/ApiService";
import { AppContext } from "../../common/AppLayout/context";

interface GroupResponse {
  groups: Group[];
  count: number;
  createdBy: string;
}

const UserGroup: FunctionComponent = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]); // Changed back to groups
  const [error, setError] = useState<string | null>(null);
  const { setBreadcrumb } = useContext(AppContext);

  const api = ApiService.getInstance();

  const init = async () => {
    setBreadcrumb([
      { text: "Home", href: "/" },
      { text: "My Users", href: "/users" },
      { text: "Groups", href: "/user-group" },
    ]);

    setLoading(true);
    setError(null);
    try {
      const response = await api.getGroups();
      if (response && Array.isArray(response.groups)) {
        setGroups(response.groups);
      } else {
        setGroups([]);
        setError("Invalid response format from server");
      }
    } catch (error) {
      console.error("Failed to fetch groups:", error);
      setError("Failed to load groups. Please try again later.");
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const columnDefinitions = [
    {
      cell: (group: Group) => (
        <span className="text-link">
          <Link
            onFollow={() => {
              console.log("Navigating to edit with group:", group);
              navigate(`/edit-group/${group.groupId}`, {
                state: {
                  group: {
                    ...group,
                    groupId: group.groupId,
                    name: group.name,
                    description: group.description,
                    members: group.members || [],
                  },
                },
              });
            }}
          >
            {group.name}
          </Link>
        </span>
      ),
      header: "Name",
      id: "name",
      sortingField: "name",
      width: 300,
    },
    {
      cell: (group: Group) => group.members.length,
      header: "Members",
      id: "members",
      sortingField: "members",
      align: "center",
      width: 150,
    },
    {
      cell: (group: Group) => moment(group.createdAt).format("MMM D, YYYY"),
      header: "Created",
      id: "createdAt",
      sortingField: "createdAt",
      align: "center",
      width: 150,
    },
  ];

  const onCreateClick = () => {
    navigate("/create-group");
  };

  // const refresh = async () => {
  //   //   setLoading(true);
  //   const sharedFiles = await api.getSharedFiles(true);
  //   //   setFiles(sharedFiles);
  //   //   setLoading(false);
  // };

  useEffect(() => {
    init();
  }, []);

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          actions={
            <Button onClick={onCreateClick} variant="primary">
              Create Group
            </Button>
          }
        >
          Groups
        </Header>
      }
    >
      {error && (
        <Box
          color="text-status-error"
          textAlign="center"
          padding={{ bottom: "s" }}
        >
          {error}
        </Box>
      )}
      <Table
        trackBy="groupId"
        columnDefinitions={columnDefinitions}
        items={groups || []} // Ensure we always pass an array
        loading={isLoading}
        loadingText="Loading groups..."
        empty={
          <Box textAlign="center" color="inherit">
            <b>No groups</b>
            <Box padding={{ bottom: "s" }} variant="p" color="inherit">
              No groups to display.
            </Box>
          </Box>
        }
        header="Groups"
        disableRowSelect={true}
      />
    </ContentLayout>
  );
};

export default UserGroup;
