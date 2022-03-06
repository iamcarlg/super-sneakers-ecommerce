const router = require('express').Router();

//Retrieves the User and Product models from the models
const User = require('../models/user-model');
const Product = require('../models/product-model');


/***********************************************************/

//route for admin CRUD functions on products (/admin/products)
router.get('/products', (req, res) => {
    Product.find() 
    .then((result) => {
        res.render('admin-products', {title: 'Admin' ,products: result, users: result}); 
    })
    .catch((err) => {
        console.log(err);
    });
});

/***********************************************************/

//make sure this works
//route for admin CRUD functions on products (/admin/products)
router.get('/users', (req, res) => {
    User.find() 
    .then((result) => {
        res.render('admin-users', {title: 'Admin' ,users: result}); 
    })
    .catch((err) => {
        console.log(err);
    });
});

/***********************************************************/


module.exports = router;