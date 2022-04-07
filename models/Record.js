const { model, Schema } = require('mongoose');

const recordSchema = new Schema({
    title: String,
    artist: String,
    barcode: String,
    seller: String,
    price: double,
    quantity: int
})

module.exports = model('Record', recordSchema);