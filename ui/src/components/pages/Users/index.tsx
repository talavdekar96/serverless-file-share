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
import { start } from "repl";

import { formatBytes } from "../../../helpers/util";
import { ApiService } from "../../../services/ApiService";
import { AppContext } from "../../common/AppLayout/context";

const Users: FunctionComponent = () => {
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
        { text: "My Users", href: "/my-users" },
        { text: "Users", href: "/users" },
      ]);

      fetchUsers();
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
      cell: (user: UserList) => (
        <span className="text-link">
          <Link
            onFollow={() => {
              console.log("Navigating to edit with user:", user);
              navigate(`/edit-user/${user.userId}`, {
                state: {
                  user: {
                    ...user,
                    userId: user.userId,
                    name: user.username,
                    start: user.status,
                    role: user.roleName,
                    roleId: user.roleId,
                  },
                },
              });
            }}
          >
            {user.username}
          </Link>
        </span>
      ),
      header: "User Name",
      id: "name",
      sortingField: "name",
      width: 300,
    },
    {
      cell: (user: UserList) => user.status,
      header: "Status",
      id: "status",
      sortingField: "status",
      width: 400,
    },
    {
      cell: (user: UserList) => user.roleName,
      header: "Assigned Role",
      id: "role",
      sortingField: "role",
      width: 400,
    },
  ];

  const onCreateClick = () => {
    navigate("/create-group");
  };

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

export default Users;
