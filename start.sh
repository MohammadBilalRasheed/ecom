#!/bin/bash

# PV Grid Monitoring System Startup Script
# This script initializes and starts the Node-RED system

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node --version | sed 's/v//')
        REQUIRED_VERSION="14.0.0"
        if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
            print_success "Node.js version $NODE_VERSION is compatible"
            return 0
        else
            print_error "Node.js version $NODE_VERSION is too old. Required: $REQUIRED_VERSION or higher"
            return 1
        fi
    else
        print_error "Node.js is not installed"
        return 1
    fi
}

# Function to initialize database
init_database() {
    print_status "Initializing database..."
    
    if [ ! -d "data" ]; then
        mkdir -p data
        print_status "Created data directory"
    fi
    
    if [ ! -f "data/pv_monitoring.db" ]; then
        if command_exists sqlite3; then
            sqlite3 data/pv_monitoring.db < data/init_database.sql
            print_success "Database initialized successfully"
        else
            print_error "SQLite3 is not installed. Please install it first."
            exit 1
        fi
    else
        print_status "Database already exists"
    fi
}

# Function to check network connectivity to devices
check_device_connectivity() {
    print_status "Checking device connectivity..."
    
    # Read device IPs from config file
    if [ -f "config/device_config.ini" ]; then
        # Extract IP addresses (simple grep, assumes standard format)
        PV_IP=$(grep "ip_address.*192" config/device_config.ini | head -1 | sed 's/.*= *//')
        GENSET_IP=$(grep "ip_address.*192" config/device_config.ini | sed -n '2p' | sed 's/.*= *//')
        METER_IP=$(grep "ip_address.*192" config/device_config.ini | tail -1 | sed 's/.*= *//')
        
        # Test connectivity
        for ip in $PV_IP $GENSET_IP $METER_IP; do
            if [ -n "$ip" ]; then
                if ping -c 1 -W 3 "$ip" >/dev/null 2>&1; then
                    print_success "Device at $ip is reachable"
                else
                    print_warning "Device at $ip is not reachable"
                fi
            fi
        done
    else
        print_warning "Device configuration file not found, skipping connectivity check"
    fi
}

# Function to create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    directories=("data/reports" "data/logs" "backup" "static")
    
    for dir in "${directories[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            print_status "Created directory: $dir"
        fi
    done
}

# Function to set file permissions
set_permissions() {
    print_status "Setting file permissions..."
    
    # Make startup script executable
    chmod +x start.sh
    
    # Set database permissions
    if [ -f "data/pv_monitoring.db" ]; then
        chmod 664 data/pv_monitoring.db
    fi
    
    # Set log directory permissions
    chmod 755 data/logs
    
    print_success "Permissions set successfully"
}

# Function to start Node-RED
start_nodered() {
    print_status "Starting Node-RED..."
    
    # Check if Node-RED is already running
    if pgrep -f "node-red" > /dev/null; then
        print_warning "Node-RED is already running"
        return 0
    fi
    
    # Start Node-RED
    if [ "$1" = "dev" ]; then
        print_status "Starting in development mode with verbose logging..."
        npm run dev
    else
        print_status "Starting in production mode..."
        npm start
    fi
}

# Function to show system status
show_status() {
    print_status "System Status Check"
    echo "=========================="
    
    # Check Node.js
    if command_exists node; then
        echo "Node.js: $(node --version)"
    else
        echo "Node.js: Not installed"
    fi
    
    # Check NPM
    if command_exists npm; then
        echo "NPM: $(npm --version)"
    else
        echo "NPM: Not installed"
    fi
    
    # Check database
    if [ -f "data/pv_monitoring.db" ]; then
        echo "Database: Available"
        DB_SIZE=$(du -h data/pv_monitoring.db | cut -f1)
        echo "Database Size: $DB_SIZE"
    else
        echo "Database: Not initialized"
    fi
    
    # Check Node-RED process
    if pgrep -f "node-red" > /dev/null; then
        echo "Node-RED: Running (PID: $(pgrep -f "node-red"))"
    else
        echo "Node-RED: Not running"
    fi
    
    # Check ports
    if command_exists netstat; then
        if netstat -tlnp 2>/dev/null | grep -q ":1880"; then
            echo "Port 1880: In use (Node-RED)"
        else
            echo "Port 1880: Available"
        fi
    fi
    
    echo "=========================="
}

# Function to stop the system
stop_system() {
    print_status "Stopping PV Grid Monitoring System..."
    
    if pgrep -f "node-red" > /dev/null; then
        pkill -f "node-red"
        print_success "Node-RED stopped"
    else
        print_status "Node-RED was not running"
    fi
}

# Function to show help
show_help() {
    echo "PV Grid Monitoring System Control Script"
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start       Start the system (default)"
    echo "  start-dev   Start in development mode with verbose logging"
    echo "  stop        Stop the system"
    echo "  restart     Restart the system"
    echo "  status      Show system status"
    echo "  init        Initialize database and directories"
    echo "  check       Check system requirements and connectivity"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start      # Start the system"
    echo "  $0 start-dev  # Start with verbose logging"
    echo "  $0 status     # Check system status"
}

# Main script logic
main() {
    case "${1:-start}" in
        "start")
            print_status "Starting PV Grid Monitoring System..."
            check_node_version || exit 1
            create_directories
            init_database
            set_permissions
            print_success "System initialized successfully"
            start_nodered
            ;;
        "start-dev")
            print_status "Starting PV Grid Monitoring System in development mode..."
            check_node_version || exit 1
            create_directories
            init_database
            set_permissions
            print_success "System initialized successfully"
            start_nodered "dev"
            ;;
        "stop")
            stop_system
            ;;
        "restart")
            stop_system
            sleep 2
            main "start"
            ;;
        "status")
            show_status
            ;;
        "init")
            print_status "Initializing PV Grid Monitoring System..."
            check_node_version || exit 1
            create_directories
            init_database
            set_permissions
            print_success "System initialization completed"
            ;;
        "check")
            print_status "Checking system requirements..."
            check_node_version
            check_device_connectivity
            show_status
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Trap Ctrl+C to gracefully stop
trap 'print_status "Received interrupt signal, stopping..."; stop_system; exit 0' INT TERM

# Check if script is run from correct directory
if [ ! -f "package.json" ] || [ ! -f "settings.js" ]; then
    print_error "This script must be run from the PV Grid Monitoring System directory"
    print_error "Please navigate to the correct directory and try again"
    exit 1
fi

# Run main function with all arguments
main "$@"