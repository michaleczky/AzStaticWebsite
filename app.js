const express = require('express');
const getenv = require('getenv');
const path = require('path');
const winston = require('winston');

const config = {
    port: getenv('HTTP_PORT', 3000),
    loglevel: getenv('LOGLEVEL', 'info')
};

const logger = winston.createLogger({
    level: config.loglevel,
    format: winston.format.simple(),
    transports: [ new winston.transports.Console() ]
});

const app = express();

app.use('/', express.static(path.join(__dirname, 'content')))

app.listen(config.port, () => logger.info(`App listening on port ${config.port}`));