const router = require('express').Router();

/***********************************************************/

//homepage
router.get('/', (req, res) => {
    res.render('index');
});

/***********************************************************/

//route for page about our website
router.get('/about', (req, res) => {
    res.render('about');
});

/***********************************************************/

module.exports = router;