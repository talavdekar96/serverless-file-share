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
  Toggle,
} from "@cloudscape-design/components";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { formatBytes } from "../../../helpers/util";
import { ApiService } from "../../../services/ApiService";
import { AppContext } from "../../common/AppLayout/context";

const EditUsers: FunctionComponent = () => {
  const navigate = useNavigate();
  const { setBreadcrumb } = useContext(AppContext);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isError, setError] = useState<boolean>(false);
  const [users, setUsers] = useState<UserList[]>([]);

  const api = ApiService.getInstance();

  const init = async () => {
    try {
      setBreadcrumb([
        { text: "Home", href: "/" },
        { text: "My Users", href: "/users" },
        { text: "Edit user", href: "/edit-users" },
      ]);

      fetchUsers();
      // console.log('Users API response:', usersList);
      // setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (
    userId: string,
    updates: Partial<UserList>
  ) => {
    try {
      const apiService = ApiService.getInstance();
      await apiService.updateUser(userId, updates);

      // Refresh the users list after update
      fetchUsers();

      // Show success message
      toast.success("User updated successfully");
    } catch (error: any) {
      console.error("Error updating user:", error);
      if (error?.response?.status === 403) {
        toast.error("You do not have permission to update users");
      } else {
        toast.error("Failed to update user");
      }
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersList = await api.getUsers();
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(true);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handlePrivilegeChange = async (
    userId: string,
    privilege: keyof UserList["privileges"],
    value: boolean
  ) => {
    const user = users.find((u) => u.userId === userId);
    if (!user) return;

    const updates: Partial<UserList> = {
      privileges: {
        canDelete: user.privileges?.canDelete || false,
        canRead: user.privileges?.canRead || false,
        canUpload: user.privileges?.canUpload || false,
        canShare: user.privileges?.canShare || false,
        [privilege]: value,
      },
    };

    await handleUpdateUser(userId, updates);
  };

  const handleStatusChange = async (
    userId: string,
    status: "ACTIVE" | "INACTIVE"
  ) => {
    try {
      // Send the status update
      await handleUpdateUser(userId, {
        status, // This will be { status: "ACTIVE" } or { status: "INACTIVE" }
      });

      // Fetch updated user list
      await fetchUsers();
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast.error("Failed to update user status");
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    await handleUpdateUser(userId, { role });
  };

  const columnDefinitions = [
    {
      cell: (user: UserList) => user.username,
      header: "User Name",
      id: "name",
      sortingField: "name",
      width: 400,
    },
    {
      cell: (user: UserList) => (
        <Toggle
          checked={user.status === "ACTIVE"}
          onChange={({ detail }) => {
            handleStatusChange(
              user.userId,
              detail.checked ? "ACTIVE" : "INACTIVE"
            );
          }}
        />
      ),
      header: "Status",
      id: "status",
      sortingField: "status",
      width: 400,
    },
    {
      cell: (user: UserList) => {
        return (
          <Button
            onClick={() => {
              // For now, let's just update the status as an example
              handleUpdateUser(user.userId, {
                status: user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
              });
            }}
            variant="primary"
          >
            Update
          </Button>
        );
      },
      header: "Update",
      id: "update",
      width: 200,
    },
    // ... rest of the column definitions
  ];

  const onCreateClick = () => {
    navigate("/create-group");
  };

  // const refresh = async () => {
  //   const sharedFiles = await api.getSharedFiles(true);
  // };

  useEffect(() => {
    init();
  }, []);

  return (
    <ContentLayout header={<Header variant="h1">Manage existing users</Header>}>
      <Table
        trackBy="id"
        columnDefinitions={columnDefinitions}
        header="Users"
        items={users}
        disableRowSelect={true}
      />
    </ContentLayout>
  );
};

export default EditUsers;
