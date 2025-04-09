
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
    echo "You can use nvm to install a compatible version:"
    echo "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash"
    echo "nvm install 16"
    echo "nvm use 16"
    exit 1
fi
echo "✓ Node.js v$NODE_VERSION"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm."
    exit 1
fi
echo "✓ npm"

# Create database directory if it doesn't exist
DB_DIR="./database"
if [ ! -d "$DB_DIR" ]; then
    echo "Creating database directory..."
    mkdir -p "$DB_DIR"
fi

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

# Database Configuration
echo "====================================================="
echo "Database Configuration"
echo "====================================================="
echo "By default, Azure AD Manager uses SQLite for simplicity."
echo "You can configure the following database options:"
echo ""
echo "1. SQLite (default, no additional installation required)"
echo "2. MySQL"
echo "3. PostgreSQL"
echo ""
read -p "Choose database type (1-3, default: 1): " DB_CHOICE

# Set default values
DB_TYPE="sqlite"
DB_PATH="../database/azure-ad-manager.db"
DB_HOST="localhost"
DB_PORT=""
DB_NAME=""
DB_USER=""
DB_PASSWORD=""

case $DB_CHOICE in
    2)
        DB_TYPE="mysql"
        read -p "MySQL Host (default: localhost): " DB_HOST_INPUT
        DB_HOST=${DB_HOST_INPUT:-$DB_HOST}
        read -p "MySQL Port (default: 3306): " DB_PORT_INPUT
        DB_PORT=${DB_PORT_INPUT:-"3306"}
        read -p "MySQL Database Name: " DB_NAME
        read -p "MySQL Username: " DB_USER
        read -p "MySQL Password: " DB_PASSWORD
        ;;
    3)
        DB_TYPE="postgres"
        read -p "PostgreSQL Host (default: localhost): " DB_HOST_INPUT
        DB_HOST=${DB_HOST_INPUT:-$DB_HOST}
        read -p "PostgreSQL Port (default: 5432): " DB_PORT_INPUT
        DB_PORT=${DB_PORT_INPUT:-"5432"}
        read -p "PostgreSQL Database Name: " DB_NAME
        read -p "PostgreSQL Username: " DB_USER
        read -p "PostgreSQL Password: " DB_PASSWORD
        ;;
    *)
        echo "Using SQLite database in ${DB_PATH}"
        ;;
esac

# Create .env.local file for configuration
echo "Creating configuration file..."
cat > .env.local << EOL
# Azure AD Manager Configuration
AD_SERVER=localhost
AD_PORT=389
AD_USER=admin
AD_PASSWORD=password
AD_BASE_DN=DC=example,DC=com

# Database Configuration
DB_TYPE=${DB_TYPE}
DB_PATH=${DB_PATH}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}

# Microsoft 365 Configuration
M365_TENANT_ID=
M365_CLIENT_ID=
M365_CLIENT_SECRET=
M365_REDIRECT_URI=http://localhost:8080/auth/microsoft/callback

# App Configuration
APP_PORT=8080
APP_URL=http://localhost:8080
EOL

# Initialize database based on type
if [ "$DB_TYPE" = "sqlite" ]; then
    echo "Setting up SQLite database..."
    # Check if sqlite3 is installed
    if ! command -v sqlite3 &> /dev/null; then
        echo "Warning: sqlite3 command not found. Database initialization skipped."
        echo "Please install sqlite3 to initialize the database manually."
    else
        # Initialize SQLite database with basic schema
        sqlite3 ../database/azure-ad-manager.db << EOF
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT,
    is_admin INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS m365_users (
    id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    user_principal_name TEXT NOT NULL UNIQUE,
    mail TEXT,
    job_title TEXT,
    department TEXT,
    account_enabled INTEGER DEFAULT 1,
    created_date_time TEXT,
    last_sign_in TEXT,
    data JSON,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS m365_licenses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    total INTEGER DEFAULT 0,
    assigned INTEGER DEFAULT 0,
    unit_price REAL DEFAULT 0,
    renewal_date TEXT,
    data JSON,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS m365_user_licenses (
    user_id TEXT,
    license_id TEXT,
    assigned_date TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, license_id),
    FOREIGN KEY (user_id) REFERENCES m365_users (id),
    FOREIGN KEY (license_id) REFERENCES m365_licenses (id)
);

