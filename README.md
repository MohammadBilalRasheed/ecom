# PV Grid Monitoring System

A comprehensive Node-RED based system for monitoring and controlling PV inverters, gensets, and grid connections. This system provides real-time monitoring, intelligent control logic, automated reporting, and cloud integration for solar power installations.

## 🌟 Features

### 📊 Data Acquisition
- **Modbus Communication**: Read data from PV inverters, genset controllers, and power meters
- **Real-time Monitoring**: Continuous data collection every 2-5 seconds
- **Device Support**: Compatible with most industrial Modbus devices
- **Data Validation**: Automatic error detection and data validation

### 🎛️ Control Logic
- **Intelligent Control**: Automated PV curtailment and genset management
- **Fuel Optimization**: Dynamic control for maximum fuel saving
- **Load Sharing**: Optimal power distribution between sources
- **Grid Management**: Zero export control and reverse power protection
- **Manual Override**: Emergency stop and manual control capabilities

### 📈 Dashboard & Monitoring
- **Real-time Dashboard**: Live system overview with gauges and charts
- **Power Flow Diagram**: Visual representation of power flow
- **Historical Data**: Time-series charts and data trends
- **Alert Management**: Active alert monitoring and notifications

### 📋 Reporting & Analytics
- **Automated Reports**: Daily, weekly, and monthly energy reports
- **Multiple Formats**: JSON, CSV, and HTML report generation
- **Performance Metrics**: Efficiency analysis and fuel savings calculations
- **Custom Reports**: Generate reports for any date range

### ☁️ Cloud Integration
- **Real-time Sync**: Live data streaming to cloud services
- **Multiple Platforms**: Support for AWS, Google Cloud, Azure
- **FTP Export**: Automated file transfer to FTP servers
- **Email Reports**: Automatic email delivery of reports

### 🚨 Alerts & Protection
- **Multi-channel Alerts**: Email, SMS, and Telegram notifications
- **Critical Monitoring**: Engine protection and grid fault detection
- **Customizable Thresholds**: Configurable alert conditions
- **Alert History**: Complete audit trail of all alerts

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PV Inverter   │    │ Genset Controller│    │  Power Meter    │
│   (Modbus TCP)  │    │   (Modbus TCP)   │    │  (Modbus TCP)   │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │      Node-RED System      │
                    │   ┌─────────────────────┐ │
                    │   │  Data Acquisition   │ │
                    │   └─────────────────────┘ │
                    │   ┌─────────────────────┐ │
                    │   │   Control Logic     │ │
                    │   └─────────────────────┘ │
                    │   ┌─────────────────────┐ │
                    │   │ Dashboard & UI      │ │
                    │   └─────────────────────┘ │
                    │   ┌─────────────────────┐ │
                    │   │ Reporting System    │ │
                    │   └─────────────────────┘ │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │     Output Systems        │
                    │ ┌─────┐ ┌─────┐ ┌─────┐   │
                    │ │Cloud│ │Email│ │ FTP │   │
                    │ └─────┘ └─────┘ └─────┘   │
                    └───────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ installed
