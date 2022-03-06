//const User = require('../models/user-model');
//const ROLE = require('../models/user-roles')

function authUser(req, res, next) {
    if (!req.user) {
        //if user is not logged in
        res.redirect('/auth/login');
    } else {
        console.log(req.user)
        //if logged in
        next();
    }
};

function authRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            res.status(401)
            res.redirect('/');
        }
        next()
    }
};
module.exports = {
    authUser,
    authRole
}