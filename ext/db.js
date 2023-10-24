const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const serv = express();
const mustacheExpress = require('mustache-express');
const delay = ms => new Promise(res => setTimeout(res, ms));

//serv.use(express.static(path.join(__dirname, '../public')));
serv.engine('mustache', mustacheExpress());
serv.set('view engine', 'mustache');
//serv.set('view engine', 'html');


serv.use(function (req, res, next) {
    if (!mongoose.connection.readyState) {
        // Show the loader page
        return res.render('index.mustache');
    }
    // Database is ready, continue with the request
    if (mongoose.connection.readyState) {
        next();
    }
});


const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        await delay(5000);
        await mongoose.connect(process.env.MONGO);
        //console.log('Database conn');
    }
    catch (error) {
        //console.log(error);
    }
}


serv.listen(2700);

module.exports = connectDB;