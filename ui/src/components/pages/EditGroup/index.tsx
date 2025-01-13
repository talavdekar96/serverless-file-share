import Table from "@aws-northstar/ui/components/Table";
import {
  Button,
  ContentLayout,
  FormField,
  Header,
  Select,
  SpaceBetween,
} from "@cloudscape-design/components";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ApiService } from "../../../services/ApiService";
import { AppContext } from "../../common/AppLayout/context";

const EditGroup: FunctionComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const group = location.state?.group;

  const [isLoading, setLoading] = useState<boolean>(true);
  const [isError, setError] = useState<boolean>(false);
  const [usersList, setUsersList] = useState<UserList[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [members, setMembers] = useState<GroupMember[]>(group?.members || []);
  const { setBreadcrumb } = useContext(AppContext);
  const api = ApiService.getInstance();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await api.getUsers();
        setUsersList(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    if (selectedUser) {
      const userToAdd = usersList.find((user) => user.userId === selectedUser);
      if (
        userToAdd &&
        !members.some((member) => member.userId === userToAdd.userId)
      ) {
        const newMember: GroupMember = {
          userId: userToAdd.userId,
          username: userToAdd.username,
          addedAt: new Date().toISOString(),
          notify: false,
        };
        setMembers([...members, newMember]);
        setSelectedUser("");
      }
    }
  };

  const availableUsers = usersList.filter(
    (user) => !members.some((member) => member.userId === user.userId)
  );

  const handleRemoveUser = (userId: string) => {
    setMembers(members.filter((member) => member.userId !== userId));
  };

  const handleSubmit = async () => {
    try {
      if (!group.groupId) {
        console.error("No group ID found");
        return;
      }

      // Debug logs
      console.log("GroupId:", group.groupId);
      console.log("Group data being sent:", {
        name: group.name,
        description: group.description,
        members: members,
      });

      await api.updateGroup(group.groupId, {
        name: group.name,
        description: group.description,
        members: members,
      });

      // navigate('/user-group');
      navigate("/user-group", { replace: true });
    } catch (error: any) {
      // Improved error handling
      console.error("Error updating group:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update group";
      setError(true);
      // Optionally add a way to display this error to the user
    }
  };

  const columnDefinitions = [
    {
      cell: (member: GroupMember) => <span>{member.username}</span>,
      header: "Username",
      id: "username",
      sortingField: "username",
      width: 300,
    },
    {
      cell: (member: GroupMember) => <span>{member.addedAt}</span>,
      header: "Added At",
      id: "addedAt",
      sortingField: "addedAt",
      width: 200,
    },
    {
      cell: (member: GroupMember) => (
        <Button
          onClick={() => handleRemoveUser(member.userId)}
          variant="primary"
        >
          Remove
        </Button>
      ),
      header: "Actions",
      id: "actions",
      width: 150,
    },
  ];

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description={`Manage members for ${group?.name || "Unknown Group"}`}
        >
          Edit User Group: {group?.name || "Unknown Group"}
        </Header>
      }
    >
      <SpaceBetween size="l">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
          }}
        >
          <div style={{ flex: 2, paddingLeft: "20px" }}>
            <FormField label="Select User" controlId="user-select">
              <Select
                selectedOption={
                  selectedUser
                    ? {
                        label:
                          usersList.find((user) => user.userId === selectedUser)
                            ?.username || "",
                        value: selectedUser,
                      }
                    : null
                }
                onChange={({ detail }) =>
                  setSelectedUser(detail.selectedOption?.value || "")
                }
                options={availableUsers
                  .sort((a, b) => a.username.localeCompare(b.username))
                  .map((user) => ({
                    label: user.username,
                    value: user.userId,
                  }))}
                placeholder="Choose a user"
                filteringType="auto"
                filteringPlaceholder="Find a user"
                filteringAriaLabel="Filter users"
              />
            </FormField>
          </div>
          <Button onClick={handleAddUser} disabled={!selectedUser}>
            Add recipient
          </Button>
        </div>
        <Table
          columnDefinitions={columnDefinitions}
          header="Members"
          items={members}
          disableRowSelect={true}
          disableFilters={true}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </SpaceBetween>
    </ContentLayout>
  );
};

export default EditGroup;
