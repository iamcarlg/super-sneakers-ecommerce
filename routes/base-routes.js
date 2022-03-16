const router = require('express').Router();

//call the database model for products
const Review = require('../models/review-model');


/***********************************************************/

//homepage
router.get('/', (req, res) => {
    res.render('index', {title: 'Home', user: req.user});
});

/***********************************************************/

//route for page about our website
router.get('/about', (req, res) => {
    res.render('about', {title: 'About', user: req.user});
});

//route for page about our website
router.get('/review', (req, res) => {
    
    Review.find() 
    .then((result) => {
        res.render('product-review', {title: 'review details' ,review: result}); 
    })
    .catch((err) => {
        console.log(err);
        res.status(404).render('404', { title: '404' }); //renders the 404 page if product with id does not exist

    });

});

/***********************************************************/

module.exports = router;