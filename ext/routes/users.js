const express = require('express');
const router = express.Router();
const users = require('../schema/users');
const posts = require('../schema/posts');
const bcrypt = require('bcrypt');
const token = require('jsonwebtoken');
const cookie_secret = process.env.COOKIE_SECRET;

const meta = {
    name: "MongoXpress"
}

const login_layout = '../views/layouts/login.ejs';
const user_layout = '../views/layouts/users.ejs';

router.get('/login', async (req, res) => {

    try {
        res.render('users/login', {
            meta,
            layout: login_layout,
            currentRoute: '/users/login'
        });
    } catch (error) {
        console.log(error);
    }
});

router.post('/login', async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await users.findOne({ email })

        const cokie = token.sign({ userId: user._id }, cookie_secret);
        const valid_pass = await bcrypt.compare(password, user.password);
        res.cookie('cookie', cokie, { httpOnly: true });

        if (!valid_pass) {
            console.log("Pass Wrong");
            res.redirect('/login');
        }


        else {
            res.redirect('/users/profile');
        }

    } catch (error) {
        console.log(error);
    }
});

router.get('/signup', async (req, res) => {

    try {
        res.render('users/signup', {
            meta,
            layout: login_layout,
            currentRoute: '/users/signup'
        });
    } catch (error) {
        console.log(error);
    }
});

router.post('/signup', async (req, res) => {

    try {
        let post_number = 6;
        let page = req.query.page || 1;

        const data = await posts.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(post_number * page - post_number)
            .limit(post_number)
            .exec();

        const count = await posts.count();
        const next_page = parseInt(page) + 1;
        const hasnext_page = next_page <= Math.ceil(count / post_number);

        const { email, password } = req.body;
        let username = Math.floor(Math.random() * 1000000000);
        const hash = await bcrypt.hash(password, 10);
        const user = await users.findOne({ email })

        if (user) {
            console.log("Email Exists");
            res.redirect('/signup');
        }

        else {
            const user = await users.create({ username, email, password: hash });
            const cokie = token.sign({ userId: user._id }, cookie_secret);
            res.cookie('cookie', cokie, { httpOnly: true });
            res.redirect('/');
            /*  res.status(201).json({ message: 'Created', email });
                }
                catch (error) {
                    if (error.code === 11000) {
                        res.status(409).json({ message: 'Email Exists' });
                    }
                    res.status(500).json({ message: 'Server Error' });
                } 
    */
        }

    } catch (error) {
        console.log(error);
    }
});

router.get('/users/profile', async (req, res) => {

    try {
        res.render('users/profile', {
            meta,
            layout: user_layout,
            currentRoute: '/users/profile'
        });
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;