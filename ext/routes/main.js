const express = require('express');
const router = express.Router();

router.get('', (req, res) => {
    const meta = {
        name: "MongoXpress"
    }

    res.render('index', { meta });
});

module.exports = router;