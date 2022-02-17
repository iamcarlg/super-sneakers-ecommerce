function authUser (req, res, next) {
    if(!req.user) {
        //if user is not logged in
        res.redirect('/auth/login');
    } else {
        //if logged in
        next ();
    }
};

function authRole (role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            res.status(401)
            return res.send('Access denied.')
        }
    }
}

module.exports = {
    authUser,
    authRole
}