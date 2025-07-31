# Industrial Modbus Power Control System

Professional Node-RED based system for advanced Modbus integration and power control logic specifically designed for:
- **Huawei SmartLogger 3000A** (PV Inverter) - IP: 192.168.88.4
- **SICES GC600** (Genset Controller) - IP: 192.168.88.6  
- **SICES MC200** (Grid Monitoring Controller) - IP: 192.168.88.7

## 🎯 Key Features

### Real-Time Modbus Communication
- **Device-specific register mappings** based on official technical manuals
- **TCP/IP Modbus communication** with automatic reconnection
- **High-frequency data acquisition** (2-3 second intervals)
- **Comprehensive error handling** and retry mechanisms

### Advanced Control Logic
- **Zero Export Protection** - Prevents power export to grid using MC200 monitoring
- **Intelligent Load Sharing** - PV priority with genset balancing
- **Gradual Ramp Control** - Smooth genset transitions to prevent mechanical stress
- **Import/Export Management** - Dynamic MGCB control based on grid conditions

### Professional Dashboard 2.0
- **Industrial-grade interface** using FlowFuse Dashboard 2.0
- **Real-time power flow visualization** with animated diagrams
- **Device status monitoring** with color-coded indicators
- **Manual control toggles** for MGCB, genset, and export control
- **Professional styling** optimized for industrial environments

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Network access to devices on specified IP addresses
- Modern web browser for dashboard access

### Installation & Startup
```bash
# Clone the repository
git clone https://github.com/MohammadBilalRasheed/ecom.git
cd ecom

# Start the system (auto-installs dependencies)
./start.sh
```

### Access Points
- **Dashboard**: http://localhost:1880/dashboard
- **Node-RED Editor**: http://localhost:1880
- **Default Login**: admin/admin (⚠️ Change in production!)

## 📋 Device Configuration

### Huawei SmartLogger 3000A (192.168.88.4)
**Monitored Parameters:**
- Active/Reactive Power Output (kW/kVar)
- 3-Phase Voltage & Current
- Grid Frequency
- Daily/Total Energy Production
- Device Status & Alarms

**Control Functions:**
- Active Power Curtailment (0-100%)
- Reactive Power Setpoint

### SICES GC600 (192.168.88.6)
**Monitored Parameters:**
- Genset Power Output (kW/kVar/kVA)
- Engine Parameters (RPM, Temperature, Oil Pressure)
- Fuel Level & Consumption
- Operating Hours
- Alarm & Warning Status

**Control Functions:**
- Start/Stop Commands
- Power Setpoint Control (0-100%)
- Load Ramp Rate Configuration

### SICES MC200 (192.168.88.7)
**Monitored Parameters:**
- Grid Power (Import/Export)
- 3-Phase Voltage & Current
- Import/Export Energy Counters
- Phase Sequence & Grid Status
- Protection System Status

**Control Functions:**
- Main Grid Circuit Breaker (MGCB) Control
- Export Enable/Disable
- Import/Export Power Limits

## ⚙️ Control Logic Features

### Zero Export Protection
```javascript
// Automatically curtails PV when export exceeds threshold
if (exportPower > zeroExportThreshold) {
    // Curtail PV inverter output
    // Increase genset load if running
}
```

### Load Sharing Algorithm
- **PV Priority**: Always maximize solar generation first
- **Genset Balancing**: Maintain optimal genset loading (20-80%)
- **Grid Import Minimization**: Reduce grid dependency during peak hours
- **Spinning Reserve**: Maintain backup capacity for load fluctuations

### Gradual Ramp Control
- **Configurable ramp rates** (default: 1%/second)
- **Minimum run times** to prevent frequent starts
- **Cooldown periods** between genset cycles

## 📊 Dashboard Overview

### System Overview Page
- **Power Flow Diagram**: Real-time visualization of energy flow
- **System Status**: Overall health indicators
- **Load Sharing**: Visual breakdown of power sources

### Device Status Page
- **Individual device monitoring** with detailed parameters
- **Alarm indicators** with severity levels
- **Historical trend charts** for key parameters

### Manual Control Page
- **Emergency controls** for MGCB and genset
- **Power limit sliders** for PV and genset
- **Export enable/disable** toggles
- **Manual override** capabilities

## 🔧 Configuration Files

