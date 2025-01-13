import Table from "@aws-northstar/ui/components/Table";
import { Box, Button, Header, Link } from "@cloudscape-design/components";
import { ContentLayout } from "@cloudscape-design/components";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ApiService } from "../../../services/ApiService";
import { AppContext } from "../../common/AppLayout/context";

export const Roles = () => {
  const { setBreadcrumb } = useContext(AppContext);
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const init = async () => {
    setBreadcrumb([
      { text: "Home", href: "/" },
      { text: "My Users", href: "/users" },
      { text: "My Roles", href: "/roles" },
    ]);

    try {
      const api = ApiService.getInstance();
      const response = await api.getRoles();
      console.log("API Response:", response);
      setRoles(response);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const onCreateClick = () => {
    navigate("/create-role");
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    console.log("Current roles state:", roles);
  }, [roles]);

  const columnDefinitions = [
    {
      cell: (item: Role) => (
        <span className="text-link">
          <Link
            onFollow={() => {
              navigate(`/edit-role/${item.roleId}`, {
                state: { role: item },
              });
            }}
          >
            {item.name}
          </Link>
        </span>
      ),
      header: "Name",
      id: "name",
      sortingField: "name",
      width: 300,
    },
    {
      cell: (item: Role) => item.description || "-",
      header: "Description",
      id: "description",
      sortingField: "description",
      align: "center",
      width: 150,
    },
    // {
    //   cell: (item: Role) =>
    //     Object.values(item.privileges || {}).filter(Boolean).length,
    //   header: 'Privileges',
    //   id: 'privileges',
    //   sortingField: 'privileges',
    //   align: 'center',
    //   width: 150,
    // },
  ];

  console.log("Rendering table with roles:", roles);

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          actions={
            <Button onClick={onCreateClick} variant="primary">
              Create Role
            </Button>
          }
        >
          Roles
        </Header>
      }
    >
      <Table
        trackBy="roleId"
        columnDefinitions={columnDefinitions}
        items={roles}
        loading={loading}
        loadingText="Loading roles..."
        empty={
          <Box textAlign="center" color="inherit">
            <b>No roles</b>
            <Box padding={{ bottom: "s" }} variant="p" color="inherit">
              No roles to display.
            </Box>
          </Box>
        }
        header={
          <Header counter={roles?.length ? `(${roles.length})` : undefined}>
            Roles
          </Header>
        }
        disableRowSelect={true}
        variant="container"
      />
    </ContentLayout>
  );
};

export default Roles;
