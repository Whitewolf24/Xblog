const express = require("express"),
    app = express(),
    path = require("path"),
    router = express.Router(),
    users = require(path.join(__dirname, "..", "schema", "users")),
    posts = require(path.join(__dirname, "..", "schema", "posts")),
    bcrypt = require("bcrypt"),
    token = require("jsonwebtoken"),
    cookie_parser = require("cookie-parser"),
    { body, validationResult } = require("express-validator");
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
router
    .route("/login")
    .get(async function (a, b) {
        try {
            b.render("users/login", { meta: { name: "MongoXpress" }, layout: login_layout });
        } catch (a) { }
    })
    .post(async (a, b) => {
        try {
            const { username: c, password: d } = a.body,
                e = await users.findOne({ username: c }),
                f = token.sign({ userId: e._id }, cookie_secret),
                g = await bcrypt.compare(d, e.password);
            if (g) return b.cookie("cookie", f, { httpOnly: !0, path: "/" }), b.redirect("/users/profile");
            if (!g) return b.render(path.join(__dirname, "..", "..", "views", "users", "login_bad.ejs"), { meta: { name: "MongoXpress" }, layout: login_layout });
            ;
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
            //let e = Math.floor(1e9 * Math.random());
            const f = c.trim().toLowerCase(),
                l = k.trim(),
                g = d.trim(),
                h = await bcrypt.hash(g, 10);
            let test_user;

            try {

                // No duplicate found, proceed with creating the user or setting cookies
                const new_user = await users.create({ username: l, email: f, password: h });
                let e = Math.floor(1e9 * Math.random());
                test_user = new_user;
                const jw = jwt.sign({ userId: e._id }, cookie_secret);
                return b.cookie("cookie", jw, { httpOnly: true, path: "/" }), b.redirect("/");

            } catch (error) {
                if (error.code === 11000) {
                    if (error.keyPattern && error.keyPattern.username) {
                        return b.render(path.join(__dirname, "..", "..", "views", "users", "signup_err_user.ejs"), { meta: { name: "MongoXpress" }, layout: login_layout });
                    }
                    else if (error.keyPattern && error.keyPattern.email) {
                        return b.render(path.join(__dirname, "..", "..", "views", "users", "signup_err_mail.ejs"), { meta: { name: "MongoXpress" }, layout: login_layout });
                    }
                }

                else if (!test_user) {
                    // Handle other errors
                    return b.render(path.join(__dirname, "..", "..", "views", "users", "signup_err.ejs"), { meta: { name: "MongoXpress" }, layout: login_layout });
                }
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
    router.get("/logout", (a, b) => (b.clearCookie("cookie", { httpOnly: !0, path: "/" }), b.redirect("/"))),
    (module.exports = router);
