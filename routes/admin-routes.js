const router = require('express').Router();

//Retrieves the User and Product models from the models
const User = require('../models/user-model');
const Product = require('../models/product-model');


/***********************************************************/

//route for admin CRUD functions on products (/admin/products)
router.get('/products', (req, res) => {
    Product.find() 
    .then((result) => {
        res.render('admin-products', {title: 'product details' ,products: result}); 
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
        res.render('admin-users', {title: 'user details' ,users: result}); 
    })
    .catch((err) => {
        console.log(err);
    });
});

/***********************************************************/

//admin crud functions for controlling users.
router.get('/users', (req, res) => {
    User.find() //can add sorting here. like descending order etc (refer to net ninja youtube video)
    .then((result) => {
      // res.json(result) //change to res.render when returning in ejs views (refer to net ninja youtube video)
      res.render('admin-users', {title: 'users details' ,users: result});  //I don't know if the users: results are as it should. You may have to change it so it's calls the users in db
    })
    .catch((err) => {
        console.log(err);
    });
});

module.exports = router;