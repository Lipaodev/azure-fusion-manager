
#!/bin/bash

# Azure AD Manager - Installation Script
echo "====================================================="
echo "Azure AD Manager - On-premises Installation Script"
echo "====================================================="

# Check for required tools
echo "Checking for required tools..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2)
NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d '.' -f 1)
if [ $NODE_MAJOR_VERSION -lt 16 ]; then
    echo "Node.js version $NODE_VERSION is not supported."
    echo "Please upgrade to Node.js v16 or higher."
    exit 1
fi
echo "✓ Node.js v$NODE_VERSION"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm."
    exit 1
fi
echo "✓ npm"

# Extract the zip file if it exists
if [ -f "azure-ad-manager.zip" ]; then
    echo "Extracting application files..."
    unzip -q azure-ad-manager.zip -d azure-ad-manager
    cd azure-ad-manager
else
    echo "Error: azure-ad-manager.zip not found."
    echo "Please make sure the zip file is in the current directory."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

echo "====================================================="
echo "Installation Complete!"
echo ""
echo "To start the application, run:"
echo "cd azure-ad-manager"
echo "npm run dev"
echo ""
echo "The application will be available at: http://localhost:8080"
echo "====================================================="

