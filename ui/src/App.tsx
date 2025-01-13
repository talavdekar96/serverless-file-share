// Import styles
import "@aws-amplify/ui-react/styles.css";
import "./app.scss";

import {
  withAuthenticator,
  WithAuthenticatorProps,
} from "@aws-amplify/ui-react";
import NorthStarThemeProvider from "@aws-northstar/ui/components/NorthStarThemeProvider";
import { Amplify } from "aws-amplify";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import amplifyConfig from "./amplify";
import AppLayout from "./components/common/AppLayout";
import CreateGroup from "./components/pages/CreateGroup";
import CreatePermission from "./components/pages/CreatePermission";
import CreateRole from "./components/pages/CreateRole";
import Download from "./components/pages/Download";
import EditGroup from "./components/pages/EditGroup";
import EditRoles from "./components/pages/EditRoles";
import EditUser from "./components/pages/EditUser";
import FileDetails from "./components/pages/FileDetails";
import UserGroup from "./components/pages/Group";
import Home from "./components/pages/Home";
import Logs from "./components/pages/log";
import Management from "./components/pages/Management";
import MyFiles from "./components/pages/MyFiles";
import MyUsers from "./components/pages/MyUsers";
import Permission from "./components/pages/Permission";
import Roles from "./components/pages/Roles";
import Share from "./components/pages/Share";
import SharedFiles from "./components/pages/SharedFiles";
import Users from "./components/pages/Users";

Amplify.configure(amplifyConfig);
const App = ({ user, signOut }: WithAuthenticatorProps) => {
  return (
    <Router>
      <NorthStarThemeProvider>
        <AppLayout signOut={signOut} user={user}>
          <Routes>
            <Route path="/share" element={<Share />} />
            <Route path="/share/:fileId" element={<Share />} />
            <Route path="/shared-files" element={<SharedFiles />} />
            <Route path="/files/:fileId" element={<FileDetails />} />
            <Route path="/files" element={<MyFiles />} />
            <Route path="/download/:fileId" element={<Download />} />
            <Route path="/user-group" element={<UserGroup />} />
            <Route path="/edit-group/:fileId" element={<EditGroup />} />
            <Route path="/create-group" element={<CreateGroup />} />
            <Route path="/management" element={<Management />} />
            <Route path="/permission" element={<Permission />} />
            <Route path="/create-permission" element={<CreatePermission />} />
            <Route path="/my-users" element={<MyUsers />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/create-role" element={<CreateRole />} />
            <Route path="/edit-user/:userId" element={<EditUser />} />
            <Route path="/users" element={<Users />} />
            <Route path="/edit-role/:roleId" element={<EditRoles />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </AppLayout>
      </NorthStarThemeProvider>
    </Router>
  );
};

export default withAuthenticator(App, { signUpAttributes: ["name"] });
