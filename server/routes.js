const routes = require('express').Router()
import UsersController from './controllers/users';
import ProjectsController from './controllers/projects';
import RolesController from './controllers/roles';
import StoriesController from './controllers/stories';
const mongoose = require('mongoose');
const User = mongoose.model('user');
const Project = mongoose.model('project');
const Response = require('./response')

// Param middleware to automatically return 404 for invalid user ID
routes.param('userId', (req, res, next, value) => {
  User.findById(value)
    .then((user) => {
      req['user'] = user
      next()
    })
    .catch((err) => {
      res.status(404).send(Response.error('The requested resource does not exist.'))
    })
})
routes.param('projectId', (req, res, next, value) => {
  Project.findById(value)
    .then((project) => {
      req['project'] = project
      next()
    })
    .catch((err) => {
      res.status(404).send(Response.error('The requested resource does not exist.'))
    })
})
routes.param('roleId', (req, res, next, value) => {
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
routes.param('storyId', (req, res, next, value) => {
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


routes.route('/users')
  .get(UsersController.findAll)
  .post(UsersController.create)
routes.route('/users/:userId')
  .get(UsersController.findById)
  .put(UsersController.update)
  .delete(UsersController.delete)

routes.route('/projects')
  .get(ProjectsController.findAll)
  .post(ProjectsController.create)
routes.route('/projects/:projectId')
  .get(ProjectsController.findById)
  .put(ProjectsController.update)
  .delete(ProjectsController.delete)

routes.route('/projects/:projectId/roles')
  .get(RolesController.findAll)
  .post(RolesController.create)
routes.route('/projects/:projectId/roles/:roleId')
  .put(RolesController.update)
  .delete(RolesController.delete)

routes.route('/projects/:projectId/stories')
  .get(StoriesController.findAll)
  .post(StoriesController.create)
routes.route('/projects/:projectId/stories/:storyId')
  .put(StoriesController.update)
  .delete(StoriesController.delete)

// TODO: Do I need to make separate calls for put and delete, etc?
// or is there a way for me to otherwise manage handling for invalid routes?
routes.get('/', (req, res, next) => {
  res.status(200).send(Response.success('Connected!'))
  // res.status(404).json({
  //   "message": "The requested resource does not exist"
  // })
})

module.exports = routes
