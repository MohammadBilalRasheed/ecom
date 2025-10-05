# Device Configuration Guide

This guide explains how to configure different types of devices with the PV Grid Monitoring System.

## Overview

The system supports monitoring and control of:
- **PV Inverters**: Solar photovoltaic inverters
- **Genset Controllers**: Generator set control panels
- **Power Meters**: Grid connection and load measurement devices
- **I/O Modules**: Digital input/output for breaker control

## Modbus Configuration

### Communication Protocols
- **Modbus TCP**: Primary protocol (recommended)
- **Modbus RTU**: Serial communication over RS485
- **Modbus ASCII**: Alternative serial protocol

### Register Types
- **Holding Registers (4x)**: Read/write registers for control
- **Input Registers (3x)**: Read-only measurement registers
- **Coils (0x)**: Read/write digital outputs
- **Discrete Inputs (1x)**: Read-only digital inputs

## PV Inverter Configuration

### Supported Manufacturers
The system is compatible with most Modbus-enabled inverters including:
- **SMA**: Sunny Tripower, Sunny Central series
- **ABB**: PVS800, TRIO series
- **Schneider Electric**: Conext series
- **Fronius**: Symo, Eco series
- **SolarEdge**: Three-phase inverters
- **Huawei**: SUN2000 series

### Common Register Mappings

#### SMA Sunny Tripower
```ini
[pv_inverter]
ip_address = 192.168.1.100
port = 502
unit_id = 3
registers = {
    "ac_power": [30775, 2, "int32"],          # AC Power (W)
    "ac_voltage_l1": [30783, 2, "uint32"],    # AC Voltage L1 (V)
    "ac_current_l1": [30795, 2, "uint32"],    # AC Current L1 (A)
    "dc_power": [30773, 2, "int32"],          # DC Power (W)
    "dc_voltage": [30771, 2, "int32"],        # DC Voltage (V)
    "status": [30201, 2, "uint32"],           # Operating Status
    "temperature": [30953, 2, "int32"]        # Device Temperature
}
```

#### ABB TRIO Series
```ini
[pv_inverter]
ip_address = 192.168.1.100
port = 502
unit_id = 1
registers = {
    "ac_power": [1026, 1, "uint16"],          # AC Power (W)
    "ac_voltage_l1": [1020, 1, "uint16"],     # AC Voltage L1 (V)
    "ac_current_l1": [1023, 1, "uint16"],     # AC Current L1 (A)
    "dc_power": [1029, 1, "uint16"],          # DC Power (W)
    "dc_voltage_1": [1030, 1, "uint16"],      # DC Voltage String 1
    "status": [1000, 1, "uint16"],            # Status Word
    "temperature": [1035, 1, "int16"]         # Temperature
}
```

#### Fronius Symo
```ini
[pv_inverter]
ip_address = 192.168.1.100
port = 502
unit_id = 1
registers = {
    "ac_power": [40083, 2, "int32"],          # AC Power (W)
    "ac_voltage_l1": [40085, 2, "uint32"],    # AC Voltage L1 (V)
    "ac_current_l1": [40071, 2, "int32"],     # AC Current L1 (A)
    "dc_power": [40100, 2, "int32"],          # DC Power (W)
    "dc_voltage": [40103, 2, "uint32"],       # DC Voltage (V)
    "status": [40107, 1, "uint16"],           # Device Status
    "temperature": [40110, 1, "int16"]        # Temperature
}
```

### Control Registers (if supported)
```ini
# Power limit control (percentage of rated power)
"power_limit": [40347, 1, "uint16"]          # 0-100% * 100
"power_limit_enable": [40348, 1, "uint16"]   # 0=disabled, 1=enabled

# Start/Stop control
"start_stop": [40349, 1, "uint16"]           # 0=stop, 1=start
```

## Genset Controller Configuration

### Supported Controllers
- **Caterpillar**: EMCP, PM series
- **Cummins**: PowerCommand series
- **Kohler**: APM series
- **Deep Sea Electronics**: DSE series
- **ComAp**: InteliSys, MainsPro series
- **DEIF**: AGC, ATC series

### Deep Sea Electronics DSE8610
```ini
[genset_controller]
ip_address = 192.168.1.101
port = 502
unit_id = 10
registers = {
    "ac_power": [1060, 2, "uint32"],          # Generator Power (W)
    "voltage_l1": [513, 1, "uint16"],         # Generator Voltage L1
    "voltage_l2": [514, 1, "uint16"],         # Generator Voltage L2
    "voltage_l3": [515, 1, "uint16"],         # Generator Voltage L3
    "current_l1": [525, 1, "uint16"],         # Generator Current L1
    "current_l2": [526, 1, "uint16"],         # Generator Current L2
    "current_l3": [527, 1, "uint16"],         # Generator Current L3
    "frequency": [537, 1, "uint16"],          # Generator Frequency
    "engine_rpm": [1537, 1, "uint16"],        # Engine Speed
    "engine_temp": [1541, 1, "int16"],        # Engine Temperature
    "oil_pressure": [1545, 1, "uint16"],      # Oil Pressure
    "fuel_level": [1557, 1, "uint16"],        # Fuel Level
    "run_hours": [1553, 2, "uint32"],         # Engine Hours
    "status": [2049, 1, "uint16"],            # Status Register
    "alarms": [2050, 4, "uint64"]             # Alarm Register
}

# Control registers
control_registers = {
    "start_stop": [2561, 1, "uint16"],        # 0=stop, 1=start
    "power_setpoint": [2565, 1, "uint16"],    # Power setpoint (%)
    "reset_alarms": [2571, 1, "uint16"]       # Write 1 to reset
}
```

