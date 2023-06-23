const express = require('express');
const router = express.Router();
const users = require('../schema/users');
const posts = require('../schema/posts');
const bcrypt = require('bcrypt');
const token = require('jsonwebtoken');
const cookie_secret = process.env.COOKIE_SECRET;


const login_layout = '../views/layouts/login.ejs';
const user_layout = '../views/layouts/users.ejs';

router.get('/login', async (req, res) => {

    const meta = {
        name: "MongoXpress"
    }

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
            return res.redirect('/login_err');
        }

        else {
            return res.redirect('/users/profile');
        }

    } catch (error) {
        console.log(error);
    }
});

router.get('/login_err', async (req, res) => {

    try {

        const meta = {
            name: "MongoXpress",
        }

        res.render('users/login_bad', {
            meta,
            layout: main_layout,
            currentRoute: '/users/login_err'
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/users/profile', async (req, res) => {

    let post_number = 6;
    let page = req.query.page || 1;

    try {
        //const data = await posts.find();
        const data = await posts.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(post_number * page - post_number)
            .limit(post_number)
            .exec();

        const count = await posts.count();
        const next_page = parseInt(page) + 1;
        const hasnext_page = next_page <= Math.ceil(count / post_number)

        const meta = {
            name: "MongoXpress",
        }

        res.render('users/profile', {
            meta,
            data,
            layout: user_layout,
            current: page,
            nextpage: hasnext_page ? next_page : null,
            currentRoute: '/users/profile'
        });

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
        const user = await users.findOne({ email });
        //const id = users.find({ id_1 });

        if (user) {
            return res.redirect('/signup_err');
        }

        else {
            const user = await users.create({ username, email, password: hash });
            const cokie = token.sign({ userId: user._id }, cookie_secret);
            res.cookie('cookie', cokie, { httpOnly: true });
            // if (id) {
            //users.dropIndex({ id_1 });
            // }
            // else {
            return res.redirect('/');
            //  }
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

router.get('/signup_err', async (req, res) => {

    try {

        const meta = {
            name: "MongoXpress",
        }

        res.render('users/signup_exists', {
            meta,
            layout: login_layout,
            currentRoute: '/users/signup_err'
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('cookie');
    return res.redirect('/');
});


module.exports = router;