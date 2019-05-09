var router = require('express').Router();
var mongoose = require('mongoose');
var uploadFile = require("services/uploadFile");
var { domain } = require('config/index')
router.get('/', async (req, res, next) => {
    let products = await mongoose.model('products').find();
    return res.render('products/index', { products })
})

router.post('/', uploadFile.StoreFile().any(), async (req, res) => {
    try {
        req.files[0].link = req.files[0].destination.substring(14, req.files[0].destination.length) + '/' + req.files[0].filename;
        req.body.imageLink = `${domain}/${req.files[0].link}`
        await mongoose.model('products').create({ ...req.body })
        return res.redirect('/products')
    } catch (error) {
        next(error)
    }

});

module.exports = router;