var mongoose = require('mongoose');

var bills = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customers"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    },
    isPaied: {
        type: Boolean,
        default: false
    }
})

module.exports = bills