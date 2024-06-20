const express = require("express"),
    app = express(),
    path = require("path"),
    router = express.Router(),
    users = require(path.join(__dirname, "..", "schema", "users")),
    posts = require(path.join(__dirname, "..", "schema", "posts")),
    bcrypt = require("bcrypt"),
    jwt = require("jsonwebtoken"),
    cookie_parser = require("cookie-parser"),
    nodemailer = require("nodemailer"),
    { body } = require("express-validator");

const capitalize = (value) => {
    if (typeof value !== 'string') return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
};

app.use(cookie_parser());

const cookie_name = "cookie",
    cookie_secret = process.env.COOKIE_SECRET,
    login_layout = path.join(__dirname, "..", "..", "views", "layouts", "login.ejs"),
    user_layout = path.join(__dirname, "..", "..", "views", "layouts", "users.ejs"),
    user_layout_nosearch = path.join(__dirname, "..", "..", "views", "layouts", "users_nosearch.ejs");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function send_reset_mail(email, mail_token) {
    const reset_url = `http://localhost:3000/reset_passw?token=${encodeURIComponent(mail_token)}`;

    const mail_options = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        //text: `You requested a password reset. Click the following link to reset your password: ${reset_url}`,
        html: `
        <p class="mb-4">You requested a password reset. Click the following link to reset your password:</p>
        <a href="${reset_url}" class="inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
            Reset Password
        </a>
        <p class="mt-4">If the above link does not work, copy and paste the following URL into your browser:</p>
        <p class="text-blue-500 underline">${reset_url}</p>
    `
    };
    await transporter.sendMail(mail_options);
}

router.route("/login")
    .get(async function (a, b) {
        try {
            b.render("users/login", { meta: { name: "MongoXpress" }, layout: login_layout });
        } catch (a) { }
    })
    .post(async (a, b) => {
        try {
            const { username: c, password: d } = a.body,
                e = await users.findOne({ username: c }),
                f = jwt.sign({ user_id: e._id }, cookie_secret),
                g = await bcrypt.compare(d, e.password);
            if (g) return b.cookie("cookie", f, { httpOnly: !0, path: "/" }), b.redirect("/users/profile");
            if (!g) return b.render(path.join(__dirname, "..", "..", "views", "users", "login_bad.ejs"), { meta: { name: "MongoXpress" }, layout: login_layout });
        } catch (a) {
            return b.render(path.join(__dirname, "..", "..", "views", "users", "login_notuser.ejs"), { meta: { name: "MongoXpress" }, layout: login_layout });

        }
    }),
    router
        .route("/add")
        .get(async function (a, b) {
            try {
                if (a.cookies[cookie_name]) {
                    const a = await posts.find();
                    b.render(path.join(__dirname, "..", "..", "views", "users", "add.ejs"), { meta: { name: "MongoXpress" }, data: a, layout: user_layout_nosearch });
                } else return b.redirect("/");
            } catch (a) { }
        })
        .post(async function (a, b) {
            try {
                if (a.cookies[cookie_name]) {
                    const c = new posts({ title: a.body.title, body: a.body.content });
                    return await posts.create(c), b.redirect("/");
                }
                return b.redirect("/");
            } catch (a) { }
        }),
    router.get("/users/edit/:id", async (a, b) => {
        try {
            if (a.cookies[cookie_name]) {
                const c = await posts.findOne({ _id: a.params.id });
                b.render(path.join(__dirname, "..", "..", "views", "users", "edit.ejs"), { meta: { name: "MongoXpress" }, post_data: c, layout: user_layout_nosearch });
            } else return b.redirect("/");
        } catch (a) { }
    }),
    router.patch("/edit/:id", async (a, b) => {
        try {
            return a.cookies[cookie_name] ? (await posts.findByIdAndUpdate(a.params.id, { title: a.body.title, body: a.body.content, update_date: Date.now() }), b.redirect("/users/profile")) : b.redirect("/");
        } catch (a) { }
    }),
    router.delete("/erase/:id", async (a, b) => {
        try {
            return a.cookies[cookie_name] ? (await posts.deleteOne({ _id: a.params.id }), b.redirect(path.join(__dirname, "views", "users", "profile.ejs"))) : b.redirect("/");
        } catch (a) { }
    }),
    router
        .route("/signup")
        .get(async function (a, b) {
            try {
                b.render("users/signup", { meta: { name: "MongoXpress" }, layout: login_layout });
            } catch (a) { }
        })
        .post([body("username").trim().notEmpty().customSanitizer(capitalize), body("email").trim().notEmpty().isEmail().toLowerCase(), body("password").trim().notEmpty()], async (a, b) => {
            const { username: k, email: c, password: d } = a.body;
            const f = c.trim().toLowerCase(),
                l = k.trim(),
                g = d.trim(),
                h = await bcrypt.hash(g, 10);

            try {
                const new_user = await users.create({ username: l, email: f, password: h });
                const new_token = jwt.sign({ user_id: new_user._id }, cookie_secret);
                b.cookie("cookie", new_token, { httpOnly: true, path: "/" })
                return b.redirect("/");
            } catch (a) {
                if (a.code === 11000) {
                    if (a.keyPattern && a.keyPattern.username) {
                        return b.render(path.join(__dirname, "..", "..", "views", "users", "signup_err_user.ejs"), { meta: { name: "MongoXpress" }, layout: login_layout });
                    }
                    else if (a.keyPattern && a.keyPattern.email) {
                        return b.render(path.join(__dirname, "..", "..", "views", "users", "signup_err_mail.ejs"), { meta: { name: "MongoXpress" }, layout: login_layout });
                    }
                }
                else
                    return b.render(path.join(__dirname, "..", "..", "views", "users", "signup_err.ejs"), { meta: { name: "MongoXpress" }, layout: login_layout });
            }
        }),
    router.get("/users/profile", async (a, b) => {
        let c = 6,
            d = a.query.page || 1;
        try {
            if (a.cookies[cookie_name]) {
                const a = await posts
                    .find()
                    .sort({ date: -1 })
                    .skip(c * d - c)
                    .limit(c)
                    .exec(),
                    e = await posts.countDocuments(),
                    f = parseInt(d) + 1,
                    g = f <= Math.ceil(e / c),
                    h = parseInt(d) - 1,
                    i = f >= Math.ceil(e / c);
                b.render(path.join(__dirname, "..", "..", "views", "users", "profile.ejs"), { meta: { name: "MongoXpress" }, data: a, layout: user_layout, current: d, nextpage: g ? f : null, previous_page: i ? h : null });
            } else return b.redirect("/");
        } catch (a) { }
    }),
    router.get("/logout", (a, b) => (b.clearCookie("cookie", { httpOnly: !0, path: "/" }), b.redirect("/")));




