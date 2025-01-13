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

export const CreatePermission = () => {
  const navigate = useNavigate();
  const { setBreadcrumb } = useContext(AppContext);

  const init = async () => {
    setBreadcrumb([
      { text: "Home", href: "/" },
      { text: "My Roles", href: "/management" },
      { text: "Permissions", href: "/permission" },
      { text: "CreatePermission", href: "/create-permission" },
    ]);
  };

  useEffect(() => {
    init();
  }, []);

  return <ContentLayout></ContentLayout>;
};

export default CreatePermission;
