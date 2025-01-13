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

export const MyUsers = () => {
  const navigate = useNavigate();
  const { setBreadcrumb } = useContext(AppContext);

  const init = async () => {
    setBreadcrumb([
      { text: "Home", href: "/" },
      { text: "My Users", href: "/my-users" },
    ]);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <ContentLayout
      header={
        <Header variant="h1" description="Create and manage users & groups.">
          Users & Groups Management
        </Header>
      }
    >
      <SpaceBetween size="l" direction="vertical">
        <Container>
          <Header variant="h3">My Users</Header>
          <p>If you want edit existing users, you can:</p>
          <ul>
            <li>
              start editing existing users by clicking on the button below.
            </li>
          </ul>
          <Button onClick={() => navigate("/users")}>Create user</Button>
        </Container>
        <Container>
          <Header variant="h3">My groups</Header>
          <p>Add as well as view all the user grouped.</p>
          <ul>
            <li>create a new group by clicking on the button below.</li>
          </ul>
          <Button onClick={() => navigate("/user-group")}>Create Group</Button>
        </Container>
      </SpaceBetween>
    </ContentLayout>
  );
};

export default MyUsers;
