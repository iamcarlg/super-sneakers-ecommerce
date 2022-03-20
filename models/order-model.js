const { max } = require('moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//schema for our order collection in mongodb
const orderSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 60,
    },
    // Stores our cart json
    cart: {
        type: Object,
        required: true
    },
    //Address of the purchaser
    country: {
        type: String,
        required: true,
        maxlength: 60,
    },
    city: {
        type: String,
        required: true,
        maxlength: 60,
    },
    address: {
        type: String,
        required: true,
        maxlength: 60,
    },
    email: {
        type: String,
        required: true,
        maxlength: 60,
    },
    zipcode: {
        type: Number,
        required: true,
        maxlength: 10,
    },
    //Refers to the user who made the order
    user: { //change to author and implemet req.user?
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;