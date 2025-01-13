import Table, {
  SelectionChangeDetail,
} from "@aws-northstar/ui/components/Table";
import {
  Box,
  Button,
  Container,
  ContentLayout,
  Header,
  SpaceBetween,
  Toggle,
} from "@cloudscape-design/components";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { ApiService } from "../../../services/ApiService";
import { AppContext } from "../../common/AppLayout/context";

const EditUser: FunctionComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  const { setBreadcrumb } = useContext(AppContext);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isError, setError] = useState<boolean>(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>(
    user?.roleName || ""
  );
  const [selectedRoleId, setSelectedRoleId] = useState<string>(
    user?.roleId || ""
  );
  const [isUserActive, setIsUserActive] = useState<boolean>(
    user?.status || false
  );
  const [isNewFeatureEnabled, setIsNewFeatureEnabled] =
    useState<boolean>(false);

  const api = ApiService.getInstance();

  const init = async () => {
    try {
      setBreadcrumb([
        { text: "Home", href: "/" },
        { text: "My Users", href: "/my-users" },
        { text: "Users", href: "/users" },
        { text: "Edit user", href: "/edit-user" },
      ]);

      // Fetch roles
      const rolesList = await api.getRoles();
      setRoles(rolesList);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = async (roleId: string) => {
    try {
      const selectedRoleData = roles.find((role) => role.roleId === roleId);
      if (selectedRoleData) {
        setSelectedRole(selectedRoleData.name);
        setSelectedRoleId(selectedRoleData.roleId);
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    }
  };

  const handleStatusToggle = async () => {
    try {
      const status = !isUserActive;
      setIsUserActive(status);
      toast.success("User status updated successfully");
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
      // setIsUserActive(!status);
    }
  };

  const handleSubmit = async () => {
    try {
      // Use either newly selected role data or existing role data from user
      const roleIdToSend = selectedRoleId || user.roleId;
      const roleNameToSend = selectedRole || user.roleName;

      await api.updateUser(user.userId, {
        userId: user.userId,
        username: user.username,
        status: isUserActive ? "ACTIVE" : "INACTIVE",
        roleId: roleIdToSend,
        roleName: roleNameToSend,
        // privileges: user.privileges,
        createdAt: user.createdAt,
        updatedAt: new Date().toISOString(),
      });
      toast.success("User updated successfully");
      navigate("/users");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  useEffect(() => {
    init();
  }, []);

  const columnDefinitions = [
    {
      cell: (role: Role) => {
        // Add default empty privileges if none exist
        const privileges = role.privileges || {
          canDelete: false,
          canRead: false,
          canUpload: false,
          canShare: false,
        };

        // Get only the enabled privileges
        const enabledPrivileges = Object.entries(role.privileges)
          .filter(([_, value]) => value)
          .map(([key]) => {
            return key.replace("can", "");
          });

        const tooltipText = enabledPrivileges.length
          ? enabledPrivileges.join("\n")
          : "No privileges assigned";

        return (
          <div style={{ position: "relative" }}>
            <span style={{ cursor: "help" }} title={tooltipText}>
              {role.name}
            </span>
          </div>
        );
      },
      header: "Role Name",
      id: "name",
      sortingField: "name",
      width: 400,
    },
    {
      cell: (role: Role) => (
        <input
          type="radio"
          checked={
            selectedRoleId
              ? selectedRoleId === role.roleId
              : user.roleId === role.roleId
          }
          onChange={() => handleRoleSelect(role.roleId)}
          name="roleSelection"
        />
      ),
      header: "Select",
      id: "select",
      width: 100,
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  return (
    <ContentLayout header={<Header variant="h1">User Details</Header>}>
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Header variant="h1">{user.username}</Header>
            <div style={{ fontSize: "16px", color: "gray" }}>
              {user.roleName}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "8px", color: "red" }}>Inactive</span>
            <Toggle
              onChange={({ detail }) => handleStatusToggle()}
              checked={isUserActive}
            />
            <span style={{ marginLeft: "8px", color: "green" }}>Active</span>
          </div>
        </div>
      </Container>
      <Box margin={{ bottom: "l" }} />
      <Table
        trackBy="RoleId"
        columnDefinitions={columnDefinitions}
        header="Available Roles"
        items={roles}
        disableRowSelect={true}
        disableFilters={true}
      />
      <Button
        variant="primary"
        onClick={handleSubmit}
        // onClick={handleSubmit}
        // loading={isSubmitting}
        // disabled={isSubmitting}
      >
        Update User
      </Button>
    </ContentLayout>
  );
};

export default EditUser;
