
#!/bin/bash

# Azure AD Manager - Production Deployment Script
echo "====================================================="
echo "Azure AD Manager - Production Deployment"
echo "====================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found."
    echo "Please run this script from the application root directory."
    exit 1
fi

# Build the application
echo "Building the application for production..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "Error: Build failed. Please check for errors above."
    exit 1
fi

echo "====================================================="
echo "Build Successful!"
echo ""
echo "The production build is in the 'dist' directory."
echo ""
echo "To serve the application with a simple HTTP server:"
echo "npm install -g serve"
echo "serve -s dist"
echo ""
echo "For production use, configure your web server (Nginx, Apache, etc.)"
echo "to serve the files from the 'dist' directory."
echo "====================================================="

