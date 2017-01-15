const users = require('express').Router()
import UserController from '../../controllers/user';

users.get('/', UserController.findAll)
// users.post('/', UserController.create)
// users.delete('/', UserController.delete)

// users.get('/:userId', UserController.findById)
// users.put('/:userId', UserController.update)

module.exports = users
