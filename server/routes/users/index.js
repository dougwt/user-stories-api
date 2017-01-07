const users = require('express').Router()
const findAll = require('./find_all')
const add = require('./add')
// const delete = require('./delete')
const findSingle = require('./find_single')
// const update = require('./update')

users.get('/', findAll)
users.post('/', add)
// users.delete('/', delete)

users.get('/:userId', findSingle)
// users.put('/:userId', update)

module.exports = users
