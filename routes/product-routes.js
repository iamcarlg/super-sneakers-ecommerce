//import the express router
const router = require('express').Router();

const { append, render } = require('express/lib/response');
//call the database model for products
const Product = require('../models/product-model');

//comments please
const multer  = require('multer')
const path = require('path');
const { Mongoose } = require('mongoose');

//for rezise img in backend
const sharp = require('sharp')
//FS Interacts with sharp/multer to resize img
const fs = require('fs')

/***********************************************************/

//route for retrieving all products in the database
router.get('/products', (req, res) => {
    Product.find() //can add sorting here. like descending order etc (refer to net ninja youtube video)
    .then((result) => {
        res.render('admin', {title: 'product details' ,products: result}); //change to res.render when returning in ejs views (refer to net ninja youtube video) LOOK AT THIS LATER THIS MAKES NO SENSE
    })
    .catch((err) => {
        console.log(err);
    });
});

//product posting route
router.get('/products/post', (req, res) => {
    res.render('product-post', {title: 'post new product'});
});


// we need to move this to a separate file
//file storing
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,process.cwd() + '/public/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null,  Date.now() + path.extname(file.originalname)) 
    }
  })

// Regulation & validation
const upload = multer({
    dest: 'uploads',
    storage: storage,
    
    fileFilter(req,file,cb) {
        if(!file.originalname.match(/.(jpg|png)$/)){
            return cb(new Error('Please upload picture in jpg/png format'))
        }
        cb(undefined,true)
    }
 });


 //upload product whit rezised img
 router.post('/products', upload.single('picture'), async (req, res) => {
    console.log(req.file);

    const { filename: image } = req.file;

    await sharp(req.file.path)
     .resize(200, 200)
     .jpeg({ quality: 90 })
     .toFile(
         path.resolve(req.file.destination,'resized',image)
     )
     fs.unlinkSync(req.file.path)

    let product = new Product({
    title: req.body.title,
    gender: req.body.gender,
    brand: req.body.brand,
    description: req.body.description,
    picture: req.file.filename,
    price: req.body.price
    });
    try {
        product = await product.save();
        res.redirect('/shop/products')
    } catch (error){
        console.log(error);
    }
});
// // Upload Product/picture -- Delete when don't needed
//  router.post('/products', upload.single('picture'), async (req, res) => {
//     console.log(req.file);
//     let product = new Product({
//     title: req.body.title,
//     gender: req.body.gender,
//     brand: req.body.brand,
//     description: req.body.description,
//     picture: req.file.filename,
//     price: req.body.price
//     });
//     try {
//         product = await product.save();
//         res.redirect('/shop/products')
//     } catch (error){
//         console.log(error);
//     }
// })



//route for retrieving a specific product from the database
router.get('/products/:id', (req, res) => {
    const id = req.params.id;
    Product.findById(id)
        .then(result => {
            res.render('product-details', {title: 'product details' ,product: result});
        })
        .catch(err => {
            res.status(404).render('404', { title: '404' }); //renders the 404 page if product with id does not exist
        });
});

//comments please
router.get('/edit-form/:id', (req, res) => {
    const id = req.params.id;
    Product.findById(id)
        .then(result => {
            res.render('update-product', {title: 'product details' ,product: result});
        })
        .catch(err => {
            res.status(404).render('404', { title: '404' }); //renders the 404 page if product with id does not exist
        });
});

//route for deleting an existing product
router.delete('/products/:id', (req, res) => {
    const id = req.params.id;

    Product.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/shop/products' });
        })
        .catch(err => {
            console.log(err);
        })
});

router.put('/edit-form/:id', upload.single('picture'), async (req, res)=>{
    req.product = await Product.findByIdAndUpdate(req.params.id);
    let product = req.product;
    product.title = req.body.title;
    product.gender = req.body.gender;
    product.brand = req.body.brand;
    product.description = req.body.description;
    product.price = req.body.price;
    product.picture = req.file.filename;

    try {
        const { filename: image } = req.file;
        await sharp(req.file.path)
            .resize(200, 200)
            .jpeg({ quality: 90 })
            .toFile(
                path.resolve(req.file.destination, 'resized', image)
            )
        fs.unlinkSync(req.file.path)

        product = await product.save();
        //redirect to show route
        res.redirect('/shop/products')
    } catch (error) {
        console.log(error);
    }
});



module.exports = router;