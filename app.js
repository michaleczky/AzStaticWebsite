const express = require('express');
const getenv = require('getenv');
const path = require('path');

const config = {
    port: getenv('HTTP_PORT', 3000)
};


const app = express();

app.use('/', express.static(path.join(__dirname, 'content')))

app.listen(config.port, () => console.log(`App listening on port ${config.port}`));

