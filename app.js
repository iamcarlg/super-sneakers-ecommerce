//import express and set port
const express = require('express');
const app = express();

//package to override the post method to create put method
const methodOverride = require('method-override');

//specifies our localhost port
const port = process.env.port || 3000; //sets the localhost port to 3000

//import bodyParser to call data with req.body
var bodyParser = require('body-parser');

//import keys from keys.js
const keys = require('./config/keys');

//database connection (MongoDB) and Mongoose connection
const dbURI = keys.mongodb.dbURI; //MongoDB
const mongoose = require('mongoose'); //Mongoose

//import routes
const baseRoutes = require("./routes/base-routes");
const userRoutes = require("./routes/user-routes");
const authRoutes = require("./routes/auth-routes");
const adminRoutes = require("./routes/admin-routes");
const productRoutes = require("./routes/product-routes");
const paypalRoutes = require('./routes/paypal-routes');
const cartRoutes = require('./routes/cart-routes');
const reviewsRoutes = require('./routes/reviews-routes');

//cookie-parser is a middleware which parses cookies attached to the client request object. 
var cookieParser = require('cookie-parser')

//import cookieSession. is used to control the current user session
const session = require('express-session');

// Allows us to store individual session items to mongo session store.S
const MongoStore = require('connect-mongo');

//import path
const path = require("path");

//import passport
const passport = require('passport');

//import passport-setup. This is needed to allow the google strategy from passport-setup to run when going to the auth-routes.
const passportSetup = require('./config/passport-setup');

//Import paypal rest SDK
const paypal = require('paypal-rest-sdk');

/***********************************************************/

// call the override function to change post to put
app.use(methodOverride('_method')); 

/***********************************************************/

//configure paypal
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': keys.paypal.clientID,
    'client_secret': keys.paypal.clientSecret
  });

/************************************************* */

//connect mongoose to MongoDB
mongoose.connect(dbURI)
.then((result) => console.log("Server listening on port: " + port))
.catch((err) => console.log(err));

/***********************************************************/

//takes url encoded data and passes it into an object that can be used on a request object
app.use(express.urlencoded({ extended: true }));

//404 page (page not found redirect)
app.get((req, res) => {
    res.status(404).render('404', { title: '404 | Page not found' });
});

/***********************************************************/
//add comment
app.use(bodyParser.json());
//add comment
app.use(bodyParser.urlencoded({ extended: true }));

/***********************************************************/

//initialize the cookieSession
// app.use(expressSession({
//     maxAge: 24 * 60 * 60 * 1000, //max age of the cookie we send out (we have set 24h)
//     keys: [keys.session.cookieKey] //this key is used to encrypt the id so that it is encrypted by the time it reaches the browser
// }));

// initialize the express session to store information from the session
app.use(cookieParser()) // Handles removal of cookies for individual session.

app.use(session({
    secret: keys.session.expressKey,  //this key is used to encrypt the id so that it is encrypted by the time it reaches the browser
    resave: false, //add comment
    saveUninitialized: false, //add comment
    cookie: {
        maxAge: 180 * 60 * 1000
    }, //max age of the cookie we send out (we have set 24h)
    // Mongo session store for our cart.
    store: MongoStore.create({
        mongoUrl: dbURI
    }),    
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

/***********************************************************/

//set view enginge to ejs
app.set('view engine', 'ejs');

//connect our views with our public folder
app.set('views', [__dirname + '/public/views/base', __dirname + '/public/views/admin', __dirname + '/public/views/users',  __dirname + '/public/views/orders', __dirname + '/public/views/payments', __dirname + '/public/views/products']);


//static folder that makes files in public folder show as views
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();

})

/***********************************************************/

//connect express app to routes
app.use('/', baseRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/shop', productRoutes);
app.use('/admin', adminRoutes);
app.use('/paypal', paypalRoutes);
app.use('/cart', cartRoutes);
app.use('/reviews', reviewsRoutes);

/***********************************************************/

// The App is listening on PORT 3000 locally and on process.env.PORT When deployed on the web
app.listen(port, function(err){
    if (err) console.log(err + "Error in server setup");
})