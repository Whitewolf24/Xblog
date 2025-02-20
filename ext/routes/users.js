const express = require("express"),
    app = express(),
    path = require("path"),
    router = express.Router(),
    users = require(path.join(__dirname, "..", "schema", "users")),
    posts = require(path.join(__dirname, "..", "schema", "posts")),
    session = require("express-session"),
    MongoStore = require("connect-mongo"),
    bcrypt = require("bcrypt"),
    jwt = require("jsonwebtoken"),
    cookie_parser = require("cookie-parser"),
    nodemailer = require("nodemailer"),
    axios = require("axios"),
    { body: body, validationResult: validationResult } = require("express-validator"),
    biscuit_name = "oreo",
    cookie_secret = process.env.COOKIE_SECRET,
    login_layouts = { eng: path.join(__dirname, "..", "..", "views", "layouts", "login_eng.ejs"), gr: path.join(__dirname, "..", "..", "views", "layouts", "login_gr.ejs") },
    users_layouts = { eng: path.join(__dirname, "..", "..", "views", "layouts", "users_eng.ejs"), gr: path.join(__dirname, "..", "..", "views", "layouts", "users_gr.ejs") },
    user_layout_nosearch = { eng: path.join(__dirname, "..", "..", "views", "layouts", "users_nosearch_eng.ejs"), gr: path.join(__dirname, "..", "..", "views", "layouts", "users_nosearch_gr.ejs") },
    transporter = nodemailer.createTransport({ service: "gmail", auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
async function shorten(e) {
    try {
        let s = await axios.get("https://tinyurl.com/api-create.php", { params: { url: e } });
        return s.data.trim();
    } catch (r) {
        return e;
    }
}
async function send_reset_mail(e, s, r) {
    let a = e.cookies?.cookie;
    if (!e || !e.cookies) throw Error("Request object is missing or does not have cookies");
    let i = "production" === process.env.NODE_ENV ? "https://xblog-mr8w.onrender.com" : "http://localhost:3000";
    (t = await shorten((o = `${i}/reset_passw?token=${r}`))),
        await transporter.sendMail(
            (n =
                "gr" === a
                    ? {
                        from: process.env.EMAIL_USER,
                        to: s,
                        subject: "Αίτημα Επαναφοράς Κωδικού από την MongoXpress",
                        html: `
        <p>Ζητήσατε να επαναφέρετε τον κωδικό σας για το MongoXpress forum. Πατήστε
        <a href="${t}" class="inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
            εδώ
        </a>
        για να επαναφέρετε τον κωδικό σας.</p>
        <p class="mt-8">Αν αυτή η συντόμευση δεν λειτουργεί, παρακαλούμε πηγαίνετε στον παρακάτω σύνδεσμο:</p>
        <p class="text-blue-500 underline">${t}</p>
        <p class="my-8">Αν δεν ζητήσατε να επαναφέρετε τον κωδικό σας, τότε παρακαλούμε αγνοήστε αυτό το μήνυμα.</p>
    `,
                    }
                    : {
                        from: process.env.EMAIL_USER,
                        to: s,
                        subject: "Password Reset Request from MongoXpress",
                        html: `
        <p>You requested a password reset for your MongoXpress forum account. Click 
        <a href="${t}" class="inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
            here
        </a>
        to reset your password.</p>
        <p class="mt-8">If the above link does not work, please go to the following URL:</p>
        <p class="text-blue-500 underline">${t}</p>
        <p class="my-8">If you did not request a password reset please ignore this message.</p>
    `,
                    })
        );
}
app.use(cookie_parser()),
    require("dotenv").config(),
    router.use(session({
        store: MongoStore.create({
            mongoUrl: process.env.MONGO || "mongodb://localhost:27017/sessions",
            collectionName: "sessions"
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: true,
            httpOnly: true,
            sameSite: "Strict",
            maxAge: 86400000
        }
    })); router
        .route("/login")
        .get(async (e, s) => {
            let r = e.cookies?.cookie,
                a = login_layouts[r];
            try {
                return s.render(path.join(__dirname, "..", "..", "views", "users", `login_${r}.ejs`), { meta: { name: "MongoXpress" }, layout: a });
            } catch (i) {
                s.status(500).send("Internal Server Error");
            }
        })
        .post(async (e, s) => {
            let r = e.cookies?.cookie;
            if (!r) return s.redirect("/");
            let a = login_layouts[r];
            try {
                let { username: i, password: u } = e.body,
                    l = await users.findOne({ username: RegExp(`^${i.trim().toLowerCase()}$`, "i") });
                if (!l) return s.render(path.join(__dirname, "..", "..", "views", "users", `login_notuser_${r}.ejs`), { meta: { name: "MongoXpress" }, layout: a });
                if (await bcrypt.compare(u.trim(), l.password)) {
                    let p = jwt.sign({ user_id: l._id }, cookie_secret);
                    return s.cookie("oreo", p, { httpOnly: true, secure: true, sameSite: "Strict", path: "/" }), (e.session.username = l.username), s.redirect("/users/profile/");
                }
                return s.render(path.join(__dirname, "..", "..", "views", "users", `login_bad_${r}.ejs`), { meta: { name: "MongoXpress" }, layout: a });
            } catch (d) {
                return s.render(path.join(__dirname, "..", "..", "views", "users", `login_notuser_${r}.ejs`), { meta: { name: "MongoXpress" }, layout: a });
            }
        }),
        router
            .route("/add")
            .get(async (e, s) => {
                let r = e.cookies?.cookie,
                    a = login_layouts[r];
                o = user_layout_nosearch[r];
                try {
                    return e.cookies.oreo
                        ? s.render(path.join(__dirname, "..", "..", "views", "users", `add_${r}.ejs`), { meta: { name: "MongoXpress" }, layout: o })
                        : s.render(path.join(__dirname, "..", "..", "views", "users", `login_notuser_${r}.ejs`), { meta: { name: "MongoXpress" }, layout: a });
                } catch (i) {
                    console.log(i);
                    s.status(500).send("Internal Server Error");
                }
            })
            .post(async (e, s) => {
                let r = e.cookies?.cookie,
                    a = login_layouts[r];
                try {
                    if (e.cookies.oreo) {
                        let i = jwt.verify(e.cookies.oreo, cookie_secret),
                            u = (i?.user_id, e.session.username);
                        return await (post = new posts({ title: e.body.title, body: e.body.content, username: u })).save(), s.redirect("/");
                    }
                    return s.render(path.join(__dirname, "..", "..", "views", "users", `login_notuser_${r}.ejs`), { meta: { name: "MongoXpress" }, layout: a });
                } catch (l) {
                    s.status(500).send("Internal Server Error");
                }
            }),
        router.get("/users/edit/:id", async (e, s) => {
            try {
                let r = e.cookies?.cookie,
                    a = login_layouts[r],
                    i = await posts.findOne({ _id: e.params.id });
                if (!i) return s.status(404).send("Post not found");
                let u = e.cookies.oreo,
                    l = jwt.verify(u, cookie_secret).user_id,
                    p = await users.findById(l),
                    d = user_layout_nosearch[r];
                if (!u || i.username !== p.username) return s.render(path.join(__dirname, "..", "..", "views", "users", `login_notuser_${r}.ejs`), { meta: { name: "MongoXpress" }, layout: a });
                s.render(path.join(__dirname, "..", "..", "views", "users", `edit_${r}.ejs`), { meta: { name: "MongoXpress" }, post_data: i, layout: d });
            } catch (c) {
                s.status(500).send("Internal Server Error");
            }
        }),
        router.patch("/users/edit/:id", async (e, s) => {
            try {
                let r = e.cookies.oreo;
                if (!r) return s.redirect("/");
                let a = jwt.verify(r, cookie_secret);
                if (!a || !a.user_id) return s.status(401).send("Unauthorized");
                let i = await users.findById(a.user_id);
                if (!i) return s.status(404).send("User not found");
                let u = await posts.findOne({ _id: e.params.id });
                if (!u) return s.status(404).send("Post not found");
                if (u.username !== i.username) return s.status(403).send("Forbidden");
                let l = await posts.findByIdAndUpdate(e.params.id, { title: e.body.title, body: e.body.content, update_date: Date.now() }, { new: !0 });
                if (!l) return s.status(500).send("Failed to update post");
                s.redirect(`/post/${l._id}`);
            } catch (p) {
                s.status(500).send("Internal Server Error");
            }
        }),
        router.delete("/erase/:id", async (e, s) => {
            try {
                let r = jwt.verify(e.cookies.oreo, cookie_secret).user_id,
                    a = await users.findById(r);
                return (await posts.findOne({ _id: e.params.id })).username !== a.username ? s.status(403).send("Forbidden") : e.cookies.oreo ? (await posts.deleteOne({ _id: e.params.id }), s.redirect("/users/profile/")) : s.redirect("/");
            } catch (i) {
                s.status(500).send("Internal Server Error");
            }
        }),
        router
            .route("/signup")
            .get(async function (e, s) {
                let r = e.cookies?.cookie,
                    a = login_layouts[r];
                try {
                    return s.render(path.join(__dirname, "..", "..", "views", "users", `signup_${r}.ejs`), { meta: { name: "MongoXpress" }, data: e, layout: a });
                } catch (i) {
                    s.status(500).send("Internal Server Error");
                }
            })
            .post(
                [
                    body("username")
                        .trim()
                        .notEmpty()
                        .customSanitizer((e) => e.toLowerCase()),
                    body("email").trim().notEmpty().isEmail().normalizeEmail(),
                    body("password").trim().notEmpty(),
                ],
                async (e, s) => {
                    let r = validationResult(e),
                        a = e.cookies?.cookie;
                    if (((layout = login_layouts[a]), !r.isEmpty())) return s.render(path.join(__dirname, "..", "..", "views", "users", `signup_err_${a}.ejs`), { meta: { name: "MongoXpress" }, layout: layout, errors: r.array() });
                    let { username: i, email: u, password: l } = e.body,
                        p = u.trim().toLowerCase(),
                        d = i.trim().toLowerCase(),
                        c = await bcrypt.hash(l, 10);
                    try {
                        let m = await users.create({ username: d, email: p, password: c }),
                            y = jwt.sign({ user_id: m._id }, cookie_secret);
                        return s.cookie("oreo", `id=${y}`, { httpOnly: true, secure: true, sameSite: "Strict", path: "/" }), (e.session.username = d), s.redirect("/");
                    } catch (g) {
                        if (11e3 !== g.code) return s.render(path.join(__dirname, "..", "..", "views", "users", `signup_err_${a}.ejs`), { meta: { name: "MongoXpress" }, layout: layout });
                        if (g.keyPattern && g.keyPattern.username) return s.render(path.join(__dirname, "..", "..", "views", "users", `signup_err_user_${a}.ejs`), { meta: { name: "MongoXpress" }, layout: layout });
                        if (g.keyPattern && g.keyPattern.email) return s.render(path.join(__dirname, "..", "..", "views", "users", `signup_err_mail_${a}.ejs`), { meta: { name: "MongoXpress" }, layout: layout });
                    }
                }
            ),
        router.get("/users/profile", async (e, s) => {
            let r = e.cookies.oreo,
                a = e.cookies?.cookie,
                i = users_layouts[a],
                u = login_layouts[a];
            try {
                if (r) {
                    let l = e.session.username,
                        p = await posts.find({ username: l }).sort({ date: -1 }).exec();
                    if (0 === p.length) return s.render(path.join(__dirname, "..", "..", "views", "users", `profile_${a}.ejs`), { meta: { name: "MongoXpress", username: l }, no_posts: !0, data: p, layout: i });
                    return s.render(path.join(__dirname, "..", "..", "views", "users", `profile_${a}.ejs`), { meta: { name: "MongoXpress", username: l }, no_posts: !1, data: p, layout: i });
                }
                return s.render(path.join(__dirname, "..", "..", "views", "users", `login_notuser_${a}.ejs`), { meta: { name: "MongoXpress" }, layout: u });
            } catch (d) {
                s.status(500).send("Internal Server Error");
            }
        }),
        router.get("/logout", (e, s) => {
            s.clearCookie("oreo", { httpOnly: true, secure: true, sameSite: "Strict", path: "/" }), s.redirect("/");
        }),
        router
            .route("/forgot_passw")
            .get((e, s) => {
                let r = e.cookies?.cookie,
                    a = login_layouts[r];
                return s.render(path.join(__dirname, "..", "..", "views", "users", `forgot_passw_${r}.ejs`), { meta: { name: "MongoXpress" }, layout: a });
            })
            .post(async (e, s) => {
                e.cookies.cookie;
                let { email: r } = e.body,
                    a = e.cookies?.cookie,
                    i = login_layouts[a];
                if (!r) return s.render(path.join(__dirname, "..", "..", "views", "users", `forgot_passw_err_mail_${a}.ejs`), { meta: { name: "MongoXpress" }, layout: i }), s.status(400);
                try {
                    let u = await users.findOne({ email: r });
                    if (!u) {
                        let l = "gr" === a ? "/forgot_passw_err_gr" : "/forgot_passw_err_eng";
                        return s.redirect(l);
                    }
                    let p = jwt.sign({ user_id: u._id }, process.env.RESET_PASSWORD_SECRET, { expiresIn: "10m" });
                    (u.token = p), await u.save(), await send_reset_mail(e, u.email, p);
                    let d = path.join(__dirname, "..", "..", "views", "users", `forgot_passw_success_${a}.ejs`);
                    return s.render(d, { meta: { name: "MongoXpress" }, layout: i });
                } catch (c) {
                    let m = path.join(__dirname, "..", "..", "views", "users", `forgot_passw_err_${a}.ejs`);
                    return s.render(m, { meta: { name: "MongoXpress" }, layout: i });
                }
            }),
        router
            .route("/reset_passw")
            .get((e, s) => {
                let { token: r } = e.query,
                    a = e.cookies?.cookie,
                    i = login_layouts[a];
                if (!r) return s.render(path.join(__dirname, "..", "..", "views", "users", `reset_passw_err_${a}.ejs`), { meta: { name: "MongoXpress" }, layout: i });
                try {
                    return s.render(path.join(__dirname, "..", "..", "views", "users", `reset_passw_${a}.ejs`), { meta: { name: "MongoXpress" }, layout: i, token: r });
                } catch (u) {
                    return s.render(path.join(__dirname, "..", "..", "views", "users", `reset_passw_err_${a}.ejs`), { meta: { name: "MongoXpress" }, layout: i });
                }
            })
            .post(async (e, s) => {
                let { token: r, password: a } = e.body,
                    i = e.cookies?.cookie,
                    u = login_layouts[i];
                try {
                    let l = jwt.verify(r, process.env.RESET_PASSWORD_SECRET),
                        p = await users.findById(l.user_id);
                    return p
                        ? ((p.password = await bcrypt.hash(a, 10)), (p.token = null), await p.save(), s.render(path.join(__dirname, "..", "..", "views", "users", `reset_passw_success_${i}.ejs`), { meta: { name: "MongoXpress" }, layout: n }))
                        : s.render(path.join(__dirname, "..", "..", "views", "users", `reset_passw_err_${i}.ejs`), { meta: { name: "MongoXpress" }, layout: u });
                } catch (d) {
                    return s.render(path.join(__dirname, "..", "..", "views", "users", `reset_passw_err_${i}.ejs`), { meta: { name: "MongoXpress" }, layout: u });
                }
            }),
        (module.exports = router);
