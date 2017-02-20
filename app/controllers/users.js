import User from '../models/user';
import Response from '../response'

// TODO: refactor to utils
function isSet(value) {
  return (typeof value !== 'undefined');
}

module.exports = {

  // Find a single user [GET /users/:userId]
  findById(req, res, next) {
    const userId = req.params.userId;
    const user = req['requestedUser']

    // If the requested user was found...
    if (user) {
      // Return the user along with a success response.
      return res.status(200).send(Response.success(user))
    } else {
      // Otherwise, send a Not Found error response.
      var err = new Error();
      err.status = 404;
      next(err);
    }
  },

  // Find all visible users [GET /users]
  findAll(req, res, next) {
    // Unless the authenticated user has Admin privileges, filter
    // the query results to only display the auth'ed user's account.
    const authenticatedUser = req.user;
    const query = authenticatedUser.admin ? {} : { _id: authenticatedUser._id }
    User.find(query)
      .sort({ _createdAt: -1 })
      .skip(parseInt(req.query.skip))
      .limit(parseInt(req.query.limit ? req.query.limit : 100 + parseInt(req.query.skip)))
      .then((users) => res.status(200).send(Response.success(users)))
      .catch((err) => {
        next(err)
      });
  },

  // Create a new user [POST /users]
  create(req, res, next) {
    // Pull off only the specific props we expect the form to submit
    // and build our own props obj to protect from malicious clients.
    const { _id, id, email, password, name } = req.body;
    const userProps = {};
    if (_id || id) { return res.status(403).send(Response.error('This action is forbidden.')); }
    if (email) { userProps['email'] = email };
    if (password) { userProps['password'] = password };
    if (name) { userProps['name'] = name };

    // Create the new user with our sanitized input.
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

  // Update an existing user [PUT /users/:userId]
  update(req, res, next) {
    const userId = req.params.userId;
    // Pull off only the specific props we expect the form to submit
    // and build our own props obj to protect from malicious clients.
    const { _id, id, admin, email, password, name } = req.body;
    const userProps = {};
    if ( isSet(_id) || isSet(id) || isSet(admin) ) { return res.status(403).send(Response.error('This action is forbidden.')); }
    if (email) { userProps['email'] = email };
    if (password) { userProps['password'] = password };
    if (name) { userProps['name'] = name };

    // Update the user with our sanitized input.
    User.findByIdAndUpdate(userId, userProps, { runValidators: true, new: true, context: 'query' })
      .then((user) => {
        // If the requested user was found...
        if (user) {
          // Return the user along with a success response.
          // TODO: replace hardcoded URI prefix
          return res.location('https://api.mycodebytes.com/v1/users/'+ user._id).status(204).send(Response.success(user))
        } else {
          // Otherwise, send a Not Found error response.
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

  // Delete an existing user [DELETE /users/:userId]
  delete(req, res, next) {
    const userId = req.params.userId;

    User.findByIdAndRemove(userId)
      .then((user) => {
        // If the requested user was found...
        if (user) {
          // Send a success response with the user.
          return res.status(204).send(Response.success(user))
        } else {
          // Otherwise, return a Not Found error response.
          var err = new Error();
          err.status = 404;
          next(err);
        }
      })
  },

  // Grant Administrator privileges to an existing user [POST /users/:userId/admin]
  grantAdmin(req, res, next) {
    const userId = req.params.userId;
    const requestedUser = req['requestedUser'];

    // Set user.admin = true
    User.findByIdAndUpdate(requestedUser._id, { admin: true }, { new: true, context: 'query' })
      .then((user) => {
        // Send a success response
        return res.status(204).send(Response.success(user))
      })
      .catch((err) => { next(err); })
  },

  // Revoke Administrator privileges from an existing user [DELETE /users/:userId/admin]
  revokeAdmin(req, res, next) {
    const userId = req.params.userId;
    const requestedUser = req['requestedUser'];

    // Set user.admin = false
    User.findByIdAndUpdate(requestedUser._id, { admin: false }, { new: true, context: 'query' })
      .then((user) => {
        // Send a success response
        return res.status(204).send(Response.success(user))
      })
      .catch((err) => { next(err); })
  }

};
