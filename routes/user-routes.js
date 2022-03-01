const router = require('express').Router();
const { Mongoose } = require('mongoose'); //is this needed? i dont think so

//call the mongoose user model
const User = require('../models/user-model');

//call authentication code
const {authUser, authRole} = require('../config/authentication');
const ROLE = require('../models/user-roles')

/***********************************************************/

//add comment
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

/***********************************************************/

//this page renders the profile page that is only accessible after login
router.get('/profile', authUser, (req, res) => { //, authRole(ROLE.ADMIN)
    res.render('profile', {user: req.user});
});

/***********************************************************/

module.exports = router;



