const express = require('express');
const router = express.Router();
const users = require('../schema/users');
const posts = require('../schema/posts');
const bcrypt = require('bcrypt');
const token = require('jsonwebtoken');
const cookie_secret = process.env.COOKIE_SECRET;


const login_layout = '../views/layouts/login.ejs';
const user_layout = '../views/layouts/users.ejs';
const user_layout_nosearch = '../views/layouts/users_nosearch.ejs';

router.get('/login', async (req, res) => {

    const meta = {
        name: "MongoXpress"
    }

    try {
        res.render('users/login', {
            meta,
            layout: login_layout
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
            layout: main_layout
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/add', async (req, res) => {


    try {
        if (req.cookies.cookie) {
            const data = await posts.find();

            const meta = {
                name: "MongoXpress",
            }

            res.render('users/add', {
                meta,
                data,
                layout: user_layout_nosearch
            });
        }
        else {
            return res.redirect('/');
        }

    } catch (error) {
        console.log(error);
    }
});

router.post('/add', async (req, res) => {

    try {
        if (req.cookies.cookie) {
            const new_post = new posts({
                title: req.body.title,
                body: req.body.content
            });
            await posts.create(new_post);
            return res.redirect('/');
        }
        else {
            return res.redirect('/');
        }

    } catch (error) {
        console.log(error);
    }
});

//

router.get('/users/edit/:id', async (req, res) => {

    try {
        if (req.cookies.cookie) {

            const meta = {
                name: "MongoXpress",
            }

            const post_data = await posts.findOne({ _id: req.params.id });

            res.render('users/edit', {
                meta,
                post_data,
                layout: user_layout_nosearch
            });
        }
        else {
            return res.redirect('/');
        }

    } catch (error) {
        console.log(error);
    }
});

router.put('/edit/:id', async (req, res) => {

    try {
        if (req.cookies.cookie) {
            await posts.findByIdAndUpdate(req.params.id, {
                title: req.body.title,
                body: req.body.content,
                update_date: Date.now()
            });
            return res.redirect(`/users/profile`);
        }
        else {
            return res.redirect('/');
        }

    } catch (error) {
        console.log(error);
    }
});

//


router.delete('/erase/:id', async (req, res) => {

    try {
        if (req.cookies.cookie) {
            await posts.deleteOne({
                _id: req.params.id
            });
            return res.redirect(`/users/profile`);
        }
        else {
            return res.redirect('/');
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
        });
    } catch (error) {
        console.log(error);
    }
});

router.post('/signup', async (req, res) => {

    try {
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

        res.render('users/signup_err', {
            meta,
            layout: login_layout,
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/users/profile', async (req, res) => {

    let post_number = 6;
    let page = req.query.page || 1;

    try {
        if (req.cookies.cookie) {
            //const data = await posts.find();
            const data = await posts.find().sort({ date: -1 })
                .skip(post_number * page - post_number)
                .limit(post_number)
                .exec();

            const count = await posts.count();
            const next_page = parseInt(page) + 1;
            const hasnext_page = next_page <= Math.ceil(count / post_number)

            const previous_page = parseInt(page) - 1;
            const hasprevious_page = next_page >= Math.ceil(count / post_number)

            const meta = {
                name: "MongoXpress",
            }

            res.render('users/profile', {
                meta,
                data,
                layout: user_layout,
                current: page,
                nextpage: hasnext_page ? next_page : null,
                previous_page: hasprevious_page ? previous_page : null,
            });
        }
        else {
            return res.redirect('/');
        }

    } catch (error) {
        console.log(error);
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('cookie');
    return res.redirect('/');
});


module.exports = router;