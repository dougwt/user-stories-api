import jwt from 'jwt-simple';
import User from '../models/user';
import Response from '../response';
import { JWT_SECRET } from '../config';

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, JWT_SECRET);
}

module.exports = {

  signup(req, res, next) {
    const { email, password, name } = req.body;

    if (!email) {
      return res.status(400).send(Response.error('Email is required.'))
    }
    if (!password) {
      return res.status(400).send(Response.error('Password is required.'))
    }
    if (!name) {
      return res.status(400).send(Response.error('Name is required.'))
    }

    // See if a user with the given email exists
    User.findOne({ email }, (err, existingUser) => {
      if (err) { return next(err); }

      // If a user with the email does exist, return an error
      if (existingUser) {
        return res.status(409).send(Response.error('Email is in use.'))
      }

      // If a user with the email does NOT exist, create and save record
      const user = new User({ email, password, name })
      user.save((err) => {
        if (err) { return next(err); }

        // Response to request indicating the user was created
        res.location('https://api.mycodebytes.com/v1/users/'+ user.id).status(201).send(Response.authenticated(tokenForUser(user)))
      })
    })
  },

  signin(req, res, next) {
    // User has already had their email and password auth'd
    // we just need to give them a token
    res.send(Response.authenticated(tokenForUser(req.user)))
  },

  tokenForUser
}
