import { AmplifyUser, AuthEventData } from "@aws-amplify/ui";
import AppLayoutBase from "@aws-northstar/ui/components/AppLayout";
import { BreadcrumbGroup } from "@cloudscape-design/components";
import { Auth } from "aws-amplify";
import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { formatUserForNav } from "../../../helpers/util";
import { ApiService } from "../../../services/ApiService";
import { AppContext } from "./context";

interface AppLayoutProps {
  signOut?: (data?: AuthEventData | undefined) => void;
  user?: AmplifyUser;
  children: ReactNode;
}

const AppLayout = ({ signOut, user, children }: AppLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navUser = formatUserForNav(user);
  const [breadcrumb, setBreadcrumb] = useState([{ text: "Home", href: "/" }]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userPrivileges, setUserPrivileges] = useState<Privileges>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      console.log("checkUserRole called, user:", user);
      setIsLoading(true);
      try {
        const cachedRole = sessionStorage.getItem("userRole");
        const cachedPrivileges = sessionStorage.getItem("userPrivileges");
        const cachedUserId = sessionStorage.getItem("userId");
        const currentUserId = user?.username;

        // Only use cache if it belongs to the current user
        if (
          cachedRole &&
          cachedRole !== "undefined" &&
          cachedPrivileges &&
          cachedUserId === currentUserId
        ) {
          console.log("Using cached role:", cachedRole);
          setIsAdmin(cachedRole.toUpperCase() === "ADMIN");
          setUserPrivileges(JSON.parse(cachedPrivileges));
        } else if (user) {
          console.log("Fetching fresh user details");
          const currentUser = await Auth.currentAuthenticatedUser();
          console.log("Current authenticated user:", currentUser);
          const userId = currentUser.username;

          const api = ApiService.getInstance();
          console.log("Calling getUserById for userId:", userId);
          const userDetails = await api.getUserById(userId);
          console.log("Received user details:", userDetails);

          const isUserAdmin = userDetails.roleName?.toUpperCase() === "ADMIN";
          setIsAdmin(isUserAdmin);
          setUserPrivileges(userDetails.privileges || {});

          if (userDetails && userDetails.roleName) {
            sessionStorage.setItem("userRole", userDetails.roleName);
            sessionStorage.setItem(
              "userPrivileges",
              JSON.stringify(userDetails.privileges || {})
            );
            sessionStorage.setItem("userId", userId);
          }
        }
      } catch (error) {
        console.error("Error in checkUserRole:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [user]);

  // Update the onSignOut function to clear all session storage
  const onSignOut = async () => {
    // clear local api cache on sign out
    const api = ApiService.getInstance();
    api.clearCache();

    // Clear all relevant session storage items
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("userPrivileges");
    sessionStorage.removeItem("userId");
    sessionStorage.setItem("requiresHomeRedirect", "true");

    // signout from cognito using amplify function
    if (signOut) {
      signOut();
    }
  };

  // Add new useEffect to handle redirect after login
  useEffect(() => {
    const requiresHomeRedirect = sessionStorage.getItem("requiresHomeRedirect");

    if (requiresHomeRedirect === "true" && user) {
      // Clear the flag
      sessionStorage.removeItem("requiresHomeRedirect");
      // Redirect to home page
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <AppLayoutBase
      title="Serverless File Sharing"
      navigationItems={[
        { href: "/", text: "Home", type: "link" as const },
        { href: "/files", text: "My files", type: "link" as const },
        ...(isAdmin
          ? [
              { href: "/management", text: "My Roles", type: "link" as const },
              { href: "/my-users", text: "My Users", type: "link" as const },
              { href: "/logs", text: "Logs", type: "link" as const },
            ]
          : []),
        {
          href: "/shared-files",
          text: "Files shared with me",
          type: "link" as const,
        },
        { type: "divider" as const },
        {
          external: true,
          href: "https://docs.aws.amazon.com",
          text: "Documentation",
          type: "link" as const,
        },
      ]}
      user={navUser}
      onSignout={onSignOut}
      breadcrumbGroup={<BreadcrumbGroup items={breadcrumb} />}
      navigationOpen={window.innerWidth > 688}
    >
      <AppContext.Provider
        value={{ breadcrumb, setBreadcrumb, userPrivileges, setUserPrivileges }}
      >
        {children}
      </AppContext.Provider>
    </AppLayoutBase>
  );
};

export default AppLayout;
