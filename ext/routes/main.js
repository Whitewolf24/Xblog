const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const users = require(path.join(__dirname, '..', 'schema', 'users'));
const posts = require(path.join(__dirname, '..', 'schema', 'posts'));
const cookie_parser = require('cookie-parser');

app.use(cookie_parser());

const cookie_name = 'cookie';

const meta = {
    name: "MongoXpress"
}

//const logged_layout = '../views/layouts/logged.ejs';
const main_layout = path.join(__dirname, '..', '..', 'views', 'layouts', 'main.ejs');
const user_layout = path.join(__dirname, '..', '..', 'views', 'layouts', 'users.ejs');

// ------------/

router.get('/', async (req, res) => {

    let post_number = 6;
    let page = req.query.page || 1;

    try {
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

        if (!req.cookies[cookie_name]) {
            res.render(path.join(__dirname, '..', '..', 'views', 'index.ejs'), {
                meta,
                data,
                current: page,
                nextpage: hasnext_page ? next_page : null,
                previous_page: hasprevious_page ? previous_page : null,
                layout: main_layout
            });
        }

        else if (req.cookies[cookie_name]) {
            res.render(path.join(__dirname, '..', '..', 'views', 'index.ejs'), {
                meta,
                data,
                current: page,
                nextpage: hasnext_page ? next_page : null,
                previous_page: hasprevious_page ? previous_page : null,
                layout: user_layout,
            });
            //res.send(html);
        }
    } catch (error) {
        console.log(error);
    }
});

// ------------/

router.post('/search', async (req, res) => {
    try {

        let query = req.body.search_inp;
        const query_nospecial = query.replace(/[^a-zA-Z0-9]/g, "")

        const search_data = await posts.find({
            $or: [
                { title: { $regex: new RegExp(query_nospecial, 'i') } }
                /* { body: {$regex: new RegExp(query_nospecial, 'i')}} */
            ]
        });

        if (!req.cookies[cookie_name]) {
            res.render('search',
                {
                    meta,
                    search_data,
                    layout: main_layout,
                });
        }
        else if (req.cookies[cookie_name]) {
            res.render('search',
                {
                    meta,
                    search_data,
                    layout: user_layout,
                });
        }
    }
    catch (error) {
        console.log(error);
    }
});

// ------------/

router.get('/post/:id', async (req, res) => {

    try {
        let post_id = req.params.id;
        const post_data = await posts.findById({ _id: post_id });

        if (!req.cookies[cookie_name]) {
            res.render('post', {
                meta,
                post_data,
                layout: main_layout,
            });
        }

        else if (req.cookies[cookie_name]) {
            res.render('post', {
                meta,
                post_data,
                layout: user_layout,
            });
        }
    }
    catch (error) {
        //console.log(error);
    }
});
/* function post_data() {
    posts.insertMany([
        {
            title: "Suspendisse luctus lacinia ligula.",
            body: "Nunc iaculis nibh sit amet maximus luctus. Quisque iaculis tellus nisi, at consectetur enim ultrices a. Pellentesque semper porta eros vitae laoreet. Pellentesque odio ipsum, ultricies eget mi nec, commodo suscipit risus. Mauris pharetra augue nulla, eget molestie neque tempor et. Vestibulum posuere aliquet leo vel faucibus. In lacinia massa vel dapibus imperdiet. Etiam rutrum et turpis a auctor."
        },
        {
            title: "Duis porta rutrum felis at imperdiet.",
            body: "Ut et est eget risus aliquam scelerisque. Curabitur elementum malesuada risus eu tempus. Morbi porta iaculis mauris, a dignissim dolor fermentum eu. Vivamus pellentesque elementum convallis. Nulla aliquam varius magna ullamcorper scelerisque. Mauris nec nibh ex. Cras mollis augue quis libero ultrices tincidunt. Vivamus in dapibus metus. Morbi mauris leo, consectetur vel ligula at, pharetra placerat massa."
        },
        {
            title: "Phasellus fringilla commodo dui, ut finibus enim.",
            body: " Curabitur ut placerat leo. Etiam cursus porttitor libero, eget sodales diam interdum a. Aliquam ultricies tempor eros sagittis aliquet. Curabitur non urna interdum, hendrerit tortor sed, mollis orci. Phasellus non commodo diam. Nullam vitae felis vel arcu tempor pharetra. Nulla in massa non nisl lobortis malesuada ac in neque. Curabitur non vestibulum est."
        },
        {
            title: "Duis velit elit.",
            body: "Sed semper sagittis nunc a consectetur. Aliquam sagittis posuere urna, eget pretium augue eleifend et. In hac habitasse platea dictumst. Integer sodales vestibulum massa, non commodo nibh luctus et. Integer gravida efficitur mauris, ac dignissim mauris consectetur auctor. Donec venenatis est mauris, vitae lobortis magna rhoncus eu. Nullam vitae massa metus. Nunc sed malesuada eros, ultricies rutrum ex. Sed viverra ante ut erat imperdiet accumsan. Sed porta pharetra diam vitae dictum. Donec egestas, tortor sit amet tempus cursus, nisl lacus dictum nunc, id egestas tortor metus eget eros. Curabitur tincidunt quis augue sed egestas. Vestibulum luctus, nunc in feugiat commodo, nulla ex interdum dolor, sit amet maximus urna ipsum in nisl."
        },
        {
            title: "Phasellus quis felis finibus, aliquam turpis et, mattis tellus.",
            body: "Nam dignissim arcu ut luctus finibus. Donec ultrices sed justo et fermentum. Phasellus consectetur eget tellus vitae viverra. Aliquam sollicitudin lobortis lorem eget tempor. Donec varius turpis et nunc posuere, sit amet posuere mi viverra. Nulla efficitur, est non dictum aliquet, neque nunc malesuada lectus, id placerat augue dolor a justo. Maecenas pellentesque ullamcorper ex, eget posuere ante tincidunt vitae. Vestibulum pretium imperdiet lorem vel convallis."
        },
    ])
} */


module.exports = router;