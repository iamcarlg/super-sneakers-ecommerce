const router = require('express').Router();
const { Mongoose } = require('mongoose'); //is this needed? i dont think so

//call the mongoose user model
const User = require('../models/user-model');

//call the mongoose order model
const Order = require('../models/order-model');

//call the cart configurations
const Cart = require('../config/cart-config');

//call authentication code
const { authUser, authRole } = require('../config/authorization');
const ROLE = require('../models/user-roles')

/***********************************************************/

//Too get the purchase history of a user and their profile information
router.get('/profile', authUser, function (req, res, next) {
    try {
        Order.find({ user: req.user }, function (err, orders) {
            if (err) {
                return res.write('error')
            }
            var cart;
            // we generate cart for order we have made
            orders.forEach(function (order) {
                cart = new Cart(order.cart);
                order.items = cart.generateArray();
            });
            res.render('profile', { title: "Orders", orders: orders, user: req.user });
        });
    } catch (err) {
        console.log(err)
        
    }
});

/***********************************************************/

module.exports = router;



