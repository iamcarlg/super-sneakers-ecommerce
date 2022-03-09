const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//add comment
const orderSchema = new Schema({
    //We want the schema type objecdId because we have to refer it to the user from our user-model
user: {type: Schema.Types.ObjectId, ref:'user-model'},
        cart: {type: Object, required:true},
        adress: {type: String, required: true},
        name: {type: String, required: true},
       // optional payment id
}, {timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;