### Caterpillar EMCP 4
```ini
[genset_controller]
ip_address = 192.168.1.101
port = 502
unit_id = 1
registers = {
    "ac_power": [4107, 2, "int32"],           # Total Real Power (kW)
    "voltage_l1": [4101, 1, "uint16"],        # Voltage L1-N
    "voltage_l2": [4102, 1, "uint16"],        # Voltage L2-N
    "voltage_l3": [4103, 1, "uint16"],        # Voltage L3-N
    "current_l1": [4104, 1, "uint16"],        # Current L1
    "current_l2": [4105, 1, "uint16"],        # Current L2
    "current_l3": [4106, 1, "uint16"],        # Current L3
    "frequency": [4108, 1, "uint16"],         # Frequency
    "engine_rpm": [4201, 1, "uint16"],        # Engine Speed
    "engine_temp": [4202, 1, "int16"],        # Engine Temperature
    "oil_pressure": [4203, 1, "uint16"],      # Oil Pressure
    "fuel_level": [4204, 1, "uint16"],        # Fuel Level
    "run_hours": [4301, 2, "uint32"],         # Engine Hours
    "status": [4001, 1, "uint16"]             # Engine Status
}
```

## Power Meter Configuration

### Supported Meters
- **Schneider Electric**: PowerLogic PM8000, ION series
- **ABB**: M4M, M2M series
- **Siemens**: SENTRON PAC series
- **Carlo Gavazzi**: EM series
- **Accuenergy**: AcuRev series
- **Eastron**: SDM series

### Schneider PowerLogic PM8000
```ini
[power_meter]
ip_address = 192.168.1.102
port = 502
unit_id = 1
registers = {
    "total_active_power": [3059, 2, "int32"],     # Total Active Power (W)
    "l1_active_power": [3053, 2, "int32"],        # L1 Active Power (W)
    "l2_active_power": [3055, 2, "int32"],        # L2 Active Power (W)
    "l3_active_power": [3057, 2, "int32"],        # L3 Active Power (W)
    "total_reactive_power": [3067, 2, "int32"],   # Total Reactive Power (VAR)
    "total_apparent_power": [3075, 2, "int32"],   # Total Apparent Power (VA)
    "l1_voltage": [3027, 2, "uint32"],            # L1-N Voltage (V)
    "l2_voltage": [3029, 2, "uint32"],            # L2-N Voltage (V)
    "l3_voltage": [3031, 2, "uint32"],            # L3-N Voltage (V)
    "l1_current": [3000, 2, "uint32"],            # L1 Current (A)
    "l2_current": [3002, 2, "uint32"],            # L2 Current (A)
    "l3_current": [3004, 2, "uint32"],            # L3 Current (A)
    "frequency": [3109, 2, "uint32"],             # Frequency (Hz)
    "power_factor": [3083, 2, "int32"],           # Total Power Factor
    "total_energy_import": [45099, 2, "uint32"],  # Total Energy Import (kWh)
    "total_energy_export": [45101, 2, "uint32"]   # Total Energy Export (kWh)
}
```

### Eastron SDM630
```ini
[power_meter]
ip_address = 192.168.1.102
port = 502
unit_id = 1
registers = {
    "total_active_power": [52, 2, "float32"],     # Total System Power (W)
    "l1_active_power": [12, 2, "float32"],        # L1 Power (W)
    "l2_active_power": [14, 2, "float32"],        # L2 Power (W)
    "l3_active_power": [16, 2, "float32"],        # L3 Power (W)
    "l1_voltage": [0, 2, "float32"],              # L1 Voltage (V)
    "l2_voltage": [2, 2, "float32"],              # L2 Voltage (V)
    "l3_voltage": [4, 2, "float32"],              # L3 Voltage (V)
    "l1_current": [6, 2, "float32"],              # L1 Current (A)
    "l2_current": [8, 2, "float32"],              # L2 Current (A)
    "l3_current": [10, 2, "float32"],             # L3 Current (A)
    "frequency": [70, 2, "float32"],              # Frequency (Hz)
    "power_factor": [62, 2, "float32"],           # Power Factor
    "total_energy_import": [72, 2, "float32"],    # Import Energy (kWh)
    "total_energy_export": [74, 2, "float32"]     # Export Energy (kWh)
}
```

