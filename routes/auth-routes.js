//imports
const router = require('express').Router();
const passport = require('passport');

/*LOGIN ROUTES & AUTHENTICATION**********************************************************************************************************/

// auth login route
router.get('/login', (req, res) => {
    try {
        res.render('login', { title: 'Login', message_error: req.flash('message_error'), user: req.user }) //allows us to send req.user to login.ejs so that we can retrieve information from the current session
    } catch (err) {
        res.redirect('/'); //is this the best redirect path?
        console.log("Could not find login page", err);
    }
})

/***********************************************************/

//authorize with google if we had more oauth login websites, the other ones would be /github or /facebook
router.get('/google', passport.authenticate('google', { //should there be a () around 'google'?
    scope: ['profile', 'email'] //look here for info on what to return to a logged in user (refer to netninja passport tutorial nr 8)
}));

/***********************************************************/

//callback route for google to redirect to after successful login
router.get('/redirect', passport.authenticate('google'), (req, res) => {
    req.flash('message_login', 'You are now logged in');


    res.redirect('/'); //keep in mind this redirect tidigare redirect -> /users/profile
});

/***********************************************************/

//auth logout
router.get('/logout', (req, res) => {
    try {
        // Clear the cookie of the connected user
        res.clearCookie('connect.sid');

        // check after
        req.logout();
        
        req.flash('messageloggedout', 'You are now logged out')
        res.redirect('/'); //redirects to login page when logged out
        console.log('user logged out.');

    } catch (err) {
        res.redirect('/'); //is this the best redirect path?
        console.log("logout failed", err);
    }
});

module.exports = router;