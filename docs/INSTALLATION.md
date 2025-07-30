# Installation Guide

This guide will walk you through setting up the PV Grid Monitoring System step by step.

## Prerequisites

### Hardware Requirements
- **Server/Computer**: Minimum 2GB RAM, 10GB storage
- **Network**: Ethernet connection to Modbus devices
- **Devices**: PV inverters, genset controllers, power meters with Modbus support

### Software Requirements
- **Operating System**: Linux (Ubuntu 20.04+), Windows 10+, or macOS 10.15+
- **Node.js**: Version 14 or higher
- **Database**: SQLite (included) or MySQL/PostgreSQL for production

## Step-by-Step Installation

### 1. Install Node.js

#### Ubuntu/Debian
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Windows
Download and install from [nodejs.org](https://nodejs.org/)

#### macOS
```bash
brew install node
```

Verify installation:
```bash
node --version
npm --version
```

### 2. Clone the Repository

```bash
git clone https://github.com/MohammadBilalRasheed/ecom.git
cd ecom
```

### 3. Install Dependencies

```bash
npm install
```

This will install all required Node-RED modules including:
- node-red-contrib-modbus
- node-red-dashboard
- node-red-contrib-influxdb
- node-red-node-sqlite
- And other dependencies listed in package.json

### 4. Configure Database

#### SQLite (Default - Recommended for testing)
```bash
# Create data directory if it doesn't exist
mkdir -p data

# Initialize the database
sqlite3 data/pv_monitoring.db < data/init_database.sql
```

#### MySQL (Production)
```bash
# Install MySQL
sudo apt install mysql-server

# Create database and user
mysql -u root -p
CREATE DATABASE pv_monitoring;
CREATE USER 'pv_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON pv_monitoring.* TO 'pv_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Update settings.js to use MySQL
# Uncomment and configure MySQL settings in settings.js
```

### 5. Configure Devices

Edit `config/device_config.ini` with your actual device information:

```ini
[pv_inverter]
ip_address = 192.168.1.100  # Your PV inverter IP
port = 502
unit_id = 1

[genset_controller]
ip_address = 192.168.1.101  # Your genset controller IP
port = 502
unit_id = 1

[power_meter]
ip_address = 192.168.1.102  # Your power meter IP
port = 502
unit_id = 1
```

### 6. Configure Network

Ensure your devices are accessible:
```bash
# Test connectivity to each device
ping 192.168.1.100
ping 192.168.1.101
ping 192.168.1.102

# Test Modbus connectivity (optional - requires modpoll tool)
modpoll -m tcp -a 1 -r 40001 -c 10 192.168.1.100
```

### 7. Configure Notifications (Optional)

#### Email Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an app password
3. Update `config/device_config.ini`:
```ini
[notifications]
smtp_server = smtp.gmail.com
smtp_port = 587
smtp_username = your_email@gmail.com
smtp_password = your_app_password
email_recipients = ["admin@example.com"]
```

#### Telegram Setup
1. Create a bot using @BotFather on Telegram
2. Get your chat ID from @userinfobot
3. Update the configuration:
```ini
telegram_bot_token = YOUR_BOT_TOKEN
telegram_chat_ids = ["123456789"]
```

### 8. Start the System

```bash
# Start Node-RED
npm start

# Or start with verbose logging
npm run dev
```

### 9. Access the Dashboard

Open your web browser and navigate to:
- **Node-RED Editor**: http://localhost:1880
- **Dashboard**: http://localhost:1880/ui

Default login credentials:
- Username: `admin`
- Password: `admin`

### 10. Import Flows

The flows should be automatically loaded. If not:

1. Go to Node-RED editor (http://localhost:1880)
2. Click the hamburger menu (≡) → Import
3. Select the flow files from the `flows/` directory:
   - `data-acquisition.json`
   - `control-logic.json`
   - `dashboard-monitoring.json`
   - `reporting-cloud.json`

### 11. Verify Installation

1. **Check Data Acquisition**:
   - Go to Dashboard → Overview tab
   - Verify that PV, genset, and grid data are updating

2. **Test Control Functions**:
   - Go to Dashboard → Control tab
   - Try manual control functions (be careful with actual equipment)

3. **Check Reporting**:
   - Go to Dashboard → Reports tab
   - Generate a manual report to verify database functionality

4. **Verify Alerts**:
   - Check the alerts section for any system warnings
   - Test notification systems if configured

## Troubleshooting Installation

### Common Issues

#### "Cannot connect to Modbus device"
- Check IP addresses in configuration
- Verify network connectivity with ping
- Ensure devices are configured for Modbus TCP
- Check firewall settings

#### "Database connection failed"
- Verify database file exists: `ls -la data/pv_monitoring.db`
- Check file permissions: `chmod 664 data/pv_monitoring.db`
- For MySQL: verify credentials and connection

#### "Dashboard not loading"
- Check if Node-RED is running: `ps aux | grep node-red`
- Verify port 1880 is not blocked: `netstat -tlnp | grep 1880`
- Check browser console for JavaScript errors

#### "Missing Node-RED nodes"
- Reinstall dependencies: `npm install`
- Check for node installation errors in the log
- Install missing nodes manually: `npm install node-red-contrib-modbus`

### Performance Optimization

#### For Production Deployment

1. **Use Process Manager**:
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "pv-monitor" -- start
pm2 startup
pm2 save
```

2. **Configure Reverse Proxy** (nginx example):
```nginx
server {
    listen 80;
    server_name pv-monitor.example.com;
    
    location / {
        proxy_pass http://localhost:1880;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. **Database Optimization**:
```bash
# For SQLite
sqlite3 data/pv_monitoring.db "VACUUM;"
sqlite3 data/pv_monitoring.db "ANALYZE;"

# Schedule regular maintenance
echo "0 2 * * 0 sqlite3 /path/to/data/pv_monitoring.db 'VACUUM;'" | crontab -
```

4. **Log Rotation**:
```bash
# Install logrotate configuration
sudo tee /etc/logrotate.d/pv-monitor << EOF
/path/to/ecom/data/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    sharedscripts
}
EOF
```

## Security Considerations

### Network Security
- Use VPN for remote access
- Configure firewall rules
- Use HTTPS for web access
- Regularly update system packages

### Application Security
- Change default passwords
- Use strong authentication
- Enable SSL/TLS for Modbus if supported
- Regular security updates

### Data Protection
- Regular database backups
- Encrypt sensitive configuration data
- Implement access controls
- Monitor system logs

## Next Steps

After successful installation:

1. **Device Calibration**: Verify data accuracy against physical meters
2. **Control Testing**: Test control functions in safe conditions
3. **Monitoring Setup**: Configure alerts and thresholds
4. **Backup Strategy**: Implement regular backups
5. **Documentation**: Document site-specific configurations
6. **Training**: Train operators on system usage

For advanced configuration and customization, refer to the main README.md file.