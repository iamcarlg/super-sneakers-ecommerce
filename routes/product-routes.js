//import the express router
const router = require('express').Router();

//FS Interacts with sharp/multer to resize img
const fs = require('fs');

//call the database model for products
const Product = require('../models/product-model');
//call the database model for reviews
const Review = require('../models/review-model');
//call the database model for reviews
const User = require('../models/user-model');

const { Mongoose } = require('mongoose');

//middleware for date formatting
var moment = require('moment');

//for rezising img in backend
const sharp = require('sharp');

//The path module provides utilities for working with file and directory paths.
const path = require('path');

//calls the user roles from the database
const ROLE = require('../models/user-roles')
//call authorization requirements
const { authUser, authRole } = require('../config/authorization');

//call file-storage multer functions
const { storage, upload } = require('../config/file-storage')


/***********************************************************/

//can you add some comments in this //julia
//post product with img (img will be resized) this resize wont format correctly for our shop page btw
router.post('/product', authUser, authRole(ROLE.ADMIN), upload.single('picture'), async (req, res) => { //should probably be called /post not /product //Karwan
    console.log(req.file);
    try {
        const { filename: image } = req.file;

        await sharp(req.file.path)
            .resize(450, 600)
            .jpeg({ quality: 90 })
            .toFile(
                path.resolve(req.file.destination, 'resized', image)
            )
            sharp.cache(false);
            console.log(req.file.path)

            //I will check
        // fs.unlinkSync(req.file.destination, (err) => {
        //     if(err) {
        //         res.redirect('/') //check if its correct
        //     } else {
        //         res.redirect('/admin/products') //check if its correct
        //     }
        // }) //does this work?

      





        let product = new Product({
            title: req.body.title,
            gender: req.body.gender,
            brand: req.body.brand,
            description: req.body.description,
            picture: req.file.filename,
            price: req.body.price
        });


        product = await product.save();
        req.flash('messageAdd', 'New product has been added')
        res.redirect('/admin/products') //check if its correct
    } catch (error) {
        console.log(error);
        req.flash('messageAddError', 'Product could not be added, possibly due to validation, please try again')
        res.redirect('/admin/products') //check if its correct

    }

    const name = req.body.name;
    const email = req.body.email;
    const msg = req.body.msg;

    let review = new Review({
        name: name,
        email: email,
        msg: msg
    });

    try {

        review = await review.save(); // is this fram carls review or mine //karwan

        Review.find(function (err, reviews) {
            if (err) {
                console.log(err);
            } else {
                reviews.forEach(function (review) {
                    console.log('name :' + review.name);
                    console.log('email :' + review.email);
                    console.log('msgg : ' + review.msg);
                })
            }
        })
        res.redirect('/shop/products/<%= product._id %>');

    } catch (error) {
        console.log(error);
    }
});



/***********************************************************/

//get product by id
router.get('/product/:id', (req, res) => {
    const id = req.params.id;
    const user = req.user; //is this needed?? /karwan
    Product.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    })
        .then(result => {
            res.render('product-details', { title: 'Product Details', messagereview: req.flash('messagereview'), product: result, user: req.user, moment: moment });
            //res.json(result); //change from render to this if you want to test in postman
        })
        .catch(err => {
            console.log(err);
            req.flash('message_notFound', 'The product cant be found, please try another product')
            res.redirect('/admin/products') //check if its correct
        });
});
/***********************************************************/

//search for products
router.post('/search', async (req, res) => {

    try {
        // query to find a product
        let searchTerm = req.body.searchTerm;

        let products = await Product.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
        res.render('products-search', { title: 'Search results', products, user: req.user });



    } catch {
        res.status(500).send('error');


    }
})

/***********************************************************/

// //post review on post
router.post('/product/:id/review/post', authUser, (req, res) => { //see if if/else can be replaced with authUser instead
    const user = req.user;
    const id = req.params.id;
    const review = new Review(req.body);
    review.author = user;

    console.log(review);
    review //create a new review
        .save()
        .then(() => Product.findById(id),
            // OM något strular lägg till denna (den ska 'typ' inte behövas?) .populate('reviews'),
            console.log(review)
        ) //find the product that is being reviewed

        .then((result) => {
            result.reviews.unshift(review); //append review details to this product, unshift puts the newest entry at the top
            return result.save();
        })

        .then(() => res.redirect('back')) //redirect to the product
        .catch((err) => {
            res.redirect('back'),
            req.flash('messagereview', 'You must login to review products')   
            console.log(err);
        });
});


/***********************************************************/

//get product by id so that you can update with put
router.get('/update/:id', authUser, authRole(ROLE.ADMIN), (req, res) => {
    const id = req.params.id;
    Product.findById(id)
        .then(result => {
            res.render('product-update', { title: 'Update Product', products: result, user: req.user });
        })
        .catch((err) => {
            console.log(err);
        });
});

/***********************************************************/

//comments please
router.get('/delete/:id', authUser, authRole(ROLE.ADMIN), (req, res) => {
    const id = req.params.id;
    Product.findById(id)
        .then(result => {
            res.render('product-delete', { title: 'Delete Product', products: result, user: req.user }); //what render if modal?
        })
        .catch(err => {
            console.log(err);
        });
});

/***********************************************************/

//route for deleting an existing product
router.delete('/delete/:id', authUser, authRole(ROLE.ADMIN), (req, res) => {
    const id = req.params.id;

    Product.findByIdAndDelete(id)
        .then(result => {
            req.flash('messageAdd', 'Product has been deleted')
            res.json({ redirect: '/admin/products' });
        })
        .catch(err => {
            console.log(err);
            // req.flash('messageDeleteError', 'Could not delete product')
            // res.json({ redirect: '/admin/products' });
        })
});

/***********************************************************/

router.patch('/update/:id', authUser, authRole(ROLE.ADMIN), upload.single('picture'), async (req, res) => {
    req.product = await Product.findByIdAndUpdate(req.params.id);
    try {
        
    let product = req.product;
    product.title = req.body.title;
    product.gender = req.body.gender;
    product.brand = req.body.brand;
    product.description = req.body.description;
    product.price = req.body.price;
    product.picture = req.file.filename;

  
        // To resize the img
        const { filename: image } = req.file;
        await sharp(req.file.path)
            .resize(450, 600)
            .jpeg({ quality: 90 })
            .toFile(
                path.resolve(req.file.destination, 'resized', image)
            )
        fs.unlinkSync(req.file.path)

        product = await product.save();
        //redirect to show route
        req.flash('messageAdd', 'Product has been updated')
        res.redirect('/admin/products') //change to back if you get modal to work //karwan
    } catch (error) {
        req.flash('messageUpdateError', 'Validation failed, please try again')
        res.redirect('/admin/products')
        console.log(error);
    }
});

/***********************************************************/

//route for mens products
router.get('/men', (req, res) => {

    Product.find({ 'gender': 'Man' })
        .then((result) => {
            res.render('products-men', { title: 'Men', products: result, user: req.user });
        })
        .catch((err) => {
            console.log(err);
        });
});

/***********************************************************/

//route for our women products
router.get('/women', (req, res) => {
    Product.find({ 'gender': 'Woman' })
        .then((result) => {
            res.render('products-women', { title: 'Women', products: result, user: req.user });
        })
        .catch((err) => {
            console.log(err);
        });
});


/***********************************************************/

module.exports = router;