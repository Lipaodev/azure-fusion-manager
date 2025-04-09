
// Add to existing types file
export interface WebAppUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: "Admin" | "User" | "ReadOnly";
  lastLogin: Date | null;
  createdAt: Date;
  isActive: boolean;
  permissions: string[];
}

export interface ADServer {
  id: string;
  name: string;
  domain: string;
  server: string;
  port: number;
  useSSL: boolean;
  username: string;
  password: string;
  isConnected: boolean;
  lastConnectionTime: Date;
  clientId?: string;
  clientName?: string;
}

export interface ADUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  department?: string;
  phoneNumber?: string;
  isEnabled: boolean;
  groups: string[];
  licenses?: string[];
  createdAt: Date;
  lastModified: Date;
  lastLogon?: Date;
  clientId?: string;
  clientName?: string;
  serverId?: string;
}

export interface ADGroup {
  id: string;
  name: string;
  description?: string;
  members: number;
  category: string;
  scope: string;
  createdAt: Date;
  lastModified: Date;
}

export interface M365License {
  id: string;
  name: string;
  description?: string;
  included?: string[];
  assignedUsers?: number;
  totalAvailable?: number;
}

export interface M365User {
  id: string;
  displayName: string;
  email: string;
  username: string;
  isLicensed: boolean;
  licenses: string[];
  isAdmin: boolean;
  departmentName?: string;
  jobTitle?: string;
  lastSignIn?: Date;
  accountEnabled: boolean;
}
