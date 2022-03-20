//imports
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user-model');


//something to do with stashing the user in a cookie which needs to first be serialized and then deserialized for some reason
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null,user)
    });
});

//our google strategy for loggin in with google
passport.use(new GoogleStrategy({
        //options for the google strategy
        callbackURL: '/auth/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
    }, (accessToken, refreshToken, profile, done) => { //what does access and refreshtoken do? lookup if we should implement //Karwan
        //check if user that is logging in already exists in our database
        User.findOne({googleId: profile.id}).then((existingUser) => {
            if(existingUser) {
                //if the user exists
                console.log('existing user is:' + existingUser); //This is shown when an existing user logs in again
                done(null, existingUser);
            }else {
                // if not, create the user and save it to the database
                console.log(profile);
                new User({
                    //define what data from google should be stored in the user tables in the database.
                    username: profile.displayName, 
                    googleId: profile.id,
                    thumbnail: profile._json.picture,
                    email: profile._json.email, //remember this for how to fetch data from logged in account

                }).save().then((newUser) => {
                    console.log('new user created: ' + newUser);// this is shown when a new account logs in for the first time
                    done(null, newUser); 
                });
            }
        });
    })
)