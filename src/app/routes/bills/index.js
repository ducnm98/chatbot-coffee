var router = require('express').Router();
var mongoose = require('mongoose')
router.get('/', async (req, res, next) => {
    let bills = await mongoose.model('bills').find().populate('customerId').populate('productId')
    console.log('bills', bills)
    return res.render('bills/index', { bills })
})

router.put('/:id', async (req, res, next) => {
    let isPaied = req.body.status == 'true' ? true : false
    await mongoose.model('bills').findByIdAndUpdate(req.params.id, { isPaied })
    return res.send()
})

module.exports = router;