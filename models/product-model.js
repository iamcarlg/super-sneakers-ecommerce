const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//schema for our product collection in mongodb
const productSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 30,
    },
    gender: {
        type: String,
        required: true,
        enum: ['Woman', 'Man']
    },
    brand: {
        type: String,
        required: true,
        maxlength: 20,
        enum: ['Nike', 'Adidas', 'Reebok', 'Puma', 'New Balance', 'Kappa', 'Champion']
    },
    picture: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        maxlength: 240,
    },
    price: {
        type: Number,
        required: true,
        maxlength: 4,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    //foreign key to retrieve an array of reviews on the product
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, { timestamps: true });

productSchema.index({ title: 'text', });
//productSchema.index({ "$**" : 'text' });
const Product = mongoose.model('Product', productSchema);

module.exports = Product;