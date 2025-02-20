require("dotenv").config()

const express = require("express"),
    path = require("path"),
    cookie_parser = require("cookie-parser"),
    mongoose = require("mongoose"),
    jwt = require("jsonwebtoken"),
    app = express(),
    router = express.Router(),
    posts = require(path.join(__dirname, "..", "schema", "posts")),
    biscuit_name = "oreo",
    meta = { name: "MongoXpress" },
    main_layouts = { eng: path.join(__dirname, "..", "..", "views", "layouts", "main_eng.ejs"), gr: path.join(__dirname, "..", "..", "views", "layouts", "main_gr.ejs") },
    users_layouts = { eng: path.join(__dirname, "..", "..", "views", "layouts", "users_eng.ejs"), gr: path.join(__dirname, "..", "..", "views", "layouts", "users_gr.ejs") };
app.use(cookie_parser()),
    app.use(express.json()),
    (verify_user = (e, r, s) => {
        let t = e.cookies.oreo;
        if (!t) return s();
        try {
            let o = jwt.verify(t, process.env.cookie_secret);
            o.userId && (e.userId = o.userId);
        } catch (a) { }
        s();
    }),
    router.get("/", async (e, r) => {
        let s = e.cookies.oreo,
            t = e.cookies?.cookie;
        if (!t) {
            let o = navigator.language || navigator.languages[0],
                a;
            o.includes("el") ? (a = "gr") : (o.includes("en"), (a = "eng")), r.cookie("cookie", a, { httpOnly: true, secure: true, sameSite: "Strict", path: "/", maxAge: 864e5, path: "/" }), (t = a);
        }
        try {
            let n = await posts.find().sort({ date: -1 }).limit(0).exec(),
                i = s ? users_layouts[t] : main_layouts[t],
                u = s ? { meta: { name: "MongoXpress", username: e.session.username }, data: n, layout: i } : { meta: { name: "MongoXpress" }, data: n, layout: i };
            return r.render(`index_${t}`, u);
        } catch (c) {
            console.log(c), r.status(500).send("Internal Server Error");
        }
    }),
    router.post("/search", async (e, r) => {
        try {
            let s = e.query.search_inp ? e.query.search_inp.trim() : "",
                t = e.cookies?.cookie;
            if (!s) return r.redirect("/");
            let o = e.cookies.oreo,
                a = await posts.find({ title: { $regex: RegExp(s, "i") } }),
                n = o ? users_layouts[t] : main_layouts[t];
            return r.render(`search_${t}`, { meta: meta, search_data: a, layout: n });
        } catch (i) {
            r.status(500).send("Internal Server Error");
        }
    }),
    router.get("/search", async (e, r) => {
        try {
            let s = e.query.search_inp ? e.query.search_inp.trim() : "",
                t = e.cookies?.cookie;
            if (!s) return r.redirect("/");
            let o = e.cookies.oreo,
                a = await posts.find({ title: { $regex: RegExp(s, "i") } }),
                n = o ? users_layouts[t] : main_layouts[t];
            return r.render(`search_${t}`, { meta: meta, search_data: a, layout: n });
        } catch (i) {
            r.status(500).send("Internal Server Error");
        }
    }),
    router.get("/post/:id/", async (e, r) => {
        try {
            let s = e.cookies?.cookie,
                t = e.params.id,
                o = await posts.findById(t),
                a = e.cookies.oreo ? users_layouts[s] : main_layouts[s];
            return r.render(`post_${s}`, { meta: { name: "MongoXpress", username: e.session.username }, post_data: o, layout: a });
        } catch (n) {
            r.status(500).send("Internal Server Error");
        }
    }),
    router.get("/more_posts", async (e, r) => {
        try {
            let { last_post: s, limit: t } = e.query,
                o = s ? { _id: { $lt: s } } : {},
                a = await posts.find(o).sort({ date: -1 }).limit(t).exec();
            r.json(a);
        } catch (n) {
            r.status(500).json({ message: "Server Error" });
        }
    }),
    router.get("/change_language", (e, r) => {
        let s = e.query.language,
            t = e.get("referer"),
            o = e.query.search_inp || "";
        return "eng" !== s && "gr" !== s ? r.sendStatus(400) : (r.cookie("cookie", s, { httpOnly: true, secure: true, sameSite: "Strict", path: "/", maxAge: 864e5 }), t.includes("/search")) ? r.redirect(`/search?search_inp=${encodeURIComponent(o)}`) : r.redirect(t);
    }),
    (module.exports = router);