### Device Configurations
- `config/huawei_smartlogger_3000a.json` - Inverter register mappings
- `config/sices_gc600.json` - Genset controller mappings  
- `config/sices_mc200.json` - Grid monitor mappings

### Node-RED Flows
- `flows/modbus_data_acquisition.json` - Data collection logic
- `flows/power_control_logic.json` - Control algorithms
- `flows/dashboard_monitoring.json` - Dashboard interface

### System Settings
- `settings.js` - Node-RED configuration with industrial optimizations
- `package.json` - Dependencies and project metadata

## 🛡️ Safety & Protection

### Built-in Protections
- **Zero Export Protection** prevents grid feedback
- **Overload Protection** monitors power limits
- **Communication Timeout** handling with safe defaults
- **Manual Override** capabilities for emergency situations

### Monitoring & Alarms
- **Device connectivity monitoring** with health checks
- **Parameter validation** and range checking
- **Automatic logging** of all control actions
- **System health dashboard** with real-time status

## 📈 Performance Optimization

### Industrial Features
- **High-speed data acquisition** optimized for industrial networks
- **Buffered commands** to prevent Modbus conflicts
- **Automatic reconnection** with exponential backoff
- **Context persistence** for reliable operation

### Dashboard Performance
- **Efficient updates** using Dashboard 2.0 architecture
- **Responsive design** for various screen sizes
- **Professional styling** with industrial color schemes
- **Real-time animations** without performance impact

## 🔒 Security Considerations

### Production Deployment
```javascript
// Change default credentials in settings.js
adminAuth: {
    users: [{
        username: "your-username",
        password: "secure-hashed-password",
        permissions: "*"
    }]
}
```

### Network Security
- Configure firewall rules for Modbus TCP ports
- Use VPN for remote access
- Implement network segmentation
- Regular security updates

## 📝 Technical Documentation

### Modbus Register References
- [Huawei SmartLogger Modbus Interface](https://support.huawei.com/enterprise/en/doc/EDOC1100050690)
- [SICES GC600 Technical Manual](https://www.meccalte.com/downloads/GC600_Technical_Manual___EAAM052220EN_MA.pdf)
- [SICES MC200 Register List](https://sices.eu/wp-content/uploads/2023/12/EAAS058909XA.pdf)

### System Architecture
The system uses a modular architecture with separate flows for:
1. **Data Acquisition** - Continuous Modbus polling
2. **Control Logic** - Decision making and command generation
3. **Dashboard** - Real-time visualization and manual control
4. **Health Monitoring** - System status and diagnostics

## 🚨 Troubleshooting

### Project Compilation & Setup Issues

**Fixed Issues in Latest Version:**
1. **JSON Syntax Errors** ✅ Fixed
   - Corrected malformed JSON in flow files
   - Removed embedded newline characters and unescaped quotes
   - All configuration files now pass JSON validation

2. **Missing Dependencies** ⚠️ Network dependent
   - Package.json references corrected
   - Removed invalid setup.js reference
   - Installation script handles network failures gracefully

3. **File Permission Issues** ✅ Fixed
   - All shell scripts now have proper execute permissions
   - Directory structure validation and auto-creation

4. **Node-RED Configuration** ✅ Fixed
   - Settings.js syntax validated
   - Proper context storage configuration
   - Industrial optimizations applied

**Validation Commands:**
```bash
# Test all JSON files
find . -name "*.json" -exec python3 -m json.tool {} /dev/null \;

# Validate Node-RED configuration
node -c settings.js

# Run system validation
./test.sh
```

### Common Issues
1. **Device Connection Failures**
   - Verify IP addresses and network connectivity
   - Check Modbus TCP port 502 accessibility
   - Validate device unit IDs

2. **Dashboard Not Loading**
   - Ensure Dashboard 2.0 package is installed
   - Check browser compatibility
   - Verify Node-RED is running on port 1880

3. **Control Commands Not Working**
   - Check manual override status
   - Verify device write permissions
   - Monitor Modbus write confirmations

### Log Analysis
```bash
# View system logs
tail -f logs/node-red.log

# Check Node-RED debug output
# Access via dashboard debug tab
```

## 📞 Support

For technical support and customization:
- Review device-specific documentation links above
- Check Node-RED community forums
- Contact system integrator for site-specific modifications

---

**⚡ Built for Industrial Excellence - Reliable, Professional, Scalable ⚡**