router.route('/forgot_passw')
    .get((a, b) => {
        return b.render(path.join(__dirname, "..", "..", "views", "users", "forgot_passw.ejs"), { meta: { name: "MongoXpress" }, layout: login_layout });
    })
    .post(async (a, b) => {
        const { email } = a.body;
        if (!email) {
            return b.status(400).json({ a: "Email is required" });
        }

        try {
            const user = await users.findOne({ email });
            if (!user) {
                return b.redirect('/forgot_passw_err');
            }

            const token = jwt.sign({ user_id: user._id }, process.env.RESET_PASSWORD_SECRET, { expiresIn: '10m' });
            user.token = token;
            await user.save();

            await send_reset_mail(user.email, token);

            return b.render(path.join(__dirname, "..", "..", "views", "users", "forgot_passw_success.ejs"), { meta: { name: "MongoXpress" }, layout: login_layout });
        } catch (a) {
            return b.render(path.join(__dirname, "..", "..", "views", "users", "forgot_passw_err.ejs"), { meta: { name: "MongoXpress" }, layout: login_layout });
        }
    });

router.route('/reset_passw')
    .get((a, b) => {
        const { token } = a.query;
        if (!token) {
            return b.render(path.join(__dirname, "..", "..", "views", "users", "reset_passw_err.ejs"), { meta: { name: "MongoXpress" }, layout: login_layout });
        }
        try {
            const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
            return b.render(path.join(__dirname, "..", "..", "views", "users", "reset_passw.ejs"), { meta: { name: "MongoXpress" }, layout: login_layout, token });
        } catch (a) {
            console.error("Error during token verification:", a);
            return b.render(path.join(__dirname, "..", "..", "views", "users", "reset_passw_err.ejs"), { meta: { name: "MongoXpress" }, layout: login_layout });
        }
    })
    .post(async (a, b) => {
        const { token, password } = a.body;
        try {
            const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
            const user = await users.findById(decoded.user_id);

            user.password = await bcrypt.hash(password, 10);
            user.token = null;
            await user.save();

            return b.render(path.join(__dirname, "..", "..", "views", "users", "reset_passw_success.ejs"), { meta: { name: "MongoXpress" }, layout: login_layout });
        } catch (a) {
            console.log("Error during password reset:", a);
            return b.render(path.join(__dirname, "..", "..", "views", "users", "reset_passw_err.ejs"), { meta: { name: "MongoXpress" }, layout: login_layout });
        }
    });

router.get('/reset_passw/forgot_passw', (a, b) => {
    return b.redirect("/forgot_passw");
});

router.get('/reset_passw/login', (a, b) => {
    return b.redirect("/login");
});

module.exports = router;