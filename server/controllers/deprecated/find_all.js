const data = require('../../data.json')

module.exports = (req, res, next) => {
  const users = data.users

  res.status(200).json(users)
}
