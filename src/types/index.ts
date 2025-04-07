
export interface ADServer {
  id: string;
  name: string;
  domain: string;
  server: string;
  port: number;
  useSSL: boolean;
  username: string;
  password: string; // Em uma aplicação real, isso não deve ser armazenado como texto simples
  isConnected: boolean;
  lastConnectionTime?: Date;
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
  createdAt: Date;
  lastModified: Date;
  accountExpires?: Date;
  lastLogon?: Date;
  profilePictureUrl?: string;
}

export interface ADGroup {
  id: string;
  name: string;
  description?: string;
  email?: string;
  members: number;
  category: 'Security' | 'Distribution';
  scope: 'DomainLocal' | 'Global' | 'Universal';
  createdAt: Date;
  lastModified: Date;
}

export interface WebAppUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: 'Admin' | 'User' | 'ReadOnly';
  lastLogin?: Date;
  createdAt: Date;
  isActive: boolean;
  permissions: string[];
}

export interface AzureAppConfig {
  tenantId: string;
  clientId: string;
  clientSecret: string; // Em uma aplicação real, isso não deve ser armazenado como texto simples
  enabled: boolean;
}

export interface EmailSettings {
  smtpServer: string;
  port: number;
  useSsl: boolean;
  username: string;
  password: string; // Em uma aplicação real, isso não deve ser armazenado como texto simples
  fromAddress: string;
  enabled: boolean;
}

export interface License {
  id: string;
  name: string;
  description: string;
  assignedUsers: number;
  totalLicenses: number;
  skuId: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

export type ReportType = 'LicenseUsage' | 'ActiveAccounts' | 'UserActivities' | 'GroupMembership';

export interface ReportConfiguration {
  id: string;
  name: string;
  type: ReportType;
  schedule?: 'daily' | 'weekly' | 'monthly';
  lastRun?: Date;
  recipients: string[];
  parameters: Record<string, any>;
}
