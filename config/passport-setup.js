//imports
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user-model');


//add comment
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//add comment
passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null,user)
    });
});

//add comment
passport.use(new GoogleStrategy({
        //options for the google strategy
        callbackURL: '/auth/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        //check if user that is logging in already exists in our database
        User.findOne({googleId: profile.id}).then((existingUser) => {
            if(existingUser) {
                //if the user exists
                console.log('existing user is:' + existingUser);
                done(null, existingUser);
            }else {
                // if not, create the user and save it to the database
                console.log(profile);
                new User({
                    username: profile.displayName, //can add more here later depending on what data we want to fetch. maybe profile picture?
                    googleId: profile.id,
                    thumbnail: profile._json.picture //remember this for how to fetch data from logged in account

                }).save().then((newUser) => {
                    console.log('new user created: ' + newUser);
                    done(null, newUser); //maybe display newUser || existingUser on logout?
                });
            }
        });


    })
)