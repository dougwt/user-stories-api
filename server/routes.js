const routes = require('express').Router()
import UsersController from './controllers/users';

// // Param middleware to automatically return 404 for invalid user ID
// users.param('userId', (req, res, next, value) => {
//   const user = data.users.find(m => m.id === (value * 1))
//
//   if (user) {
//     req['user'] = user
//     next()
//   } else {
//     res.status(404).json({
//       "message": "The requested resource does not exist"
//     })
//   }
// })

routes.route('/users')
  .get(UsersController.findAll)
  .post(UsersController.create)

routes.route('/users/:userId')
  .get(UsersController.findById)
  .put(UsersController.update)
  .delete(UsersController.delete)

// TODO: Do I need to make separate calls for put and delete, etc?
// or is there a way for me to otherwise manage handling for invalid routes?
routes.get('/', (req, res, next) => {
  res.status(200).json({ message: 'Connected!' })
  // res.status(404).json({
  //   "message": "The requested resource does not exist"
  // })
})

module.exports = routes
