const routes = require('express').Router()
const users = require('./users')

// Param middleware to automatically return 404 for invalid user ID
users.param('userId', (req, res, next, value) => {
  const user = data.users.find(m => m.id === (value * 1))

  if (user) {
    req['user'] = user
    next()
  } else {
    res.status(404).json({
      "message": "The requested resource does not exist"
    })
  }
})

routes.use('/users', users)

routes.get('/', (req, res, next) => {
  // res.status(200).json({ message: 'Connected!' })
  res.status(404).json({
    "message": "The requested resource does not exist"
  })
})

module.exports = routes
