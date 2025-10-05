# Flow Architecture Guide

This document explains the Node-RED flow architecture and how the different components work together.

## Overview

The PV Grid Monitoring System consists of four main flow files:

1. **data-acquisition.json** - Device communication and data collection
2. **control-logic.json** - System control algorithms and decision making
3. **dashboard-monitoring.json** - User interface and real-time monitoring
4. **reporting-cloud.json** - Report generation and cloud integration

## Flow Architecture

### Data Flow Pipeline

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Modbus       │    │    Control      │    │   Dashboard     │
│   Devices       │───▶│    Logic        │───▶│   & Alerts      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Database      │    │   Historical    │    │    Cloud        │
│   Storage       │    │   Analytics     │    │ Integration     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 1. Data Acquisition Flow (data-acquisition.json)

### Purpose
Collects real-time data from all connected devices via Modbus protocol.

### Key Components

#### Modbus Client Configurations
- **PV Inverter Client**: Connects to solar inverters
- **Genset Controller Client**: Connects to generator controllers  
- **Power Meter Client**: Connects to grid/load measurement devices

#### Data Processing Nodes
```javascript
// Example: PV Data Parser
const parsed = {
    timestamp: new Date().toISOString(),
    device: 'pv_inverter',
    ac_power: buffer.readUInt32BE(0) / 10,
    ac_voltage: buffer.readUInt32BE(4) / 10,
    dc_power: buffer.readUInt32BE(16) / 10,
    efficiency: (ac_power / dc_power) * 100
};
```

#### Data Storage
- **Database Writer**: Stores data in SQLite/MySQL
- **File Logger**: Creates CSV logs for backup
- **Context Storage**: Maintains latest values for real-time access

#### Status Monitoring
- **Device Health Checks**: Monitors communication status
- **Data Validation**: Ensures data quality and consistency
- **Alert Generation**: Creates alerts for device faults

### Data Flow
```
Modbus Read → Parse Data → Validate → Store → Alert Check → Dashboard Update
```

## 2. Control Logic Flow (control-logic.json)

### Purpose
Implements intelligent control algorithms for optimal system operation.

### Key Components

#### System State Analyzer
The core control logic that:
- Analyzes current system state
- Calculates optimal power distribution
- Determines control actions needed
- Implements fuel-saving strategies

```javascript
// Control Decision Logic
const controlDecisions = {
    pv_curtailment: 0,
    genset_target_power: 0,
    genset_start_stop: 'maintain',
    export_limit_active: false
};

// Grid-connected vs Off-grid logic
if (config.grid_connected && systemState.grid_connected) {
    // Grid-connected control logic
    if (config.zero_export_enabled) {
        // Zero export control
    } else {
        // Limited export control
    }
} else {
    // Off-grid control logic
    // Load sharing and spinning reserve management
}
```

#### Control Execution
- **PV Controller**: Manages solar inverter curtailment
- **Genset Controller**: Controls generator start/stop and power output
- **Modbus Write Operations**: Sends commands to devices

#### Manual Override System
- **Emergency Stop**: Immediate shutdown of all generation
- **Manual Control Panel**: UI for operator intervention
- **Configuration Manager**: System parameter adjustment

#### Safety Systems
- **Protection Logic**: Prevents unsafe operating conditions
- **Error Handling**: Manages communication failures
- **Alarm Management**: Critical alert processing

### Control Flow
```
Timer → Analyze State → Calculate Decisions → Execute Commands → Log Actions
```

## 3. Dashboard & Monitoring Flow (dashboard-monitoring.json)

### Purpose
Provides real-time visualization and user interface for system monitoring.

### Key Components

#### Real-time Data Aggregation
```javascript
// Data aggregator combines all system data
const systemOverview = {
    pv_power: pvData.ac_power || 0,
    genset_power: gensetData.ac_power || 0,
    grid_power: gridData.total_active_power || 0,
    load_power: totalGeneration + gridPower,
    system_efficiency: (loadPower / totalGeneration) * 100
};
```

#### Dashboard Widgets
- **Power Gauges**: Real-time power measurements
- **Status Indicators**: Device operational status
- **Efficiency Meters**: Performance monitoring
- **Historical Charts**: Time-series data visualization

#### Power Flow Diagram
Interactive SVG diagram showing:
- Power flow directions
- Real-time power values
- System connectivity status
- Visual alerts and warnings

#### Alert Management
- **Active Alerts List**: Current system alerts
- **Alert History**: Historical alert tracking
- **Alert Notifications**: Real-time alert display

### UI Flow
```
Data Update → Process → Route to Widgets → Update Display → User Interaction
```

## 4. Reporting & Cloud Flow (reporting-cloud.json)

