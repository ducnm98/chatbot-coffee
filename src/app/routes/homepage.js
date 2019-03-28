var router = require('express').Router();

router.get('/', async (req, res, next) => {
    return res.render('index')
})

module.exports = router;