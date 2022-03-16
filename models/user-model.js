const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ROLE = require('./user-roles'); //import user roles


//add comments
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    googleId: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: ROLE.CASUAL
    },
    //foreign key to retrieve an array of reviews from the user
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
        //required: true
    }]
}, {
    timestamps: true //do we want timestamps??
});

const User = mongoose.model('User', userSchema); //change to 'User' instead of 'user' //Karwan

module.exports = User;
