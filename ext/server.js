require('dotenv').config();

//const path = require('path');

const express = require('express');
const expressui = require('express-ejs-layouts');
const serv = express();
const port = 2700 || process.env.port;

serv.use(express.static('public'));
serv.use(expressui);
serv.set('layout', '../views/layouts/main');
serv.set('view engine', 'ejs');
//serv.use(express.static('../public'));

serv.use('/', require('./routes/main.js'));

serv.listen(port, () => {
    console.log(`Listening to port ${port}`);
});

