const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const users = require(path.join(__dirname, '..', 'schema', 'users'));
const posts = require(path.join(__dirname, '..', 'schema', 'posts'));
const bcrypt = require('bcrypt');
const token = require('jsonwebtoken');
const cookie_parser = require('cookie-parser');

app.use(cookie_parser());

const cookie_name = 'cookie';

/* const filename = path.basename(__filename);
const dirname = path.dirname(__filename); */

const cookie_secret = process.env.COOKIE_SECRET;

const { body, validationResult } = require('express-validator');
const { sanitize } = require('express-validator');

const login_layout = path.join(__dirname, '..', '..', 'views', 'layouts', 'login.ejs');
const user_layout = path.join(__dirname, '..', '..', 'views', 'layouts', 'users.ejs');
const user_layout_nosearch = path.join(__dirname, '..', '..', 'views', 'layouts', 'users_nosearch.ejs');

// ------------/LOGIN

router.route('/login').get(
    async function (req, res) {
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
    }).post(
        async (req, res) => {
            try {

                const { email, password } = req.body;
                const user = await users.findOne({ email })

                const cokie = token.sign({ userId: user._id }, cookie_secret);
                const valid_pass = await bcrypt.compare(password, user.password);

                if (valid_pass) {
                    res.cookie('cookie', cokie, { httpOnly: true, path: '/' });
                    return res.redirect('/users/profile');
                }

                if (!valid_pass) {
                    return res.redirect('/login_err');
                }

            } catch (error) {
                console.log(error);
                return res.redirect('/login_notuser');
            }
        });

// ------------

router.get('/login_err', async (req, res) => {

    try {

        const meta = {
            name: "MongoXpress",
        }

        res.render(path.join(__dirname, '..', '..', 'views', 'users', 'login_bad.ejs'), {
            meta,
            layout: login_layout
        });
    } catch (error) {
        console.log(error);
    }
});

// ------------

router.get('/login_notuser', async (req, res) => {

    try {

        const meta = {
            name: "MongoXpress",
        }

        res.render(path.join(__dirname, '..', '..', 'views', 'users', 'login_notuser.ejs'), {
            meta,
            layout: login_layout
        });
    } catch (error) {
        console.log(error);
    }
});

// ------------/

// ------------/ADD

router.route('/add').get(
    async function (req, res) {

        try {
            if (req.cookies[cookie_name]) {
                const data = await posts.find();

                const meta = {
                    name: "MongoXpress",
                }

                res.render(path.join(__dirname, '..', '..', 'views', 'users', 'add.ejs'), {
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
    }).post(
        async function (req, res) {

            try {
                if (req.cookies[cookie_name]) {
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

// ------------/

// ------------/EDIT

router.get('/users/edit/:id', async (req, res) => {

    try {
        if (req.cookies[cookie_name]) {

            const meta = {
                name: "MongoXpress",
            }

            const post_data = await posts.findOne({ _id: req.params.id });

            res.render(path.join(__dirname, '..', '..', 'views', 'users', 'edit.ejs'), {
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

// ------------/

router.put('/edit/:id', async (req, res) => {

    try {
        if (req.cookies[cookie_name]) {
            await posts.findByIdAndUpdate(req.params.id, {
                title: req.body.title,
                body: req.body.content,
                update_date: Date.now()
            });
            return res.redirect(path.join(__dirname, '..', '..', 'views', 'users', 'profile.ejs'));
        }
        else {
            return res.redirect('/');
        }

    } catch (error) {
        console.log(error);
    }
});

// ------------/

router.delete('/erase/:id', async (req, res) => {

    try {
        if (req.cookies[cookie_name]) {
            await posts.deleteOne({
                _id: req.params.id
            });
            return res.redirect(path.join(__dirname, '..', '..', 'views', 'users', 'profile.ejs'));
        }
        else {
            return res.redirect('/');
        }

    } catch (error) {
        console.log(error);
    }
});

// ------------/

// ------------/SIGNUP

router.route('/signup').get(
    async function (req, res) {
        try {
            const meta = {
                name: "MongoXpress",
            }

            res.render('users/signup', {
                meta,
                layout: login_layout,
            });
        } catch (error) {
            console.log(error);
        }
    }).post
    (
        [body('email').trim().isEmail().toLowerCase(),
        body('password').trim(),
        ], async (req, res) => {

            try {
                const { email, password } = req.body;
                let username = Math.floor(Math.random() * 1000000000);
                const sanitizedemail = email.trim().toLowerCase();
                const sanitizedpass = password.trim();
                const hash = await bcrypt.hash(sanitizedpass, 10);
                const user = await users.findOne({ sanitizedemail });
                //const id = users.find({ id_1 });

                if (user) {
                    return res.redirect(path.join(__dirname, '..', '..', 'views', 'users', 'signup_err.ejs'));
                }

                else {
                    const user = await users.create({ username, email: sanitizedemail, password: hash });
                    const cokie = token.sign({ userId: user._id }, cookie_secret);
                    res.cookie('cookie', cokie, { httpOnly: true, path: '/' });
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
                return res.redirect(path.join(__dirname, '..', '..', 'views', 'users', 'signup_err.ejs'));
            }
        });

// ------------/

router.get('/signup_err', async (req, res) => {

    try {

        const meta = {
            name: "MongoXpress",
        }

        res.render(path.join(__dirname, '..', '..', 'views', 'users', 'signup_err.ejs'), {
            meta,
            layout: login_layout,
        });
    } catch (error) {
        console.log(error);
    }
});

// ------------/

router.get('/users/profile', async (req, res) => {

    let post_number = 6;
    let page = req.query.page || 1;

    try {
        if (req.cookies[cookie_name]) {
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

            res.render(path.join(__dirname, '..', '..', 'views', 'users', 'profile.ejs'), {
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

// ------------/

router.get('/logout', (req, res) => {
    res.clearCookie('cookie', { httpOnly: true, path: '/' });
    return res.redirect('/');
});


module.exports = router;