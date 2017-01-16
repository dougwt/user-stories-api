import User from '../models/user';
import Response from '../response'

// const formatResponse(text) {
//   return
// }

module.exports = {

  findById(req, res, next) {
    const userId = req.params.userId;

    User.findById(userId)
      .then((user) => {
        if (user) {
          return res.status(200).send(Response.success(user))
        }
        var err = new Error();
        err.status = 404;
        next(err);
      })
      .catch((err) => {
        next(err)
      });
  },

  findAll(req, res, next) {
    User.find({})
      .then((users) => res.status(200).send(Response.success(users)))
      .catch(next);
  },

  create(req, res, next) {
    const userProps = req.body;

    User.create(userProps)
      // TODO: replace hardcoded URI prefix
      .then((user) => res.location('https://api.mycodebytes.com/v1/users/'+ user.id).status(201).send(Response.success(user)))
      .catch((err) => {
        if (err.errors.email && err.errors.email.name === 'ValidatorError' && err.errors.email.message === 'Path `email` is required.') {
          res.status(400).send(Response.error('Email is required.'))
          next();
        } else if (err.errors.email && err.errors.email.name === 'ValidatorError' && err.errors.email.message.startsWith('Error, expected `email` to be unique.')) {
          res.status(409).send(Response.error('Email is in use.'))
          next();
        } else if (err.errors.email && err.errors.email.name === 'ValidatorError' && err.errors.email.message.startsWith('Validator failed for path `email`')) {
          res.status(400).send(Response.error('Email is invalid.'))
          next();
        } else if (err.errors.name && err.errors.name.name === 'ValidatorError' && err.errors.name.message === 'Path `name` is required.') {
          res.status(400).send(Response.error('Name is required.'))
          next();
        } else {
          next(err);
        }
      });
  },

  update(req, res, next) {
    const userId = req.params.userId;
    const userProps = req.body;
    User.findOneAndUpdate(userId, userProps)
      .then((user) => {
        if (user) {
          return res.location('https://api.mycodebytes.com/v1/users/'+ user._id).status(204).send(Response.success(user))
        }
        var err = new Error();
        err.status = 404;
        next(err);
      })
      .catch((err) => {
        if(err.codeName === 'ImmutableField') {
          res.status(403).send(Response.error('This action is forbidden.'));
          next();
        }
        next(err);
      });
  },

  delete(req, res, next) {

  }

};
