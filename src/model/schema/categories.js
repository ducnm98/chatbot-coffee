var mongoose = require('mongoose');

var categories = new mongoose.Schema({
    title: {
        type: String
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    }]
})

module.exports = categories;