const router = require('express').Router();
// const passport = require('passport'); will we need this here later?
const {authUser, authRole} = require('../config/authentication');
const ROLE = require('../models/user-roles')


router.get('/', authUser, (req, res) => { //, authRole(ROLE.ADMIN)
    res.render('profile', {user: req.user});
});

module.exports = router;
