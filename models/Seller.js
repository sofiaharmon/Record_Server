const { model, Schema } = require('mongoose');

const sellerSchema = new Schema({
    name: String,
    phone: String,
    email: String
})

module.exports = model('Seller', sellerSchema);