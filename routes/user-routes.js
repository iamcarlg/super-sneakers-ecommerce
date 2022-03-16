const router = require('express').Router();
const { Mongoose } = require('mongoose'); //is this needed? i dont think so

//call the mongoose user model
const User = require('../models/user-model');

//call the mongoose order model
const Order = require('../models/order-model');

//call the mongoose cart model
const Cart = require('../models/cart-model');

//call authentication code
const {authUser, authRole} = require('../config/authorization');
const ROLE = require('../models/user-roles')

/***********************************************************/

//add comment
router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;

    User.findByIdAndDelete(id)
        .then(result => {
            res.json({
                result,
                message: 'User deleted'
            });
            
        })
        .catch(err => {
            console.log(err);
        })
});

/***********************************************************/

//this page renders the profile page that is only accessible after login
router.get('/profile', authUser, (req, res) => { //, authRole(ROLE.ADMIN)
    res.render('profile', {user: req.user});
});

/***********************************************************/

//Too get the purchase history of a user// move it to another folder maybe
router.get('/orders', authUser, function (req, res, next) {
    try {
    Order.find({ user: req.user }, function (err, orders) {
        if(err) {
            return res.write('error')
        }
        var cart;
        // we generate cart for order we have made
      orders.forEach(function(order) {
          cart= new Cart(order.cart);
          order.items = cart.generateArray();
      });
      
        res.render('order', {orders: orders});

    });
} catch (err) {
    console.log(err)
}
});

/***********************************************************/

module.exports = router;