## Digital I/O Configuration

### Breaker Control
For systems requiring breaker control, configure digital I/O modules:

```ini
[digital_io]
ip_address = 192.168.1.103
port = 502
unit_id = 1

# Digital Outputs (Coils)
digital_outputs = {
    "pv_breaker": [1, 1, "coil"],            # PV DC Breaker
    "genset_breaker": [2, 1, "coil"],        # Genset AC Breaker
    "grid_breaker": [3, 1, "coil"],          # Grid Breaker
    "load_disconnect": [4, 1, "coil"]        # Load Disconnect
}

# Digital Inputs (Discrete Inputs)
digital_inputs = {
    "pv_breaker_status": [1, 1, "discrete"],  # PV Breaker Position
    "genset_breaker_status": [2, 1, "discrete"], # Genset Breaker Position
    "grid_breaker_status": [3, 1, "discrete"],   # Grid Breaker Position
    "emergency_stop": [4, 1, "discrete"],        # Emergency Stop Button
    "door_switch": [5, 1, "discrete"],           # Panel Door Switch
    "fire_alarm": [6, 1, "discrete"]             # Fire Alarm Input
}
```

## Data Scaling and Units

### Scaling Factors
Many devices use scaling factors to maximize register usage:

```ini
# Common scaling factors
voltage_scale = 0.1      # Register value * 0.1 = Volts
current_scale = 0.001    # Register value * 0.001 = Amps
power_scale = 1          # Register value = Watts
energy_scale = 0.01      # Register value * 0.01 = kWh
temperature_scale = 0.1  # Register value * 0.1 = °C
```

### Data Type Conversions
```javascript
// Example scaling in Node-RED function:
const voltage = buffer.readUInt16BE(0) * 0.1;  // Scale to volts
const current = buffer.readUInt16BE(2) * 0.001; // Scale to amps
const power = buffer.readInt32BE(4);            // No scaling needed
const energy = buffer.readUInt32BE(8) * 0.01;  // Scale to kWh
```

## Testing Device Communication

### Modbus Testing Tools

#### ModPoll (Command Line)
```bash
# Test read holding registers
modpoll -m tcp -a 1 -r 40001 -c 10 192.168.1.100

# Test write single register
modpoll -m tcp -a 1 -r 40001 -c 1 -1 192.168.1.100 1000

# Test with different data types
modpoll -m tcp -a 1 -r 40001 -c 2 -4 192.168.1.100  # 32-bit integers
```

#### QModMaster (GUI)
1. Download and install QModMaster
2. Configure connection parameters
3. Add register definitions
4. Test read/write operations

#### Node-RED Modbus Nodes
Use the built-in Modbus read/write nodes for testing:
```javascript
// Test message format
msg.payload = {
    'fc': 3,           // Function code (3=read holding registers)
    'unitid': 1,       // Modbus unit ID
    'address': 40001,  // Starting register
    'quantity': 10     // Number of registers
};
```

## Troubleshooting Device Issues

### Common Problems

#### "No Response from Device"
1. Check network connectivity: `ping device_ip`
2. Verify Modbus port: `telnet device_ip 502`
3. Check unit ID configuration
4. Verify device Modbus settings

#### "Invalid Register Address"
1. Check device documentation for correct addresses
2. Verify register addressing format (0-based vs 1-based)
3. Confirm register availability in device
4. Check for read-only vs read-write registers

#### "Data Format Errors"
1. Verify data type (int16, uint32, float32, etc.)
2. Check byte order (big-endian vs little-endian)
3. Confirm scaling factors
4. Validate register count for multi-register values

#### "Timeout Errors"
1. Increase timeout values in Modbus configuration
2. Reduce polling frequency
3. Check network latency
4. Verify device processing capabilities

### Device-Specific Considerations

#### PV Inverters
- Some inverters require specific wake-up sequences
- Night mode may disable Modbus communication
- Firmware versions may affect register maps
- Safety shutdowns may affect communication

#### Genset Controllers
- Engine must be running for some measurements
- Control functions may require specific modes
- Safety interlocks may prevent remote control
- Password protection may be enabled

#### Power Meters
- Some meters require initialization sequences
- CT/VT ratios affect measurement scaling
- Clock synchronization may be important
- Demand calculations may use different timeframes

## Security Considerations

### Network Security
- Use VLANs to isolate device networks
- Implement firewall rules for Modbus traffic
- Consider VPN for remote access
- Monitor network traffic for anomalies

### Device Security
- Change default passwords on devices
- Disable unused network services
- Update device firmware regularly
- Use read-only access where possible

### Protocol Security
- Modbus has no built-in security
- Consider Modbus/TLS for encrypted communication
- Implement application-level authentication
- Log all control commands for audit trails

This configuration guide provides the foundation for connecting various devices to the PV Grid Monitoring System. Always refer to specific device manuals for exact register mappings and configuration requirements.