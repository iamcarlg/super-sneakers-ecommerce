//import express and set port
const express = require('express');
const app = express();

//package to override the post method to create put method
const methodOverride = require('method-override');
app.use(methodOverride('_method')); // call the override function

const port = process.env.port || 3000; //sets the localhost port to 3000

//import bodyParser to call data with req.body
var bodyParser = require('body-parser');

//import keys from keys.js
const keys = require('./config/keys');

//database connection (MongoDB) and Mongoose connection
const dbURI = keys.mongodb.dbURI; //MongoDB
const mongoose = require('mongoose'); //Mongoose

//import routes
const userRoutes = require("./routes/user-routes");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
const productRoutes = require("./routes/product-routes");
const cartRoutes = require("./routes/cart-routes");
const paypalRoutes = require('./routes/paypal-routes');

//import cookieSession. is used to control the current user session
const cookieSession = require('cookie-session');

//import path
const path = require("path");

//import passport
const passport = require('passport');

//import passport-setup. This is needed to allow the google strategy from passport-setup to run when going to the auth-routes.
const passportSetup = require('./config/passport-setup');

//Import paypal rest SDK
const paypal = require('paypal-rest-sdk');

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
.then((result) => app.listen(port)) // see if you can add a console.log to show successful connection
.catch((err) => console.log(err));

/***********************************************************/

//takes url encoded data and passes it into an object that can be used on a request object
app.use(express.urlencoded({ extended: true }));


//render the index route
app.get('/', function (req, res) {
    res.redirect('/shop/products'); //change later to res.render('whatever')?
});

//404 page (page not found redirect)
app.get((req, res) => {
    res.status(404).render('404', { title: '404' });
});

/***********************************************************/
//add comment
app.use(bodyParser.json());
//add comment
app.use(bodyParser.urlencoded({ extended: true }));

/***********************************************************/

//initialize the cookieSession
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000, //max age of the cookie we send out (we have set 24h)
    keys: [keys.session.cookieKey] //this key is used to encrypt the id so that it is encrypted by the time it reaches the browser
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

/***********************************************************/

//set view enginge to ejs
app.set('view engine', 'ejs');

//connect our views with our public folder
app.set('views', [__dirname + '/public/views', __dirname + '/public/views/users',  __dirname + '/public/views/orders', __dirname + '/public/views/payments', __dirname + '/public/views/products']);

//static folder that makes files in public folder show as views
app.use(express.static(path.join(__dirname, 'public')));

/***********************************************************/

app.listen(process.env.PORT || 3000);

//connect express app to routes
app.use('/users', userRoutes);
app.use('/profile', profileRoutes);
app.use('/auth', authRoutes);
app.use('/shop', productRoutes);
app.use('/cart', cartRoutes);
app.use('/paypal', paypalRoutes);

/***********************************************************/
