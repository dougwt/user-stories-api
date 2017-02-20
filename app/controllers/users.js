import User from '../models/user';
import Response from '../response'

module.exports = {

  findById(req, res, next) {
    const userId = req.params.userId;
    const user = req['requestedUser']

    if (user) {
      return res.status(200).send(Response.success(user))
    } else {
      var err = new Error();
      err.status = 404;
      next(err);
    }
  },

  findAll(req, res, next) {
    const authenticatedUser = req.user;
    const query = authenticatedUser.admin ? {} : { _id: authenticatedUser._id }
    User.find(query)
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
    const { _id, id, email, password, name } = req.body;

    const userProps = {};
    if (_id || id) { return res.status(403).send(Response.error('This action is forbidden.')); }
    if (email) { userProps['email'] = email };
    if (password) { userProps['password'] = password };
    if (name) { userProps['name'] = name };


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
        } else if (err.errors.password && err.errors.password.name === 'ValidatorError' && err.errors.password.message === 'Path `password` is required.') {
          res.status(400).send(Response.error('Password is required.'))
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
    const { _id, id, admin, email, password, name } = req.body;

    function isSet(value) {
      return (typeof value !== 'undefined');
    }

    const userProps = {};
    if ( isSet(_id) || isSet(id) || isSet(admin) ) { return res.status(403).send(Response.error('This action is forbidden.')); }
    if (email) { userProps['email'] = email };
    if (password) { userProps['password'] = password };
    if (name) { userProps['name'] = name };

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
  },

  grantAdmin(req, res, next) {
    const userId = req.params.userId;
    const requestedUser = req['requestedUser'];

    User.findByIdAndUpdate(requestedUser._id, { admin: true }, { new: true, context: 'query' })
      .then((user) => {
        // Send success response
        return res.status(204).send(Response.success(user))
      })
      .catch((err) => { next(err); })
  },

  revokeAdmin(req, res, next) {
    const userId = req.params.userId;
    const requestedUser = req['requestedUser'];

    // Set user.admin = false
    User.findByIdAndUpdate(requestedUser._id, { admin: false }, { context: 'query' })
      .then((user) => {
        // Send success response
        return res.status(204).send(Response.success(user))
      })
      .catch((err) => { next(err); })
  }

};
