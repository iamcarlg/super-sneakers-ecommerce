const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//add comment
const reviewSchema = new Schema({
    stars: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },

}, {timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;