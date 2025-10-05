/**
 * Node-RED Settings for PV Grid Monitoring System
 * This file defines the runtime settings for Node-RED.
 */

module.exports = {
    // The tcp port that the Node-RED web server is listening on
    uiPort: process.env.PORT || 1880,

    // The maximum length, in characters, of any message sent to the debug sidebar tab
    debugMaxLength: 1000,

    // The file containing the flows. If not set, defaults to flows_<hostname>.json
    flowFile: 'flows.json',

    // To enabled pretty-printing of the flow within the flow file, set the following
    // property to true:
    flowFilePretty: true,

    // By default, credentials are encrypted in storage using a generated key. To
    // specify your own secret, set the following property.
    // If you want to disable encryption of credentials, set this property to false.
    // Note: once you set this property, do not change it - doing so will prevent
    // node-red from being able to decrypt your existing credentials and they will be
    // lost.
    credentialSecret: process.env.NODE_RED_CREDENTIAL_SECRET || "pv-grid-monitoring-key",

    // By default, all user data is stored in the Node-RED install directory. To
    // use a different location, the following property can be used
    userDir: './data',

    // Node-RED scans the `nodes` directory in the install directory to find nodes.
    // The following property can be used to specify an additional directory to scan.
    nodesDir: './nodes',

    // By default, the Node-RED UI accepts connections on all IPv4 interfaces.
    // The following property can be used to listen on a specific interface. For
    // example, the following would only allow connections from the local machine.
    //uiHost: "127.0.0.1",

    // Retry time in milliseconds for MQTT connections
    mqttReconnectTime: 15000,

    // The maximum length, in characters, of any message sent to the debug sidebar tab
    debugMaxLength: 1000,

    // The maximum number of messages nodes will buffer internally as part of their
    // operation. This only applies to nodes that are specifically designed to buffer
    // messages for performance reasons - such as the delay node.
    nodeMessageBufferMaxLength: 0,

    // To disable the option for using local files for storing keys and certificates in the TLS configuration
    // node, set this to true
    //tlsConfigDisableLocalFiles: true,

    // Colourise the console output of the debug node
    debugUseColors: true,

    // The file containing the flows. If not set, defaults to flows_<hostname>.json
    flowFile: 'flows.json',
    flowFilePretty: true,

    // User Directory Settings

    // Admin Auth
    adminAuth: {
        type: "credentials",
        users: [{
            username: "admin",
            password: "$2a$08$zZWtXTja0fB1pzD4sHCMyOCMYz2Z6dNbM6tl8sJogENOMcxWV9DN.", // password: admin
            permissions: "*"
        }]
    },

    // Functions can be in an external file
    functionGlobalContext: {
        // os:require('os'),
        // moment:require('moment'),
        // lodash:require('lodash')
    },

    // Allow the Function node to load additional npm modules
    functionExternalModules: true,

    // The following property can be used to set predefined values in Global Context.
    functionGlobalContext: {
        os: require('os'),
        moment: require('moment')
    },

    // Context Storage
    contextStorage: {
        default: {
            module: "localfilesystem"
        },
        file: {
            module: "localfilesystem"
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
            filename: "./data/node-red.log",
            maxFiles: 5,
            maxSize: "10MB"
        }
    },

    // Export HTTP endpoints
    httpAdminRoot: '/admin',
    httpNodeRoot: '/api',

    // Security settings
    requireHttps: false,
    httpStatic: './static/',

    // Editor settings
    editorTheme: {
        projects: {
            enabled: true
        },
        palette: {
            editable: true
        }
    }
};