### Purpose
Generates reports and manages cloud integration for remote monitoring.

### Key Components

#### Report Generation
```javascript
// Report structure
const report = {
    type: 'daily',
    period: '2024-01-15',
    summary: {
        total_pv_energy: 45.2,
        total_genset_energy: 12.8,
        fuel_saved: 13.56,
        cost_savings: 20.34,
        co2_avoided: 36.16
    },
    performance: {
        avg_pv_efficiency: 94.2,
        peak_solar_power: 8500,
        genset_runtime_hours: 3.2
    }
};
```

#### Multi-format Export
- **JSON**: For API integration and cloud upload
- **CSV**: For Excel analysis and data processing
- **HTML**: For email reports and web viewing

#### Cloud Integration
- **Real-time Sync**: Live data streaming every 5 minutes
- **Batch Upload**: Scheduled data exports
- **Multiple Platforms**: AWS, Google Cloud, Azure support
- **FTP Export**: Legacy system integration

#### Scheduled Operations
- **Daily Reports**: Generated at midnight
- **Weekly Reports**: Generated Monday mornings
- **Monthly Reports**: Generated first of month
- **Custom Reports**: On-demand generation

### Reporting Flow
```
Schedule Trigger → Query Database → Process Data → Generate Reports → Export/Send
```

## Data Context and Global Variables

### Global Context Variables
The system uses Node-RED's global context to share data between flows:

```javascript
// Device data
global.set('pv_data', parsedPVData);
global.set('genset_data', parsedGensetData);
global.set('power_meter_data', parsedGridData);

// System state
global.set('system_state', calculatedState);
global.set('control_decisions', controlActions);

// Configuration
global.set('system_config', systemSettings);

// Status flags
global.set('emergency_stop', false);
global.set('manual_override', false);
```

### Flow Context Variables
Each flow maintains its own context for local data:

```javascript
// Store recent data for trending
context.set('last_10_readings', dataArray);

// Track alert states
context.set('active_alerts', alertList);

// Cache calculations
context.set('daily_stats', statisticsObject);
```

## Inter-Flow Communication

### Message Passing
Flows communicate via standardized message formats:

```javascript
// Standard data message
{
    topic: 'device/data',
    payload: {
        timestamp: '2024-01-15T10:30:00Z',
        device: 'pv_inverter',
        data: { /* device measurements */ }
    }
}

// Control command message
{
    topic: 'control/command',
    payload: {
        device: 'genset',
        action: 'start',
        parameters: { target_power: 5000 }
    }
}

// Alert message
{
    topic: 'alert/critical',
    payload: {
        type: 'critical',
        device: 'genset',
        message: 'Engine temperature high',
        timestamp: '2024-01-15T10:30:00Z'
    }
}
```

### Link Nodes
The system uses Node-RED link nodes for clean flow organization:
- **Data Distribution**: Send data to multiple flows
- **Alert Routing**: Route alerts to notification systems
- **Command Routing**: Route control commands to appropriate handlers

## Error Handling and Recovery

### Communication Errors
```javascript
// Modbus error handling
if (msg.error) {
    node.error(`Modbus communication failed: ${msg.error}`);
    // Set device offline status
    global.set('device_online_status', {
        pv_inverter: false,
        timestamp: new Date().toISOString()
    });
    return null;
}
```

### Data Validation
```javascript
// Data validation example
if (data.ac_power < 0 || data.ac_power > maxPower) {
    node.warn(`Invalid power reading: ${data.ac_power}W`);
    // Use last known good value
    data.ac_power = context.get('last_valid_power') || 0;
}
```

### Recovery Mechanisms
- **Automatic Retry**: Failed operations are retried with exponential backoff
- **Fallback Values**: Use cached data when devices are offline
- **Safe Mode**: Emergency protocols when critical systems fail
- **Manual Override**: Allow operator intervention in fault conditions

## Performance Considerations

### Timing and Scheduling
- **High Priority**: Safety monitoring (1-2 seconds)
- **Medium Priority**: Control logic (10 seconds)
- **Low Priority**: Reporting and logging (60+ seconds)

### Resource Management
- **Memory Usage**: Limit historical data in memory
- **Database Performance**: Use indexes and periodic cleanup
- **Network Traffic**: Optimize Modbus polling intervals
- **CPU Usage**: Efficient data processing algorithms

### Scalability
- **Multiple Sites**: Flow architecture supports multi-site deployment
- **Device Expansion**: Easily add new device types
- **Load Distribution**: Separate flows can run on different instances
- **Cloud Scaling**: Cloud integration supports horizontal scaling

This architecture provides a robust, scalable foundation for industrial PV monitoring and control systems while maintaining flexibility for customization and expansion.