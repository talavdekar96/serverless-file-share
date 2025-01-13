export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface UserPrivileges {
  canRead: boolean;
  canUpload: boolean;
  canDelete: boolean;
  canShare: boolean;
}

export interface User {
  userId: string;
  username: string;
  status: UserStatus;
  roleId: string;
  createdAt: string;
  updatedAt: string;
  privileges?: UserPrivileges;
}
