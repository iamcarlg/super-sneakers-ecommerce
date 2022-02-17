const router = require('express').Router();
const { Mongoose } = require('mongoose');
const User = require('../models/user-model');

router.get('/usersProfiles', (req, res) => {
    User.find() //can add sorting here. like descending order etc (refer to net ninja youtube video)
    .then((result) => {
       res.json(result) //change to res.render when returning in ejs views (refer to net ninja youtube video)
    })
    .catch((err) => {
        console.log(err);
    });
});

router.get('/search/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then(result => {
            res.json(result)
            console.log(result)
        })
        .catch(err => {
            res.status(404).render('404', { title: '404' }); //renders the 404 page if product with id does not exist
        });
});

router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;

    User.findByIdAndDelete(id)
        .then(result => {
            res.json({
                result,
                message: 'User deleted'
            });
            
        })
        .catch(err => {
            console.log(err);
        })
});




module.exports = router;



