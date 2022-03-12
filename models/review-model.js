const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('../models/product-model');

//add comment
const reviewSchema = new Schema({
    name:{
        required : true,
        type: String
    },
    email:{
        required : true,
        type: String
    },
    msg:{
        required : true,
        type: String
    },
    date:{
        required : true,
        type : String
    },
    posted:{
        type : Boolean
    }

}, {timestamps: true });

const Review = mongoose.model('Review', reviewSchema);


module.exports = Review;