// webserver config
const webServerPort = '8080';
const webServerBase = '/api';

exports.webserver = {
    port: webServerPort,
    baseUrl: webServerBase,
};

// log file config
const logsPath = './logs/';
const logFile = 'all-logs.log';

exports.logfile = {
    path: logsPath,
    fileName: logFile,
};

// database config
const databases = {
    dev: {
        // format: 'dialect://user:password@host/database'
        url: 'postgres://postgres:foobar@symptum-postgres.symptum-backend-net/symptum', // docker
        // url: 'postgres://postgres:@localhost/symptum',
        dialect: 'postgres',
        params: {
            schema: {
                symptum: 'public',
            },
        },
        // logging: false,
    },
};

exports.database = databases[process.env.NODE_ENV || 'dev'];
