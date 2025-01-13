import Table from "@aws-northstar/ui/components/Table";
import {
  Box,
  Button,
  ContentLayout,
  Form,
  FormField,
  Header,
  Input,
  Modal,
  Select,
  SpaceBetween,
} from "@cloudscape-design/components";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Local imports
import { ApiService } from "../../../services/ApiService";
import { AppContext } from "../../common/AppLayout/context";

interface GroupUser {
  userId: string;
  name: string;
}

interface Recipient {
  username: string;
}

interface GroupMember {
  userId: string;
  username: string;
  addedAt: string;
  notify: boolean;
}

interface CreateGroupRequest {
  name: string;
  description: string;
  members: GroupMember[];
}

const CreateGroup: FunctionComponent = () => {
  const [users, setUsers] = useState<GroupUser[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([{ username: "" }]);
  const navigate = useNavigate();
  const { setBreadcrumb } = useContext(AppContext);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isError, setError] = useState<boolean>(false);
  const [groupName, setGroupName] = useState("");
  const [groupdescription, setGroupDescription] = useState("");
  const [availableUsers, setAvailableUsers] = useState<string[]>([]);
  const [usersList, setUsersList] = useState<UserList[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const api = ApiService.getInstance();

  const handleAddRecipient = () => {
    const usernameToAdd = recipients[0].username.trim();
    if (!usernameToAdd || usernameToAdd.length === 0) {
      return;
    }

    // Update to use userId from the usersList
    const selectedUser = usersList.find(
      (user) => user.username === usernameToAdd
    );
    if (!selectedUser) return;

    setUsers([
      ...users,
      {
        userId: selectedUser.userId, // Changed from fileId
        name: usernameToAdd,
      },
    ]);

    setAvailableUsers(availableUsers.filter((user) => user !== usernameToAdd));

    // Reset form fields
    setRecipients([
      {
        username: "",
      },
    ]);
  };

  const handleNameChange = (value: string) => {
    setGroupName(value);
  };

  const handleDescriptionChange = (value: string) => {
    setGroupDescription(value);
  };

  const handleInputChange = (
    index: number,
    field: keyof Recipient,
    value: string | boolean
  ) => {
    const sanitizedValue =
      typeof value === "string" ? value.trimStart() : value;
    const updatedRecipients = [...recipients];
    updatedRecipients[index] = {
      ...updatedRecipients[index],
      [field]: value as Recipient[keyof Recipient],
    };
    setRecipients(updatedRecipients);
  };

  const handleRemoveUser = (userId: string) => {
    // Changed parameter type
    const removedUser = users.find((user) => user.userId === userId);

    if (removedUser) {
      setAvailableUsers([...availableUsers, removedUser.name]);
    }

    setUsers(users.filter((user) => user.userId !== userId));
  };

  const handleSubmit = async () => {
    try {
      const groupRequest: CreateGroupRequest = {
        name: groupName,
        description: groupdescription,
        members: users.map((user) => ({
          userId: user.userId.toString(),
          username: user.name,
          addedAt: new Date().toISOString(),
          notify: false,
        })),
      };

      await ApiService.getInstance().createGroup(groupRequest);
      setShowSuccessDialog(true);
      // Optionally add success notification or redirect
    } catch (error) {
      console.error("Failed to create group:", error);
      // Handle error (show error message to user)
    }
  };

  const handleSuccessConfirmation = () => {
    // Replace current history entry and navigate to home
    navigate("/", { replace: true });
  };

  const init = async () => {
    try {
      setBreadcrumb([
        { text: "Home", href: "/" },
        { text: "User Group", href: "/user-group" },
        { text: "Create", href: "/create-group" },
      ]);

      const usersList = await api.getUsers();
      console.log("Users API response:", usersList);
      setUsersList(usersList);
      setAvailableUsers(usersList.map((user: any) => user.username));
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        const users = await api.getUsers();
        console.log("Processed users data:", users); // Debug log

        if (users && users.length > 0) {
          setUsersList(users);
          // Filter out any undefined/null values
          const usernames = users
            .map((user) => user.username)
            .filter((username) => username);
          console.log("Available usernames:", usernames); // Debug log
          setAvailableUsers(usernames);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, []);

  const columnDefinitions = [
    {
      cell: (file: GroupUser) => <span className="text-link">{file.name}</span>,
      header: "Name",
      id: "filename",
      sortingField: "filename",
      width: 500,
    },
    {
      cell: (file: GroupUser) => {
        return (
          <Button
            onClick={() => handleRemoveUser(file.userId)}
            variant="primary"
          >
            Remove
          </Button>
        );
      },
      header: "Edit",
      id: "edit",
      width: 200,
    },
  ];

  return (
    <ContentLayout header={<Header variant="h1">Create User Group</Header>}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          marginBottom: "20px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
        }}
      >
        <div style={{ flex: 1, paddingLeft: "10px" }}>
          <FormField label="Group Name" controlId="group-name">
            <Input
              ariaLabel="Group Name"
              value={groupName}
              onChange={(e) => handleNameChange(e.detail.value)}
            />
          </FormField>
        </div>

        <div style={{ flex: 2, paddingLeft: "10px" }}>
          <FormField label="Description" controlId="description">
            <Input
              ariaLabel="Description"
              value={groupdescription}
              onChange={(e) => handleDescriptionChange(e.detail.value)}
            />
          </FormField>
        </div>
      </div>

      <Form>
        {recipients.map((recipient, index) => (
          <div
            key={index}
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
                    recipient.username
                      ? { label: recipient.username, value: recipient.username }
                      : null
                  }
                  onChange={({ detail }) =>
                    handleInputChange(
                      index,
                      "username",
                      detail.selectedOption?.value || ""
                    )
                  }
                  options={availableUsers
                    .sort((a, b) => a.localeCompare(b))
                    .map((username) => ({
                      label: username,
                      value: username,
                    }))}
                  placeholder="Choose a user"
                  filteringType="auto"
                  filteringPlaceholder="Find a user"
                  filteringAriaLabel="Filter users"
                />
              </FormField>
            </div>
            <div style={{ paddingRight: "40px" }}>
              <Button
                onClick={handleAddRecipient}
                disabled={
                  !recipients[0].username ||
                  recipients[0].username.trim().length === 0
                }
              >
                Add recipient
              </Button>
            </div>
          </div>
        ))}
      </Form>

      <Table
        columnDefinitions={columnDefinitions}
        header="Users"
        items={users}
        disableRowSelect={true}
        disableFilters={true}
      ></Table>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>

      <Modal
        visible={showSuccessDialog}
        onDismiss={handleSuccessConfirmation}
        header="Success"
        closeAriaLabel="Close dialog"
      >
        <Box padding="l">
          <SpaceBetween size="l">
            <div>Group has been created successfully!</div>
            <Button variant="primary" onClick={handleSuccessConfirmation}>
              Okay
            </Button>
          </SpaceBetween>
        </Box>
      </Modal>
    </ContentLayout>
  );
};

export default CreateGroup;
