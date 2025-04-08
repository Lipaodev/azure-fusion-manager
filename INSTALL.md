
# Azure AD Manager - On-Premises Installation Guide

This document provides comprehensive instructions for installing and deploying the Azure AD Manager application on your own infrastructure.

## System Requirements

- Node.js v16 or higher
- npm v7 or higher
- 2GB RAM minimum (4GB recommended)
- 1GB free disk space
- One of the following databases:
  - SQLite3 (default, included)
  - MySQL 5.7+ or MariaDB 10.2+
  - PostgreSQL 10+

## Installation Options

### Option 1: Automated Installation (Recommended)

1. Download the `azure-ad-manager.zip` file
2. Extract the zip file: `unzip azure-ad-manager.zip`
3. Make the install script executable: `chmod +x install.sh`
4. Run the script: `./install.sh`
5. Follow the on-screen instructions to choose your database and enter configuration
6. Start the application with: `node start.js`

### Option 2: Manual Installation

If you prefer to install manually:

1. Extract the `azure-ad-manager.zip` file: `unzip azure-ad-manager.zip -d azure-ad-manager`
2. Navigate to the extracted directory: `cd azure-ad-manager`
3. Install dependencies: `npm install`
4. Create a `.env.local` file with your configuration settings
5. Initialize your chosen database manually with the schema (see Database Configuration)
6. Start the development server: `npm run dev`

## Production Deployment

For production environments, we recommend the following approach:

1. Complete the installation steps above
2. Run the production deployment script: `chmod +x deploy-production.sh && ./deploy-production.sh`
3. Start the production server: `node serve-production.js`

For a more robust production deployment:

- Use PM2 for process management: `npm install -g pm2 && pm2 start serve-production.js`
- Set up Nginx as a reverse proxy
- Configure SSL certificates for secure HTTPS connections
- Set appropriate environment variables for your production environment

## Database Configuration

The application supports multiple database options:

### SQLite (Default)

- Suitable for small deployments and testing
- No additional installation required
- Data stored in `database/azure-ad-manager.db`
- Configuration in `.env.local`:
  ```
  DB_TYPE=sqlite
  DB_PATH=../database/azure-ad-manager.db
  ```

### MySQL / MariaDB

- Suitable for medium-sized deployments
- Requires MySQL/MariaDB server installed
- Configuration in `.env.local`:
  ```
  DB_TYPE=mysql
  DB_HOST=localhost
  DB_PORT=3306
  DB_NAME=azureadmanager
  DB_USER=yourusername
  DB_PASSWORD=yourpassword
  ```

### PostgreSQL

- Suitable for larger deployments
- Requires PostgreSQL server installed
- Configuration in `.env.local`:
  ```
  DB_TYPE=postgres
  DB_HOST=localhost
  DB_PORT=5432
  DB_NAME=azureadmanager
  DB_USER=yourusername
  DB_PASSWORD=yourpassword
  ```

During installation, the script will create the necessary tables in your database. If you're setting up the database manually, use the SQL initialization scripts provided in the installation guide.

## Database Schema

The application creates the following tables in your database:

- `users` - Web application users
- `settings` - Application settings
- `m365_users` - Microsoft 365 users
- `m365_licenses` - Microsoft 365 licenses
- `m365_user_licenses` - Many-to-many relationship between users and licenses
- `m365_tenant_config` - Microsoft 365 tenant configuration

## Active Directory Configuration

The application requires configuration for connecting to your Active Directory environment:

1. Edit the `.env.local` file created during installation:

```
AD_SERVER=your-ad-server
AD_PORT=389
AD_USER=your-admin-user
AD_PASSWORD=your-admin-password
AD_BASE_DN=DC=example,DC=com
```

2. Restart the application for the changes to take effect

## Microsoft 365 Configuration

To enable Microsoft 365 integration, you need to register an application in the Azure Portal:

1. Go to the [Azure Portal](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)
2. Register a new application
3. Set up the required API permissions:
   - Microsoft Graph API: User.Read.All, User.ReadWrite.All, Directory.Read.All, Directory.ReadWrite.All, Organization.Read.All, SubscriptionLicense.Read.All
4. Create a client secret
5. Add a redirect URI to your application (e.g., http://localhost:8080/auth/microsoft/callback)
6. Configure the application in the Azure AD Manager web interface or directly in the `.env.local` file:

```
M365_TENANT_ID=your-tenant-id
M365_CLIENT_ID=your-client-id
M365_CLIENT_SECRET=your-client-secret
M365_REDIRECT_URI=http://localhost:8080/auth/microsoft/callback
```

## Importing Active Directory and Microsoft 365 Users

The application supports importing users from:

1. **Active Directory** - Connect to your on-premises AD server and import users
2. **Microsoft 365** - Import users from your Microsoft 365 tenant after configuring the integration

Both import options are available through the web interface once the respective connections are configured.

## Troubleshooting

If you encounter issues during installation or deployment:

1. **Node.js Version**: Ensure you're using Node.js v16 or higher
   ```
   node -v
   ```

2. **Permission Issues**: Make sure the install script is executable
   ```
   chmod +x install.sh
   ```

3. **Database Errors**: Check that your database is properly installed and accessible
   ```
   # For SQLite
   sqlite3 --version
   
   # For MySQL
   mysql --version
   
   # For PostgreSQL
   psql --version
   ```

4. **Network Issues**: Verify connectivity to your Active Directory servers
   ```
   ping your-ad-server
   ```

5. **Microsoft 365 Connection**: Verify your tenant configuration
   ```
   # Check that the redirect URI matches what's configured in Azure Portal
   # Verify that API permissions have been granted admin consent
   ```

6. **Application Logs**: Check the console output for any error messages

For additional support, please contact your system administrator.

## Security Considerations

- Change the default admin password immediately after installation
- Use HTTPS in production environments
- Restrict access to the server running the application
- Regularly update the application and its dependencies
- Use a secure database password and restrict database access
- Consider using environment variables instead of .env files in production
- Store Microsoft 365 client secrets securely and rotate them regularly
