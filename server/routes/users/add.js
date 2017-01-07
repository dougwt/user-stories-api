// const data = require('../../data.json')
const User = require('../../models/user')

module.exports = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const name = req.body.name

  // See if a user with the given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err) }

    // If a user with email does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' })
    }

    // If a user with email does NOT exist, create and save user record
    const user = new User({
      email,
      password,
      name
    })
    user.save(function(err) {
      if (err) { return next(err) }

      // Respond to request indicating the user was created
      res.location('https://api.mycodebytes.com/v1/users/'+ user.id);
      res.status(201).json({
        id: user.id,
        email: user.email,
        name: user.name,
        creation_date: user.creation_date
      })
    })
  })
}
