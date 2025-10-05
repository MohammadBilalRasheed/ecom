-- PV Grid Monitoring System Database Schema
-- SQLite database initialization script

-- Device data table for storing all device readings
CREATE TABLE IF NOT EXISTS device_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    device_type TEXT NOT NULL,
    data TEXT NOT NULL -- JSON data from devices
);

-- Control log table for storing all control actions
CREATE TABLE IF NOT EXISTS control_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    action_type TEXT NOT NULL,
    device TEXT NOT NULL,
    action TEXT NOT NULL,
    parameters TEXT -- JSON parameters
);

-- Alert log table for storing alert history
CREATE TABLE IF NOT EXISTS alert_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    alert_type TEXT NOT NULL,
    device TEXT NOT NULL,
    message TEXT NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at DATETIME NULL
);

-- System status table for storing system state snapshots
CREATE TABLE IF NOT EXISTS system_status (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    system_mode TEXT NOT NULL,
    pv_power REAL DEFAULT 0,
    genset_power REAL DEFAULT 0,
    grid_power REAL DEFAULT 0,
    load_power REAL DEFAULT 0,
    pv_efficiency REAL DEFAULT 0,
    fuel_level REAL DEFAULT 0,
    status_data TEXT -- JSON data with additional status info
);

-- Energy summary table for daily/monthly aggregations
CREATE TABLE IF NOT EXISTS energy_summary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    pv_energy_kwh REAL DEFAULT 0,
    genset_energy_kwh REAL DEFAULT 0,
    grid_import_kwh REAL DEFAULT 0,
    grid_export_kwh REAL DEFAULT 0,
    fuel_consumed_liters REAL DEFAULT 0,
    fuel_saved_liters REAL DEFAULT 0,
    co2_avoided_kg REAL DEFAULT 0,
    cost_savings_usd REAL DEFAULT 0,
    genset_runtime_hours REAL DEFAULT 0,
    UNIQUE(date)
);

-- Reports table for storing generated reports
CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    report_type TEXT NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    report_data TEXT NOT NULL, -- JSON report data
    file_path TEXT,
    exported BOOLEAN DEFAULT FALSE
);

-- Configuration table for storing system settings
CREATE TABLE IF NOT EXISTS configuration (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    config_key TEXT UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    description TEXT
);

-- Upload log table for tracking cloud/FTP uploads
CREATE TABLE IF NOT EXISTS upload_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    upload_type TEXT NOT NULL, -- 'cloud', 'ftp', 'email'
    filename TEXT NOT NULL,
    destination TEXT,
    status TEXT NOT NULL, -- 'success', 'failed', 'pending'
    error_message TEXT,
    file_size INTEGER
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_device_data_timestamp ON device_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_device_data_type ON device_data(device_type);
CREATE INDEX IF NOT EXISTS idx_control_log_timestamp ON control_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_alert_log_timestamp ON alert_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_alert_log_resolved ON alert_log(resolved);
CREATE INDEX IF NOT EXISTS idx_system_status_timestamp ON system_status(timestamp);
CREATE INDEX IF NOT EXISTS idx_energy_summary_date ON energy_summary(date);
CREATE INDEX IF NOT EXISTS idx_upload_log_timestamp ON upload_log(timestamp);

-- Insert default configuration values
INSERT OR IGNORE INTO configuration (config_key, config_value, description) VALUES
    ('max_pv_power', '10000', 'Maximum PV power capacity in watts'),
    ('max_genset_power', '15000', 'Maximum genset power capacity in watts'),
    ('min_spinning_reserve', '2000', 'Minimum spinning reserve in watts'),
    ('max_export_power', '5000', 'Maximum export power limit in watts'),
    ('zero_export_enabled', 'false', 'Enable zero export control'),
    ('load_sharing_enabled', 'true', 'Enable load sharing between sources'),
    ('fuel_saving_enabled', 'true', 'Enable fuel saving optimization'),
    ('grid_connected_mode', 'true', 'System operates in grid-connected mode'),
    ('fuel_consumption_rate', '0.3', 'Genset fuel consumption rate (L/kWh)'),
    ('fuel_cost_per_liter', '1.5', 'Fuel cost per liter'),
    ('co2_emission_factor', '0.8', 'CO2 emission factor (kg/kWh avoided)'),
    ('alert_email_enabled', 'true', 'Enable email alerts'),
    ('alert_sms_enabled', 'false', 'Enable SMS alerts'),
    ('alert_telegram_enabled', 'true', 'Enable Telegram alerts'),
    ('cloud_sync_enabled', 'true', 'Enable cloud synchronization'),
    ('cloud_sync_interval', '300', 'Cloud sync interval in seconds'),
    ('data_retention_days', '365', 'Data retention period in days'),
    ('report_auto_generation', 'true', 'Enable automatic report generation'),
    ('system_site_id', 'PV_SITE_001', 'Unique site identifier'),
    ('system_timezone', 'UTC', 'System timezone');

-- Create views for easier data access
CREATE VIEW IF NOT EXISTS latest_device_data AS
SELECT 
    device_type,
    timestamp,
    data,
    ROW_NUMBER() OVER (PARTITION BY device_type ORDER BY timestamp DESC) as rn
FROM device_data
WHERE rn = 1;

CREATE VIEW IF NOT EXISTS daily_energy_view AS
SELECT 
    DATE(timestamp) as date,
    device_type,
    COUNT(*) as reading_count,
    AVG(JSON_EXTRACT(data, '$.ac_power')) as avg_power,
    MAX(JSON_EXTRACT(data, '$.ac_power')) as max_power,
    SUM(JSON_EXTRACT(data, '$.ac_power') * 10 / 3600000) as daily_energy_kwh
FROM device_data 
WHERE JSON_EXTRACT(data, '$.ac_power') IS NOT NULL
GROUP BY DATE(timestamp), device_type;

CREATE VIEW IF NOT EXISTS active_alerts AS
SELECT 
    timestamp,
    alert_type,
    device,
    message
FROM alert_log 
WHERE resolved = FALSE
ORDER BY timestamp DESC;

-- Trigger to automatically clean old data based on retention policy
CREATE TRIGGER IF NOT EXISTS cleanup_old_data
AFTER INSERT ON device_data
WHEN (SELECT COUNT(*) FROM device_data) > 100000
BEGIN
    DELETE FROM device_data 
    WHERE timestamp < datetime('now', '-' || (
        SELECT config_value FROM configuration WHERE config_key = 'data_retention_days'
    ) || ' days');
END;