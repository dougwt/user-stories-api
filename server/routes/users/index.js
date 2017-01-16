const users = require('express').Router()
import UsersController from '../../controllers/users';

users.get('/', UsersController.findAll)
users.post('/', UsersController.create)
users.delete('/', UsersController.delete)

users.get('/:userId', UsersController.findById)
users.put('/:userId', UsersController.update)

module.exports = users
