//imports
const router = require('express').Router();
const passport = require('passport');

/*LOGIN ROUTES & AUTHENTICATION**********************************************************************************************************/

// auth login route
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login', user: req.user }) //allows us to send req.user to login.ejs so that we can retrieve information from the current session
})

/***********************************************************/

//authorize with google if we had more oauth login websites, the other ones would be /github or /facebook
router.get('/google', passport.authenticate('google', { //should there be a () around 'google'?
    scope: ['profile', 'email'] //look here for info on what to return to a logged in user (refer to netninja passport tutorial nr 8)
}));

/***********************************************************/

//callback route for google to redirect to after successful login
router.get('/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/users/profile'); //keep in mind this redirect
});

/***********************************************************/

//auth logout
router.get('/logout', (req, res) => {
    // Clear the cookie of the connected user
    res.clearCookie('connect.sid');

    // check after
    //req.logout()

    // Destroy session of the user
    req.session.destroy(function (err) {
        console.log(err)
    });


    res.redirect('/auth/login'); //redirects to login page when logged out
    console.log('user logged out.');
});

module.exports = router;