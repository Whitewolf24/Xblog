const express = require('express');
const router = express.Router();

router.get('', (req, res) => {
    const meta = {
        title: "MongoXpress"
    }

    res.render('index', { meta });
});

module.exports = router;