const data = require('../../data.json')

module.exports = (req, res, next) => {
  const userId = req.params.userId * 1
  const user = data.users.find(u => u.id === userId)

  res.status(200).json(user)
}
