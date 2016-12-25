import Users from './controllers/users'

export default function(app) {
  app.get('/users', Users.findAll)
  app.get('/users/:id', Users.findById)
  app.post('/users', Users.addUser)
  app.put('/users/:id', Users.updateUser)
  app.delete('/users/:id', Users.deleteUser)
}
