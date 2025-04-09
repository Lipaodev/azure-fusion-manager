
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

# Create production build
echo "Building the application for production..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "Error: Build failed. Please check for errors above."
    exit 1
fi

# Create production server script
echo "Creating production server script..."
cat > serve-production.js << EOL
// Simple production server script
const express = require('express');
const path = require('path');
const fs = require('fs');

// Check if express is installed
try {
  require.resolve('express');
} catch (e) {
  console.error('Express is not installed. Installing...');
  require('child_process').execSync('npm install express --no-save', { stdio: 'inherit' });
}

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// For all requests, send index.html (Client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(\`Server running at http://localhost:\${PORT}\`);
  console.log(\`Press Ctrl+C to stop\`);
});
EOL

echo "====================================================="
echo "Production Build Successful!"
echo ""
echo "To start the production server:"
echo "node serve-production.js"
echo ""
echo "For a more robust production setup, consider:"
echo "- Using PM2 for process management"
echo "- Setting up Nginx as a reverse proxy"
echo "- Configuring SSL certificates"
echo "- Setting proper environment variables"
echo "====================================================="

