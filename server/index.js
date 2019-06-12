const express = require('express');
const app = express();
const port = 8080;
const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;
const config = require('./config');

passport.use(new Strategy({
  clientID: config.FACEBOOK_CLIENT_ID,
  clientSecret: config.FACEBOOK_CLIENT_SECRET,
  callbackURL: '/facebook/callback',
  profileFields: ['id', 'displayName', 'email', 'name', 'photos'],
  passReqToCallback: true,
},
function(accessToken, refreshToken, profile, cb) {
  // save the profile on the Database
  // Save the accessToken and refreshToken if you need to call facebook apis later on
  return cb(null, profile);
}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/facebook', passport.authenticate('facebook'));
app.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: `${config.FRONTEND_HOST}/error`}), (req, res) => {
  res.send(`${config.FRONTEND_HOST}/success`);
}) ;

app.listen(port, () => {
  console.log(`App is listening on ${port}`);
})