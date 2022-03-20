//function for authorizing if a user is logged in
function authUser(req, res, next) {
    if (!req.user) {
        //if user is not logged in
        res.redirect('/auth/login');
        req.flash('messagereview', 'You\'re not authorized to do this.')
    } else {
        console.log(req.user)
        //if logged in
        next();
    }
};

//function for authorizing based on role
function authRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            res.status(401)
            res.redirect('back'),
            req.flash('messagereview', 'You\'re not authorized to do this.') //doesn't work
        }
        next()
    }
};
module.exports = {
    authUser,
    authRole
}