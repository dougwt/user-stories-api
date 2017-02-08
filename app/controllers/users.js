import User from '../models/user';
import Response from '../response'

module.exports = {

  findById(req, res, next) {
    const userId = req.params.userId;
    const user = req['user']

    if (user) {
      return res.status(200).send(Response.success(user))
    } else {
      var err = new Error();
      err.status = 404;
      next(err);
    }
  },

  findAll(req, res, next) {
    User.find({})
      .sort({ _createdAt: -1 })
      .skip(parseInt(req.query.skip))
      .limit(parseInt(req.query.limit ? req.query.limit : 100 + parseInt(req.query.skip)))
      .then((users) => res.status(200).send(Response.success(users)))
      .catch((err) => {
        console.log('detected error:', err)
        next(err)
      });
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
    User.findByIdAndUpdate(userId, userProps, { runValidators: true, context: 'query' })
      .then((user) => {
        if (user) {
          // TODO: replace hardcoded URI prefix
          return res.location('https://api.mycodebytes.com/v1/users/'+ user._id).status(204).send(Response.success(user))
        } else {
          var err = new Error();
          err.status = 404;
          next(err);
        }
      })
      .catch((err) => {
        if(err.codeName === 'ImmutableField' || (err.name === 'MongoError' && err.message === 'exception: Mod on _id not allowed')) {
          res.status(403).send(Response.error('This action is forbidden.'));
          next();
        } else if (err.errors && err.errors.email && err.errors.email.name === 'ValidatorError' && err.errors.email.message.startsWith('Validator failed for path `email`')) {
          res.status(400).send(Response.error('Email is invalid.'));
          next();
        }
        next(err);
      });
  },

  delete(req, res, next) {
    const userId = req.params.userId;

    User.findByIdAndRemove(userId)
      .then((user) => {
        if (user) {
          return res.status(204).send(Response.success(user))
        } else {
          var err = new Error();
          err.status = 404;
          next(err);
        }
      })
  }

};