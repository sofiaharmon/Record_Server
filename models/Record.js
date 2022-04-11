const { model, Schema } = require('mongoose');

const recordSchema = new Schema({
    title: String,
    artist: String,
    seller: String,
    price: Number,
    quantity: Number,
    img: String
})

module.exports = model('Record', recordSchema);