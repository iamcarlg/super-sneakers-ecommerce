const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//schema for the review table in the mongoDB
const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;