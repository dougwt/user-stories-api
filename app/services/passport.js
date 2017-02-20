import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt'
import LocalStrategy from 'passport-local'
import User from '../models/user';
import { JWT_SECRET } from '../config';

// Create strategy to verify user via email & password
const localOptions = {
  usernameField: 'email'
};
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  // Verify this username and password, call done with the user
  // if it is the correct username and password
  // otherwise, call done with false
  User.findOne({ email }, (err, user) => {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    // compare passwords - is `password` equal to user.password?
    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    })
  })
})

// Create strategy to verify user via JWT token
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: JWT_SECRET
};
const jwtLogin = new Strategy(jwtOptions, (payload, done) => {
  // See if the userId in the payload exists in our database
  // If it does, call done() with that user object.
  // Otherwise, call done() without a user object.
  User.findById(payload.sub, (err, user) => {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  })
})

// Tell passport to use these strategies
passport.use(localLogin);
passport.use(jwtLogin);
