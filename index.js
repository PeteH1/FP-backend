const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes.js');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/suspect', routes);

const server = app.listen(5015, () => {
    console.log('server started');
});

module.exports = server;