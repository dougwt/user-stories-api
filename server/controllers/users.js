import User from '../models/user';
import Response from './response'

// const formatResponse(text) {
//   return
// }

module.exports = {

  findById(req, res, next) {
    const userId = req.params.id;

    User.findById(userId)
      .then((user) => res.send(Response.success(user)))
      .catch(next);
  },

  findAll(req, res, next) {
    User.find({})
      .then((users) => res.send(Response.success(users)))
      .catch(next);
  },

  create(req, res, next) {
    const userProps = req.body;

    User.create(userProps)
      .then((user) => res.send(Response.success(user)))
      .catch((err) => {
        if (err.errors.email && err.errors.email.name === 'ValidatorError' && err.errors.email.message === 'Path `email` is required.') {
          res.status(400).send(Response.error('Email field is required.'))
          next();
        } else if (err.errors.email && err.errors.email.name === 'ValidatorError' && err.errors.email.message.startsWith('Error, expected `email` to be unique.')) {
          res.status(400).send(Response.error('Email already registered.'))
          next();
        } else if (err.errors.name && err.errors.name.name === 'ValidatorError' && err.errors.name.message === 'Path `name` is required.') {
          res.status(400).send(Response.error('Name field is required.'))
          next();
        } else {
          next(err);
        }
      });
  },

  update(req, res, next) {

  },

  delete(req, res, next) {

  }

};
