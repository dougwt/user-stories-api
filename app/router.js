import passport from 'passport';
import mongoose from 'mongoose';
import AuthController from './controllers/authentication';
import UsersController from './controllers/users';
import ProjectsController from './controllers/projects';
import RolesController from './controllers/roles';
import StoriesController from './controllers/stories';
import passportService from './services/passport';
import Response from './response';

const router = require('express').Router();

const User = mongoose.model('user');
const Project = mongoose.model('project');

// Route handler middleware to require authentication
const requireAuth = (req, res, next) => {
  return passport.authenticate('jwt', { session: false },
    function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.status(401).send(Response.error('You are unauthorized to make this request.')); }
      req.user = user;
      next();
    })(req, res, next);
}
// Route handler middleware to require sign in
const requireSignin = (req, res, next) => {
  if (!req.body.email) {
    return res.status(400).send(Response.error('Email is required.'))
  }
  if(!req.body.password) {
    return res.status(400).send(Response.error('Password is required.'))
  }

  return passport.authenticate('local', { session: false },
    function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.status(401).send(Response.error('You are unauthorized to make this request.')); }
      req.user = user;
      next();
    })(req, res, next);
}
// Route handler middleware to restrict access to projects not owned by the authenticated User
const restrictToSelf = (req, res, next) => {
  const requestedUser = req['requestedUser'];
  const authenticatedUser = req.user;
  if (requestedUser && authenticatedUser && requestedUser.id !== authenticatedUser.id) {
    return res.status(403).send(Response.error('You do not have sufficient permissions to execute this operation.'))
  }
  next();
}

// Param middleware to automatically return 404 for invalid User ID
router.param('userId', (req, res, next, value) => {
  User.findById(value)
    .then((user) => {
      if (!user) {
        return res.status(404).send(Response.error('The requested resource does not exist.'));
      }

      req['requestedUser'] = user
      next()
    })
    .catch((err) => {
      res.status(404).send(Response.error('The requested resource does not exist.'))
    })
})
// Param middleware to automatically return 404 for invalid Project ID
router.param('projectId', (req, res, next, value) => {
  Project.findById(value)
    .then((project) => {
      req['requestedProject'] = project
      User.findById(project.owner)
        .then((user) => {
          req['requestedUser'] = user
          next()
        })
    })
    .catch((err) => {
      res.status(404).send(Response.error('The requested resource does not exist.'))
    })
})
// Param middleware to automatically return 404 for invalid Role ID
router.param('roleId', (req, res, next, value) => {
  const projectId = req.params.projectId;

  Project.find({ "_id": projectId, "roles._id": value })
    .then((project) => {
      req['requestedRole'] = req['requestedProject'].roles.id(value)
      next()
    })
    .catch((err) => {
      res.status(404).send(Response.error('The requested resource does not exist.'))
    })
})
// Param middleware to automatically return 404 for invalid Story ID
router.param('storyId', (req, res, next, value) => {
  const projectId = req.params.projectId;

  Project.find({ "_id": projectId, "stories._id": value })
    .then((project) => {
      req['requestedStory'] = req['requestedProject'].stories.id(value)
      next()
    })
    .catch((err) => {
      res.status(404).send(Response.error('The requested resource does not exist.'))
    })
})

router.route('/signup')
  .post(AuthController.signup)
router.route('/signin')
  .post(requireSignin, AuthController.signin)
router.route('/auth_test')
  .get(requireAuth, (req, res) => {res.send({ success: true })})
router.route('/users')
  .get(UsersController.findAll)
  .post(UsersController.create)
router.route('/users/:userId')
  .get(requireAuth, restrictToSelf, UsersController.findById)
  .put(requireAuth, restrictToSelf, UsersController.update)
  .delete(requireAuth, restrictToSelf, UsersController.delete)
router.route('/users/:userId/admin')
  .post(UsersController.grantAdmin)
  .delete(UsersController.revokeAdmin)

router.route('/projects')
  .get(requireAuth, ProjectsController.findAll)
  .post(requireAuth, ProjectsController.create)
router.route('/projects/:projectId')
  .get(requireAuth, restrictToSelf, ProjectsController.findById)
  .put(requireAuth, restrictToSelf, ProjectsController.update)
  .delete(requireAuth, restrictToSelf, ProjectsController.delete)

router.route('/projects/:projectId/roles')
  .get(requireAuth, restrictToSelf, RolesController.findAll)
  .post(requireAuth, restrictToSelf, RolesController.create)
router.route('/projects/:projectId/roles/:roleId')
  .put(requireAuth, restrictToSelf, RolesController.update)
  .delete(requireAuth, restrictToSelf, RolesController.delete)

router.route('/projects/:projectId/stories')
  .get(requireAuth, restrictToSelf, StoriesController.findAll)
  .post(requireAuth, restrictToSelf, StoriesController.create)
router.route('/projects/:projectId/stories/:storyId')
  .put(requireAuth, restrictToSelf, StoriesController.update)
  .delete(requireAuth, restrictToSelf, StoriesController.delete)

// TODO: Do I need to make separate calls for put and delete, etc?
// or is there a way for me to otherwise manage handling for invalid routes?
router.get('/', (req, res, next) => {
  res.status(200).send(Response.success('Connected!'))
  // res.status(404).json({
  //   "message": "The requested resource does not exist"
  // })
})

module.exports = router;
