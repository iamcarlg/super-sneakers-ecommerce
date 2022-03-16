const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//add comment
const orderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    // Stores our cart json
    cart: {
        type: Object,
        required: true
    },
    //Address of the purchaser
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    zipcode: {
        type: Number,
        required: true
    },
    //Refers to the user who made the order
    user: { //change to author and implemet req.user?
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;