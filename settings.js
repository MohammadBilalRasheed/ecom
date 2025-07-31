/**
 * Node-RED Configuration for Industrial Modbus Power Control System
 * Optimized for Huawei SmartLogger 3000A, SICES GC600, and SICES MC200
 */

module.exports = {
    // Runtime settings
    uiPort: process.env.PORT || 1880,
    mqttReconnectTime: 15000,
    serialReconnectTime: 15000,
    debugMaxLength: 1000,
    
    // Function node settings for industrial control
    functionGlobalContext: {
        os: require('os'),
        moment: require('moment'),
        // Device configurations
        devices: {
            huawei_smartlogger: {
                ip: '192.168.88.4',
                port: 502,
                unitId: 1,
                reconnectTimeout: 5000
            },
            sices_gc600: {
                ip: '192.168.88.6', 
                port: 502,
                unitId: 1,
                reconnectTimeout: 5000
            },
            sices_mc200: {
                ip: '192.168.88.7', // Placeholder IP
                port: 502,
                unitId: 1,
                reconnectTimeout: 5000
            }
        },
        // Control parameters
        control: {
            zeroExportThreshold: 50, // Watts
            loadShareRampRate: 1.0, // %/second
            gensetMinRunTime: 300, // seconds
            gensetCooldownTime: 120, // seconds
            pvPriority: true
        }
    },

    // Logging configuration
    logging: {
        console: {
            level: "info",
            metrics: false,
            audit: false
        },
        file: {
            level: "info",
            filename: "./logs/node-red.log",
            maxFiles: 5,
            maxFileSize: "10MB"
        }
    },

    // Editor settings  
    editorTheme: {
        projects: {
            enabled: false
        },
        palette: {
            editable: true,
            catalogues: [
                'https://catalogue.nodered.org/catalogue.json'
            ],
            theme: [
                {
                    category: "industrial",
                    type: "modbus",
                    color: "#3FADB5"
                }
            ]
        },
        header: {
            title: "Industrial Power Control System",
            image: null
        }
    },

    // Security settings for industrial environment
    adminAuth: {
        type: "credentials",
        users: [{
            username: "admin",
            password: "$2b$08$Qx2.1.rWOQNiP8wpHTGp8.rJ2fv/aGpLHKV6JgPYOF4zDKBFLHnYe", // Change this!
            permissions: "*"
        }]
    },

    // HTTPS settings (uncomment for production)
    /*
    https: {
        key: require("fs").readFileSync('privatekey.pem'),
        cert: require("fs").readFileSync('certificate.pem')
    },
    */

    // Context storage for data persistence
    contextStorage: {
        default: "memoryOnly",
        file: {
            module: "localfilesystem",
            config: {
                dir: "./data/context"
            }
        }
    },

    // Export settings
    exportGlobalContextKeys: false,
    
    // User directory
    userDir: './data/',
    
    // Flow file
    flowFile: 'flows.json',
    
    // Credentials encryption
    credentialSecret: false // Set to secure string in production
};