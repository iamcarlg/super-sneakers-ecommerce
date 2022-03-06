const router = require('express').Router();

/***********************************************************/

//homepage
router.get('/', (req, res) => {
    res.render('index', {title: 'Home', user: req.user});
});

/***********************************************************/

//route for page about our website
router.get('/about', (req, res) => {
    res.render('about', {title: 'About', user: req.user});
});

/***********************************************************/

module.exports = router;