const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ROLE = require('./user-roles'); // import user roles

const userSchema = new Schema({
    username: {
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
    }
}, {
    timestamps: true //do we want timestamps??
});

const User = mongoose.model('user', userSchema);

module.exports = User;
