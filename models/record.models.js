const mongoose = require('mongoose');
const { boolean } = require('webidl-conversions');


const recordSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    itemForSale: {
        type: String,
        required: true
    },
    itemPrice: {
        type: Number
    },
    accepted: {
        type: Boolean,
        required: true
    }
});


const RecordSchema = mongoose.model('RecordSchema', recordSchema);
module.exports = { Record: RecordSchema } 