require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const expressui = require('express-ejs-layouts');
const override = require('method-override')
const compression = require("compression");
const serv = express();
const port = 2700;
//const connectDB = require('./ext/db');
const session = require('express-session');
const cookie = require('cookie-parser');
const mongostore = require('connect-mongo');
const helmet = require("helmet");
//const delay = ms => new Promise(res => setTimeout(res, ms));

//serv.use(express.static(path.join(__dirname, '../public')));

serv.use(function (req, res, next) {
    res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-inline' localhost")
    next();
});

serv.use(compression());
serv.use(helmet.contentSecurityPolicy({
    directives: {
        "script-src": ["'self'", "'unsafe-inline'"],
    },
}),
);

serv.use(express.urlencoded({ extended: true }))
serv.use(express.json());
serv.use(override('_method'));

serv.use(cookie());
serv.use(session({
    secret: 'ntolmadkia',
    resave: false,
    saveUninitialized: false,
    store: mongostore.create({ mongoUrl: process.env.MONGO }),
    cookie: { maxAge: 12 * 1 * 3600 * 1000 },
}));

if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', function () {
        serv.session.destroy();
    })
}

serv.use(express.static('public'));
serv.use(expressui);
serv.set('view engine', 'ejs');

serv.set('views', 'views')

serv.set('layout', './layouts/main');

serv.use('/', require('./ext/routes/main.js'));
serv.use('/', require('./ext/routes/users.js'));

/* serv.get('/post/:id', function (reg, res) {
    res.sendFile("./css/style-min.css")
});
 */

//console.log(`Listening to port ${port}`);

/* serv.use(function (req, res, next) {
    if (!mongoose.connection.readyState) {
        // Show the loader page
        res.set('Content-Type', 'text/html');
        res.send('<h2>Test String</h2>');
    }
    else if (mongoose.connection.readyState) {
        next();
    }
}); */

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        // await delay(5000);
        await mongoose.connect(process.env.MONGO);
    }
    catch (error) {
        //console.log(error);
    }

}

connectDB();
serv.listen(2700);




