//import the express router
const router = require('express').Router();

//what is this?
const { append, render } = require('express/lib/response'); 

//call the database model for products
const Review = require('../models/review-model');

const path = require('path');
const { Mongoose } = require('mongoose');
const { format } = require('path');

//we need to make it so that the women shoes go to the women and mens shoes go to mens
//route for admin CRUD functions on products (/admin/products)
router.get('/', (req, res) => {
    Review.find() 
    
    .then((result) => {
        res.render('product-review', {title: 'Review details' , product:result, review: result });
    })
    .catch((err) => {
        console.log(err);
    });
});

router.post('/post', async (req, res) => {

    let ts = Date.now();
    let date_ob = new Date(ts);

    let day = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    const name = req.body.name;
    const email = req.body.email;
    const msg = req.body.msg;
    const date = day + ' / ' + month + ' / ' + year
    const posted = true;

    let review = new Review({
        name: name,
        email : email,
        msg : msg,
        date : date,
        posted : posted
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
                    console.log('msg : ' + review.msg);
                    console.log('Date : ' + review.date);
                    console.log('Posted : ' + review.posted);
                })
            }
        })
        
        res.redirect('/review')
    } catch (error){
        console.log(error);
    }
});




module.exports = router;
