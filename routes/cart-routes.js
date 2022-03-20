//import the express router
const router = require('express').Router();

//call the database model for products
const Product = require('../models/product-model');
//call the database model for cart
const Cart = require('../config/cart-config');

const { Mongoose } = require('mongoose');




// Add item to cart.
router.get('/add/:id', (req, res) => { //more fitting name maybe?
    //Find the product id
    const productId = req.params.id;
    // Create a cart object to store item based on  user session
    try {
        const cart = new Cart(req.session.cart ? req.session.cart : {});

        // Search for item we are trying to put in our basket.
        Product.findById(productId, function (err, product) {
            if (err) {
                return res.redirect('/')
            }
            // if success product will be added to the cart,
            //fetch product from data base and the id of the product
            cart.add(product, product.id);

            //store in cart object in my session
            req.session.cart = cart;
            console.log(req.session.cart);
            res.redirect('back');
        })
    } catch (err) {
        console.log(err)
    }
});

//Route for decreasing an item from shopping-cart 
router.get('/reduce/:id', function (req, res, next) {
    const productId = req.params.id;
    try {
        // Create a new cart and create a session for it
        const cart = new Cart(req.session.cart ? req.session.cart : {});
        // Call our reduceByOne function from shopping-cart model
        cart.reduceByOne(productId);
        //  save the contents of a cart 
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('back');
    } catch (err) {
        console.log(err)
    }
});

// Route for incrementing an item in shopping cart
router.get('/increase/:id', function (req, res, next) {
    const productId = req.params.id;
    try {
        // Create a new cart and a session for it
        const cart = new Cart(req.session.cart ? req.session.cart : {});
        // Call our reduceByOne function from shopping-cart model
        cart.increaseByOne(productId);
        // save the contents of a cart 
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('back');
    } catch (err) {
        console.log(err)
    }
});

// Route for removing item from cart (Not implemented in view)
router.get('/remove/:id', function (req, res, next) {
    const productId = req.params.id;

    const cart = new Cart(req.session.cart ? req.session.cart : {});
    // Call our remove function from shopping-cart-model.
    cart.removeItem(productId);
    // save the contents of a cart 
    req.session.cart = cart;
    res.redirect('/cart/');
});

// Route for shopping cart. All items we have added from add-cart route should be showing up in this route
router.get('/', function (req, res, next) {
    try {
        // Check if we have a cart in our session. 
        if (!req.session.cart) {

            return res.render('shopping-cart', {
                // set products to null
                title: 'Shopping Bag',
                products: null,
                user: req.user
            });
        }
        //if we have we create a new one for our session
        let cart = new Cart(req.session.cart)

        // pass our shopping.cart array, totalQty,totalPrice functions.
        res.render('shopping-cart', {
            products: cart.generateArray(),
            totalPrice: cart.totalPrice,
            totalQty: cart.totalQty,
            title: 'Shopping Bag',
            user: req.user
        })
    } catch (err) {
        console.log(err)
    }
});

module.exports = router;



