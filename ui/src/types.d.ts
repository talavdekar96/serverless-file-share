/// <reference types="react-scripts" />
declare module "react-router-dom";
declare module "react-dom/client";

type OwnedFile = {
  fileId: string;
  filename: string;
  dateAdded: string;
  size: number;
  recipients: Recipient[];
};

type UserList = {
  createdAt: string;
  userId: string;
  username: string;
  status: "ACTIVE" | "INACTIVE";
  role: string;
  updatedAt?: string;
  roleName?: string;
  roleId?: string;
  privileges: {
    canDelete?: boolean;
    canRead?: boolean;
    canUpload?: boolean;
    canShare?: boolean;
  };
};

interface UserList {
  email: string;
  username: string;
  privileges?: {
    canDelete: boolean;
    canRead: boolean;
    canUpload: boolean;
    canShare: boolean;
  };
}

type Group = {
  groupId: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members: GroupMember[];
};

interface GroupResponse {
  groups: Group[];
  count: number;
  createdBy: string;
}

interface UserResponse {
  users: UserList[];
  count: number;
}

type CreateGroupRequest = {
  name: string;
  description: string;
  members: GroupMember[];
};

type GroupMember = {
  userId: string;
  username: string;
  addedAt: string;
  notify: boolean;
};

type SharedFile = {
  fileId: string;
  filename: string;
  size: number;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
};

interface DownloadUrlResponse {
  downloadUrl: string;
}

interface BaseShareFileFormSubmission {
  source: "upload" | "existing";
  recipients: Recipient[];
  existingFile?: OwnedFile;
  expiryEnabled: boolean;
  expiryDate?: string;
  limitEnabled: boolean;
  limitAmount?: { text: string; value: number };
  selectedRecipientDetails?: GroupMember[];
}

interface ShareUploadFileFormSubmission extends BaseShareFileFormSubmission {
  source: "upload";
  uploadedFiles: File[];
}

interface ShareExistingFileFormSubmission extends BaseShareFileFormSubmission {
  source: "existing";
  existingFile: OwnedFile;
}

type ShareFileFormSubmission =
  | ShareUploadFileFormSubmission
  | ShareExistingFileFormSubmission;

type ShareApiRequest = {
  recipients: Recipient[];
  expiryDate?: string;
  downloadLimit?: number;
};

type Recipient = {
  recipientEmail: string;
  notify?: boolean;
  expiryDate?: string;
  downloadLimit?: number;
};

interface UploadResponse {
  uploadUrl: string;
  fileId: string;
}

interface ApiCache {
  ownedFiles?: OwnedFile[];
  sharedFiles?: SharedFile[];
  users?: UserList[];
  groups?: GroupResponse;
  auditLogs?: AuditLogResponse;
}

interface IApiProxy {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T>;
}

interface IS3Service {
  uploadFileToS3(file: File, presignedUrl: string): Promise<void>;
}

interface RecipientEmail {
  recipientEmail: string;
  notify?: boolean;
}

interface UserResponse {
  email: string;
  username: string;
  privileges?: {
    canDelete: boolean;
    canRead: boolean;
    canUpload: boolean;
    canShare: boolean;
  };
}

type Role = {
  roleId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  privileges: {
    canDelete: boolean;
    canRead: boolean;
    canUpload: boolean;
    canShare: boolean;
  };
};

interface RoleResponse {
  roles: Role[];
  count: number;
}

interface RecipientDisplay {
  username: string;
  notify: boolean;
}

interface CustomComponentProps {
  value?: RecipientDisplay[];
  onChange: (value: RecipientDisplay[]) => void;
}

interface AuditLog {
  fileId: string;
  downloadId: string;
  dateTimeStamp: string;
  userId: string;
  filename: string;
  username: string;
  ipAddress: string;
}

interface AuditLogResponse {
  items: AuditLog[];
  lastEvaluatedKey?: Record<string, any>;
}

interface Privileges {
  canDelete?: boolean;
  canRead?: boolean;
  canUpload?: boolean;
  canShare?: boolean;
}

interface UserList {
  email: string;
  username: string;
  userId: string;
  status: "ACTIVE" | "INACTIVE";
  role: string;
  privileges?: Privileges;
}
