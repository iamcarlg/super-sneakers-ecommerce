const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Scehma for our Shopping cart
const ShoppingCart = new Schema({
    userId: {
        type: String,
        required: true
    },
    products: [
        {
            productsId:{
                type: String,
             },
                quantity: {
                    type: Number,
                    default: 1,
                },
        },
    ],
},
{timestamps: true}
);

module.exports = mongoose.model("Cart", ShoppingCart)