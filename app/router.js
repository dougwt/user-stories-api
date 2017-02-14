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
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

// Param middleware to automatically return 404 for invalid user ID
router.param('userId', (req, res, next, value) => {
  User.findById(value)
    .then((user) => {
      req['user'] = user
      next()
    })
    .catch((err) => {
      res.status(404).send(Response.error('The requested resource does not exist.'))
    })
})
router.param('projectId', (req, res, next, value) => {
  Project.findById(value)
    .then((project) => {
      req['project'] = project
      next()
    })
    .catch((err) => {
      res.status(404).send(Response.error('The requested resource does not exist.'))
    })
})
router.param('roleId', (req, res, next, value) => {
  const projectId = req.params.projectId;

  Project.find({ "_id": projectId, "roles._id": value })
    .then((project) => {
      req['role'] = req['project'].roles.id(value)
      next()
    })
    .catch((err) => {
      res.status(404).send(Response.error('The requested resource does not exist.'))
    })
})
router.param('storyId', (req, res, next, value) => {
  const projectId = req.params.projectId;

  Project.find({ "_id": projectId, "stories._id": value })
    .then((project) => {
      req['story'] = req['project'].stories.id(value)
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
  .get(UsersController.findById)
  .put(UsersController.update)
  .delete(UsersController.delete)

router.route('/projects')
  .get(ProjectsController.findAll)
  .post(ProjectsController.create)
router.route('/projects/:projectId')
  .get(ProjectsController.findById)
  .put(ProjectsController.update)
  .delete(ProjectsController.delete)

router.route('/projects/:projectId/roles')
  .get(RolesController.findAll)
  .post(RolesController.create)
router.route('/projects/:projectId/roles/:roleId')
  .put(RolesController.update)
  .delete(RolesController.delete)

router.route('/projects/:projectId/stories')
  .get(StoriesController.findAll)
  .post(StoriesController.create)
router.route('/projects/:projectId/stories/:storyId')
  .put(StoriesController.update)
  .delete(StoriesController.delete)

// TODO: Do I need to make separate calls for put and delete, etc?
// or is there a way for me to otherwise manage handling for invalid routes?
router.get('/', (req, res, next) => {
  res.status(200).send(Response.success('Connected!'))
  // res.status(404).json({
  //   "message": "The requested resource does not exist"
  // })
})

module.exports = router;
