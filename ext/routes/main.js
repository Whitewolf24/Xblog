const express = require('express');
const router = express.Router();
const posts = require('../schema/posts');

router.get('', async (req, res) => {
    const meta = {
        name: "MongoXpress"
    }

    let post_number = 5;
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

        res.render('index', {
            meta,
            data,
            current: page,
            nextpage: hasnext_page ? next_page : null
        });
    } catch (error) {
        console.log(error);
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