- Network access to Modbus devices
- SMTP server for email notifications (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MohammadBilalRasheed/ecom.git
   cd ecom
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure devices**
   Edit `config/device_config.ini` with your device IP addresses and Modbus register mappings:
   ```ini
   [pv_inverter]
   ip_address = 192.168.1.100
   port = 502
   unit_id = 1
   
   [genset_controller]
   ip_address = 192.168.1.101
   port = 502
   unit_id = 1
   
   [power_meter]
   ip_address = 192.168.1.102
   port = 502
   unit_id = 1
   ```

4. **Initialize database**
   ```bash
   sqlite3 data/pv_monitoring.db < data/init_database.sql
   ```

5. **Start Node-RED**
   ```bash
   npm start
   ```

6. **Access the dashboard**
   Open your browser to `http://localhost:1880`
   - Default username: `admin`
   - Default password: `admin`

## 📁 Project Structure

```
ecom/
├── flows/                      # Node-RED flow files
│   ├── data-acquisition.json   # Modbus data collection
│   ├── control-logic.json      # System control algorithms
│   ├── dashboard-monitoring.json # UI and monitoring
│   └── reporting-cloud.json    # Reports and cloud sync
├── config/                     # Configuration files
│   └── device_config.ini       # Device settings
├── data/                       # Data storage
│   ├── init_database.sql       # Database schema
│   ├── reports/               # Generated reports
│   └── logs/                  # System logs
├── docs/                       # Documentation
├── backup/                     # Flow backups
├── package.json               # Node.js dependencies
├── settings.js                # Node-RED settings
└── README.md                  # This file
```

## ⚙️ Configuration

### Device Configuration
Edit `config/device_config.ini` to match your hardware:
- **IP Addresses**: Set correct IP addresses for all devices
- **Modbus Registers**: Adjust register mappings for your specific devices
- **System Limits**: Configure power limits and operational parameters

### Notification Setup
Configure email and messaging in `config/device_config.ini`:
```ini
[notifications]
smtp_server = smtp.gmail.com
smtp_port = 587
smtp_username = your_email@gmail.com
smtp_password = your_app_password
email_recipients = ["admin@example.com"]
```

### Cloud Integration
Enable cloud sync by configuring your preferred cloud provider:
```ini
[cloud_integration]
enable_cloud_sync = true
sync_interval_seconds = 300
# Add your cloud provider credentials
```

## 🎯 Usage

### Dashboard Access
1. Navigate to `http://localhost:1880/ui`
2. Monitor real-time system status
3. View power flow diagrams and charts
4. Check active alerts and system health

### Manual Control
1. Go to the "Control" tab in the dashboard
2. Use manual override for emergency situations
3. Adjust PV power limits and genset targets
4. Configure system operational parameters

### Report Generation
1. Access the "Reports" tab
2. Generate manual reports for any date range
3. View automated daily/weekly/monthly reports
4. Export reports in JSON, CSV, or HTML format

### Alert Management
- Critical alerts are sent via email and SMS
- Warning alerts are sent via email and Telegram
- Info alerts are logged and displayed in dashboard
- Configure alert thresholds in system settings

## 🔧 Advanced Configuration

### Custom Device Integration
To add support for new devices:
1. Update `config/device_config.ini` with device parameters
2. Modify the Modbus client configurations in flows
3. Add device-specific parsing logic in data acquisition flow
4. Update dashboard widgets for new data points

### Control Algorithm Customization
The control logic can be customized by modifying the `system-state-analyzer` function node:
- Adjust fuel saving algorithms
- Modify load sharing logic
- Customize curtailment strategies
- Add custom protection logic

### Database Customization
- Default: SQLite for simplicity
- Production: MySQL/PostgreSQL for scalability
- Time-series: InfluxDB for historical data
- Configure in `settings.js` and update flow connections

## 📊 Monitoring & Maintenance

### Performance Monitoring
- Monitor CPU and memory usage
- Check Modbus communication status
- Verify database performance
- Review system logs regularly

### Data Backup
- Automatic database backups included
- Flow configurations backed up in `backup/`
- Export settings and configurations regularly
- Implement off-site backup for critical data

### System Updates
- Update Node-RED and dependencies regularly
- Test updates in development environment first
- Backup flows before major updates
- Monitor system after updates

## 🛠️ Troubleshooting

### Common Issues

**Modbus Communication Errors**
- Check device IP addresses and network connectivity
- Verify Modbus register mappings
- Ensure correct unit IDs and function codes
- Test with Modbus polling tools

**Dashboard Not Loading**
- Check Node-RED service status
- Verify port 1880 is accessible
- Check browser console for errors
- Restart Node-RED service

**Missing Data**
- Check device connectivity
- Verify database permissions
- Review Node-RED debug messages
- Check system resource usage

**Email Notifications Not Working**
- Verify SMTP settings
- Check email credentials and app passwords
- Test with email client first
- Review firewall and network settings

### Log Files
- Node-RED logs: `data/node-red.log`
- System logs: Check Node-RED debug panel
- Database logs: SQLite command line interface
- Flow execution: Use debug nodes in flows

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Node-RED community for the excellent platform
- Modbus device manufacturers for protocol documentation
- Open source contributors for various Node-RED nodes
- Solar industry professionals for requirements and testing

## 📞 Support

For support and questions:
- Create an issue in this repository
- Check the documentation in the `docs/` folder
- Review Node-RED community forums
- Contact the development team

---

**Built with ❤️ for the renewable energy community**