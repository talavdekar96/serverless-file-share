import {
  Button,
  Container,
  ContentLayout,
  Header,
  SpaceBetween,
} from "@cloudscape-design/components";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../../common/AppLayout/context";

export const Management = () => {
  const navigate = useNavigate();
  const { setBreadcrumb } = useContext(AppContext);

  const init = async () => {
    setBreadcrumb([
      { text: "Home", href: "/" },
      { text: "My Roles", href: "/management" },
    ]);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <ContentLayout header={<Header variant="h1">Roles Management</Header>}>
      <SpaceBetween size="l" direction="vertical">
        {/* <Container>
          <Header variant="h3">Permissions</Header>
          <p>Permission Management </p>
          <ul>
            <li>managing permissions for various roles.</li>
          </ul>
          <Button onClick={() => navigate("/roles")}>Create Permissions</Button>
        </Container> */}
        <Container>
          <Header variant="h3">My Roles</Header>
          <p>Assign roles to users for access control</p>
          <ul>
            <li>
              by assigning roles to users, you can control their access to
              resources.
            </li>
          </ul>
          <Button onClick={() => navigate("/roles")}>Create roles</Button>
        </Container>
      </SpaceBetween>
    </ContentLayout>
  );
};

export default Management;
