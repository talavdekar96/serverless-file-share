import { createContext } from "react";

interface Breadcrumb {
  text: string;
  href: string;
}

// interface UserPrivileges {
//   canDelete: boolean;
//   canRead: boolean;
//   canUpload: boolean;
//   canShare: boolean;
// }

// Define the type for the app context
interface AppContextType {
  breadcrumb: Breadcrumb[];
  setBreadcrumb: (newBreadcrumb: Breadcrumb[]) => void;
  userPrivileges: Privileges;
  setUserPrivileges: (privileges: Privileges) => void;
}

// Create the app context
export const AppContext = createContext<AppContextType>({
  breadcrumb: [],
  setBreadcrumb: () => {},
  userPrivileges: {
    canDelete: false,
    canRead: false,
    canUpload: false,
    canShare: false,
  },
  setUserPrivileges: () => {},
});