CREATE TABLE IF NOT EXISTS m365_tenant_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id TEXT,
    client_id TEXT,
    client_secret TEXT,
    redirect_uri TEXT,
    enabled INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ALWAYS create default admin user with super admin privileges
INSERT OR IGNORE INTO users (username, password, email, first_name, last_name, is_admin)
VALUES ('admin', 'admin', 'admin@example.com', 'Admin', 'User', 1);

-- Insert default settings
INSERT OR IGNORE INTO settings (key, value) VALUES ('smtp_server', '');
INSERT OR IGNORE INTO settings (key, value) VALUES ('smtp_port', '25');
INSERT OR IGNORE INTO settings (key, value) VALUES ('smtp_username', '');
INSERT OR IGNORE INTO settings (key, value) VALUES ('smtp_password', '');
INSERT OR IGNORE INTO settings (key, value) VALUES ('smtp_ssl', 'false');
INSERT OR IGNORE INTO settings (key, value) VALUES ('from_email', 'noreply@example.com');
INSERT OR IGNORE INTO settings (key, value) VALUES ('session_timeout', '15');
EOF
        echo "✓ Database initialized with admin user (username: admin, password: admin)"
    fi
else
    echo "Please run the following SQL script to initialize your ${DB_TYPE} database:"
    cat << EOF
-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) NOT NULL UNIQUE,
    value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Microsoft 365 Tables
CREATE TABLE IF NOT EXISTS m365_users (
    id VARCHAR(255) PRIMARY KEY,
    display_name VARCHAR(255) NOT NULL,
    user_principal_name VARCHAR(255) NOT NULL UNIQUE,
    mail VARCHAR(255),
    job_title VARCHAR(255),
    department VARCHAR(255),
    account_enabled BOOLEAN DEFAULT TRUE,
    created_date_time TIMESTAMP,
    last_sign_in TIMESTAMP,
    data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS m365_licenses (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    total INTEGER DEFAULT 0,
    assigned INTEGER DEFAULT 0,
    unit_price DECIMAL(10,2) DEFAULT 0,
    renewal_date DATE,
    data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS m365_user_licenses (
    user_id VARCHAR(255),
    license_id VARCHAR(255),
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, license_id),
    FOREIGN KEY (user_id) REFERENCES m365_users (id),
    FOREIGN KEY (license_id) REFERENCES m365_licenses (id)
);

CREATE TABLE IF NOT EXISTS m365_tenant_config (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(255),
    client_id VARCHAR(255),
    client_secret VARCHAR(255),
    redirect_uri VARCHAR(255),
    enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ALWAYS create default admin user with super admin privileges
INSERT INTO users (username, password, email, first_name, last_name, is_admin)
VALUES ('admin', 'admin', 'admin@example.com', 'Admin', 'User', TRUE)
ON CONFLICT (username) DO NOTHING;

-- Insert default settings
INSERT INTO settings (key, value)
VALUES 
    ('smtp_server', ''),
    ('smtp_port', '25'),
    ('smtp_username', ''),
    ('smtp_password', ''),
    ('smtp_ssl', 'false'),
    ('from_email', 'noreply@example.com'),
    ('session_timeout', '15')
ON CONFLICT (key) DO NOTHING;
EOF
    echo "Make sure to run this script to create the admin user (username: admin, password: admin)."
fi

# Create a special start script that avoids ESM issues
echo "Creating compatibility start script..."
cat > start.js << EOL
// Compatibility script for older Node.js versions
const { spawn } = require('child_process');
const path = require('path');

// Run npm script without using ESM features
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const child = spawn(npm, ['run', 'dev', '--', '--force'], {
  stdio: 'inherit',
  env: { ...process.env }
});

child.on('close', (code) => {
  process.exit(code);
});
EOL

echo "====================================================="
echo "Installation Complete!"
echo ""
echo "To start the application, run:"
echo "cd azure-ad-manager"
echo "node start.js"
echo ""
echo "The application will be available at: http://localhost:8080"
echo "Default login: admin / admin"
echo ""
echo "IMPORTANT: This is a development setup. For production use,"
echo "please configure proper authentication and secure the database."
echo "====================================================="
