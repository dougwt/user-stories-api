const routes = require('express').Router()
import UsersController from './controllers/users';
import ProjectsController from './controllers/projects';
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


// TODO: Do I need to make separate calls for put and delete, etc?
// or is there a way for me to otherwise manage handling for invalid routes?
routes.get('/', (req, res, next) => {
  res.status(200).send(Response.success('Connected!'))
  // res.status(404).json({
  //   "message": "The requested resource does not exist"
  // })
})

module.exports = routes
