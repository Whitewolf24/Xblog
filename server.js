require('dotenv').config();
const express = require('express');
const expressui = require('express-ejs-layouts');
const override = require('method-override')
const compression = require("compression");
const serv = express();
const port = 2700;
const connectDB = require('./ext/db');
const session = require('express-session');
const cookie = require('cookie-parser');
const mongostore = require('connect-mongo');
const helmet = require("helmet");

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

serv.listen(port);
//console.log(`Listening to port ${port}`);

connectDB();

