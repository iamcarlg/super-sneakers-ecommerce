//import the express router
const router = require('express').Router();

//what is this?
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

//we need to make it so that the women shoes go to the women and mens shoes go to mens
//route for admin CRUD functions on products (/admin/products)
router.get('/products', (req, res) => {
    Product.find() 
    .then((result) => {
        res.render('products-men', {title: 'product details' ,products: result}); 
    })
    .catch((err) => {
        console.log(err);
    });
});

/***********************************************************/

//product posting page
router.get('/post', (req, res) => {
    res.render('product-post', {title: 'Add Product'});
});

/***********************************************************/

//we need to move this to a separate file
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

/***********************************************************/


//can you add some comments in this
 //post product with img (img will be resized) this resize wont format correctly for our shop page btw
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
        res.redirect('/admin/products') //check if its correct
    } catch (error){
        console.log(error);
    }
});

/***********************************************************/

router.get('/products/:id', (req, res) => {
    const id = req.params.id;
    Product.findById(id)
        .then(result => {
            res.render('product-details', {title: 'product details', product: result });
        })
        .catch(err => {
            res.status(404).render('404', { title: '404' }); //renders the 404 page if product with id does not exist
        });
});

/***********************************************************/

//comments please
router.get('/update/:id', (req, res) => {
    const id = req.params.id;
    Product.findById(id)
        .then(result => {
            res.render('product-update', {title: 'product details' , products: result});
        })
        .catch(err => {
            res.status(404).render('404', { title: '404' }); //renders the 404 page if product with id does not exist
        });
});

/***********************************************************/

//route for deleting an existing product
router.delete('/products/:id', (req, res) => {
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
router.put('/update/:id', upload.single('picture'), async (req, res)=>{
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
        res.redirect('/admin/products')
    } catch (error) {
        console.log(error);
    }
});

/***********************************************************/

//route for mens products
router.get('/men', (req, res) => {
    res.render('products-men');
});

/***********************************************************/

//route for our women products
router.get('/women', (req, res) => {
    res.render('products-women');
});

/***********************************************************/

module.exports = router;