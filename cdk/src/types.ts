// Database types
export interface File {
  fileId: string;
  dateAdded: string;
  filename: string;
  size: number;
  type: string;
  ownerId: string;
  ownerEmail: string;
  ownerName: string;
  expiryDate?: string;
  downloadLimit?: number;
}

export interface Recipient {
  recipientEmail: string;
  notify?: boolean;
  dateShared?: string;
}

export interface OwnedFile extends File {
  recipients: Recipient[];
}

export interface SharedFile extends File {
  recipientEmail: string;
  notify?: boolean;
  dateShared: string;
}

// Auth types
export interface User {
  id: string;
  email: string;
  email_verified: boolean;
  name: string;
  dateCreated?: Date;
  dateLastModified?: Date;
}

// S3 types
export interface FileMetaData {
  filename: string;
  size: number;
  type: string;
  ownerId: string;
}

export interface GetObjectMetadataRequest {
  bucket: string;
  key: string;
}

export interface PresignedUrlRequest {
  bucket: string;
  key: string;
  metadata?: Record<string, string>;
  method?: "GET" | "PUT";
}

export interface DeleteFileRequest {
  bucket: string;
  key: string;
}

// 'Share' step function types
export interface ShareRequest {
  userId: string;
  fileId: string;
  recipients: RecipientEmail[];
  expiryDate?: string;
  downloadLimit?: number;
}

interface RecipientEmail {
  recipientEmail: string;
  notify?: boolean;
}

export interface ShareRequestWithUserInfo extends ShareRequest {
  user: User;
}

export interface ShareRequestWithUserAndFileInfo
  extends ShareRequestWithUserInfo {
  file: {
    filename: string;
    size: number;
    type: string;
    ownerId: string;
  };
}

// 'Download' step function types
export interface DownloadRequest {
  userId: string;
  fileId: string;
  latitude: string;
  longitude: string;
  ipAddress: string;
}

export interface DownloadRequestWithUserInfo extends DownloadRequest {
  user: User;
}

export interface DownloadEventWithUserAndFileInfo
  extends DownloadRequestWithUserInfo {
  file: File;
}

export interface DownloadResponse {
  downloadUrl: string;
}

export interface GroupMember {
  userId: string;
  username: string;
  addedAt: string;
}

export interface UserGroup {
  groupId: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members: GroupMember[];
  files?: string[]; // Array of fileIds shared with this group
}

export interface Privileges {
  canRead: boolean;
  canUpload: boolean;
  canDelete: boolean;
  canShare: boolean;
}

export interface Role {
  roleId: string;
  name: string;
  privileges: Privileges;
  createdAt: string;
  updatedAt: string;
}

// GetUserInfo step
export type GetUserInfoRequest = DownloadRequest | ShareRequest;
export type GetUserInfoResponse =
  | DownloadRequestWithUserInfo
  | ShareRequestWithUserInfo;

// Other API's
export interface DeleteRecipientsRequest {
  recipients: { recipientEmail: string }[];
}

export interface AuditLogEntry {
  fileId: string;
  downloadId: string;
  dateTimeStamp: string;
  userId: string;
  filename: string;
  username: string;
}

export interface AuditLogResponse {
  items: AuditLogEntry[];
  lastEvaluatedKey?: Record<string, any>;
}
