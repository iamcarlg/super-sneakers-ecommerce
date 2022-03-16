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

//product posting page
router.get('/post', (req, res) => {
    res.render('product-post', { title: 'Add Product' });
});

/***********************************************************/


//can you add some comments in this
//post product with img (img will be resized) this resize wont format correctly for our shop page btw
router.post('/product', upload.single('picture'), async (req, res) => { //should probably be called /post not /product //Karwan
    console.log(req.file);

    const { filename: image } = req.file;

    await sharp(req.file.path)
        .resize(450, 600)
        .jpeg({ quality: 90 })
        .toFile(
            path.resolve(req.file.destination, 'resized', image)
        )
    fs.unlinkSync(req.file.path)

    let product = new Product({
        title: req.body.title,
        gender: req.body.gender,
        brand: req.body.brand,
        size: req.body.size,
        description: req.body.description,
        picture: req.file.filename,
        price: req.body.price
    });

    try {
        product = await product.save();
        res.redirect('/admin/products') //check if its correct
    } catch (error) {
        console.log(error);
    }

    const name = req.body.name;
    const email = req.body.email;
    const msg = req.body.msg;

    let review = new Review({
        name: name,
        email : email,
        msg : msg
    });

    try {
        
        review = await review.save();

        Review.find(function(err, reviews){
            if(err){
                console.log(err);
            }else{     
                reviews.forEach(function(review){
                    console.log('name :' + review.name);
                    console.log('email :' + review.email);
                    console.log('msgg : ' + review.msg);
                })
            }
        })
        
        res.redirect('/shop/products/<%= product._id %>');

    } catch (error){
        console.log(error);
    }
    

    
});

/***********************************************************/

//get product by id
router.get('/product/:id', (req, res) => {
    const id = req.params.id;
    const currentUser = req.user;
    Product.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    })
        .then(result => {
            res.render('product-details', { title: 'product details', product: result, currentUser });
            //res.json(result); //change from render to this if you want to test in postman
        })
        .catch(err => {
            res.status(404).render('404', { title: '404' }); //renders the 404 page if product with id does not exist
            console.log(err);
        });
});

/***********************************************************/

// //post review on post
router.post('/product/:id/review/post', (req, res) => { //see if if/else can be replaced with authUser instead
    const currentUserId = req.user;
    const id = req.params.id;
    const review = new Review(req.body);
    review.author = currentUserId;

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
            console.log(err);
            res.redirect('/auth/login')
        });
});


/***********************************************************/

//get product by id so that you can update with put
router.get('/update/:id', (req, res) => {
    const id = req.params.id;
    Product.findById(id)
        .then(result => {
            res.render('product-update', { title: 'Update Product', products: result });
        })
        .catch(err => {
            res.status(404).render('404', { title: '404' }); //renders the 404 page if product with id does not exist
        });
});

/***********************************************************/

//comments please
router.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    Product.findById(id)
        .then(result => {
            res.render('product-delete', { title: 'Delete Product', products: result }); //what render if modal?
        })
        .catch(err => {
            res.status(404).render('404', { title: '404' }); //renders the 404 page if product with id does not exist
        });
});

/***********************************************************/

//route for deleting an existing product
router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;

    Product.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/admin/products' });
        })
        .catch(err => {
            console.log(err);
        })
});

/***********************************************************/

//route for updating our products (change the resize to how we want and then try to implement thumbnails on the admin page)
router.put('/update/:id', upload.single('picture'), async (req, res) => {
    req.product = await Product.findByIdAndUpdate(req.params.id);
    let product = req.product;
    product.title = req.body.title;
    product.gender = req.body.gender;
    product.brand = req.body.brand;
    product.description = req.body.description;
    product.price = req.body.price;
    product.size = req.body.size;
    product.picture = req.file.filename;

    try {
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
        res.redirect('/admin/products') //change to back if you get modal to work //karwan
    } catch (error) {
        console.log(error);
    }
});

/***********************************************************/

//route for mens products
router.get('/men', (req, res) => {

    Product.find({ 'gender': 'Man' })
        .then((result) => {
            res.render('products-men', { title: 'Men', products: result });
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
            res.render('products-women', { title: 'Women', products: result});
        })
        .catch((err) => {
            console.log(err);
        });
});


/***********************************************************/

module.exports = router;