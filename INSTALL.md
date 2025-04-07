
# Azure AD Manager - On-Premises Installation Guide

This document provides instructions for installing and deploying the Azure AD Manager application on your own infrastructure.

## System Requirements

- Node.js v16 or higher
- npm v7 or higher
- 2GB RAM minimum (4GB recommended)
- 1GB free disk space

## Installation Options

### Option 1: Automated Installation

1. Download the `azure-ad-manager.zip` file
2. Place the `install.sh` script in the same directory as the zip file
3. Make the script executable: `chmod +x install.sh`
4. Run the script: `./install.sh`
5. Follow the on-screen instructions

### Option 2: Manual Installation

1. Extract the `azure-ad-manager.zip` file: `unzip azure-ad-manager.zip -d azure-ad-manager`
2. Navigate to the extracted directory: `cd azure-ad-manager`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

## Production Deployment

For production environments, build the application and serve it using a proper web server:

1. Build the application: `npm run build`
2. Configure your web server (Nginx, Apache, etc.) to serve the files from the `dist` directory

You can use the provided `deploy-production.sh` script to automate the build process.

## Configuration

The application requires configuration for connecting to your Active Directory environment:

1. Create a `.env.local` file in the root directory with the following settings:

```
AD_SERVER=your-ad-server
AD_PORT=389
AD_USER=your-admin-user
AD_PASSWORD=your-admin-password
AD_BASE_DN=DC=example,DC=com
```

2. Restart the application for the changes to take effect

## Troubleshooting

If you encounter issues during installation or deployment:

1. Check that you meet all system requirements
2. Verify network connectivity to your Active Directory servers
3. Ensure the AD service account has appropriate permissions
4. Check application logs in the browser console

For additional support, please contact your system administrator.

