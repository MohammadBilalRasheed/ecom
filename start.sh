#!/bin/bash

# Industrial Modbus Power Control System Startup Script
# For Huawei SmartLogger 3000A, SICES GC600, and SICES MC200

echo "=========================================="
echo "Industrial Modbus Power Control System"
echo "Version: 1.0.0"
echo "=========================================="

# Create necessary directories
mkdir -p data/context
mkdir -p logs

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | sed 's/v//')
REQUIRED_VERSION="16.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "ERROR: Node.js version $REQUIRED_VERSION or higher is required. Current version: $NODE_VERSION"
    exit 1
fi

echo "✓ Node.js version: $NODE_VERSION"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing Node-RED and dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        exit 1
    fi
    echo "✓ Dependencies installed"
fi

# Check device connectivity (optional ping test)
echo "Checking device connectivity..."

ping -c 1 -W 2 192.168.88.4 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✓ Huawei SmartLogger 3000A (192.168.88.4) - Reachable"
else
    echo "⚠ Huawei SmartLogger 3000A (192.168.88.4) - Not reachable"
fi

ping -c 1 -W 2 192.168.88.6 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✓ SICES GC600 (192.168.88.6) - Reachable"
else
    echo "⚠ SICES GC600 (192.168.88.6) - Not reachable"
fi

ping -c 1 -W 2 192.168.88.7 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✓ SICES MC200 (192.168.88.7) - Reachable"
else
    echo "⚠ SICES MC200 (192.168.88.7) - Not reachable"
fi

echo ""
echo "Starting Node-RED Industrial Power Control System..."
echo "Dashboard will be available at: http://localhost:1880/dashboard"
echo "Node-RED Editor available at: http://localhost:1880"
echo ""
echo "Default Login:"
echo "Username: admin"
echo "Password: admin (CHANGE THIS IN PRODUCTION!)"
echo ""
echo "Press Ctrl+C to stop the system"
echo "=========================================="

# Start Node-RED with settings
exec node-red --settings settings.js --userDir ./data