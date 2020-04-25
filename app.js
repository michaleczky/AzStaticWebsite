const express = require('express');
const getenv = require('getenv');

const config = {
    port: getenv('HTTP_PORT', 3000)
};


const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(config.port, () => console.log(`App listening on port ${config.port}`));

