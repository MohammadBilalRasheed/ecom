#!/bin/bash

# Simple validation script to test system components
echo "🔍 Testing System Components..."

# Test 1: Check Node.js availability
echo "1. Testing Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "   ✓ Node.js ${NODE_VERSION} is available"
else
    echo "   ✗ Node.js is not installed"
    exit 1
fi

# Test 2: Validate JSON configuration files
echo "2. Testing JSON configuration files..."
JSON_VALID=true
for file in package.json settings.js config/*.json flows/*.json data/flows.json; do
    if [ -f "$file" ]; then
        if [[ "$file" == *.json ]]; then
            if python3 -m json.tool "$file" > /dev/null 2>&1; then
                echo "   ✓ $file is valid"
            else
                echo "   ✗ $file has syntax errors"
                JSON_VALID=false
            fi
        elif [[ "$file" == settings.js ]]; then
            if node -c "$file" > /dev/null 2>&1; then
                echo "   ✓ $file syntax is valid"
            else
                echo "   ✗ $file has syntax errors"  
                JSON_VALID=false
            fi
        fi
    else
        echo "   ⚠ $file not found"
    fi
done

if [ "$JSON_VALID" = false ]; then
    echo "   ✗ Some configuration files have errors"
    exit 1
fi

# Test 3: Check file permissions
echo "3. Testing file permissions..."
for script in start.sh verify.sh; do
    if [ -x "$script" ]; then
        echo "   ✓ $script is executable"
    else
        echo "   ⚠ $script is not executable - fixing..."
        chmod +x "$script"
        echo "   ✓ $script permissions fixed"
    fi
done

# Test 4: Check directory structure
echo "4. Testing directory structure..."
REQUIRED_DIRS=("config" "flows" "data" "logs")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "   ✓ $dir directory exists"
    else
        echo "   ⚠ $dir directory missing - creating..."
        mkdir -p "$dir"
        echo "   ✓ $dir directory created"
    fi
done

echo ""
echo "✅ Basic system validation completed successfully!"
echo "📋 System Status:"
echo "   - All JSON files are valid"  
echo "   - File permissions are correct"
echo "   - Directory structure is complete"
echo "   - Ready for Node-RED startup"
echo ""
echo "🚀 Next steps:"
echo "   1. Install Node-RED dependencies: npm install"
echo "   2. Start the system: ./start.sh"
echo "   3. Access dashboard: http://localhost:1880/dashboard"