const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//add comment
const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    size: {
        type:String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        //required: true
    },
    //foreign key to retrieve an array of reviews on the product
    reviews: [{
        type: Schema.Types.ObjectId, 
        ref: 'Review'
    }]
}, {timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;