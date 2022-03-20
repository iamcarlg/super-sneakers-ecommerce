const router = require('express').Router();
/***********************************************************/

//homepage
router.get('/', (req, res) => {
    try {
        res.render('index', { title: 'Home',  message_login: req.flash('message_login'), messageloggedout: req.flash('messageloggedout'),user: req.user });
    } catch (err) {
        
        console.log("Could not find index page", err);
    }
});

/***********************************************************/

//route for page about our website
router.get('/about', (req, res) => {
    try {
        res.render('about', { title: 'About', user: req.user });
    } catch (err) {
        res.redirect('/'); //is this the best redirect path?
        console.log("Could not find about page", err);
    }
});

/***********************************************************/

module.exports = router;