const router = require('express').Router();

//Retrieves the User and Product models from the models
const User = require('../models/user-model');
const Product = require('../models/product-model');
const Review = require('../models/review-model')


//calls the user roles from the database
const ROLE = require('../models/user-roles')
//call authorization requirements
const {authUser, authRole} = require('../config/authorization');
/***********************************************************/

//route for admin CRUD functions on products (/admin/products)

router.get('/products', authUser, authRole(ROLE.ADMIN), (req, res) => {
    Product.find() 
    .then((result) => {
        res.render('admin-products', {title: 'Admin',message_notFound:req.flash('message_notFound'),messageAddError: req.flash('messageAddError') ,messageUpdateError: req.flash('messageUpdateError'), messageDeleteError: req.flash('messageDeleteError'), messageAdd: req.flash('messageAdd'),messageUpdate: req.flash('messageUpdate'), messageDelete: req.flash('messageDelete'), products: result, user: req.user}); 
    })
    .catch((err) => {
        req.flash('messageAddError', 'You dont have access to this page!')
        console.log(err);
    });
});

/***********************************************************/


module.exports = router;