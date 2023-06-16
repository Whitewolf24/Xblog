require('dotenv').config();

//const path = require('path');

const express = require('express');
const expressui = require('express-ejs-layouts');
const serv = express();
const port = 2700 || process.env.port;

const connectDB = require('./db');

serv.use(express.static('public'));
serv.use(expressui);
serv.set('view engine', 'ejs');

serv.set('layout', './layouts/main');

serv.use('/', require('./routes/main.js'));

/* serv.get('/', function (reg, res) {
    res.sendFile("index.ejs")
});
 */
serv.listen(port, () => {
    console.log(`Listening to port ${port}`);
});

connectDB();

