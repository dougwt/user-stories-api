import User from '../models/user';

module.exports = {

  findById(req, res, next) {

  },

  findAll(req, res, next) {

  },

  create(req, res, next) {
    const userProps = req.body;

    User.create(userProps)
      .then((user) => res.send(user))
      .catch(next);
  },

  update(req, res, next) {

  },

  delete(req, res, next) {

  }

};
