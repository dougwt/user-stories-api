const mockData = [
  {
    id: 1,
    email: "doug@example.com",
    name: "Doug",
    creation_date: new Date('July 7, 1982')
  },
  {
    id: 2,
    email: "ada@example.com",
    name: "Ada Lovelace",
    creation_date: new Date('December 10, 1815')
  },
  {
    id: 3,
    email: "grace@example.com",
    name: "Grace Hopper",
    creation_date: new Date('December 9, 1906')
  },
  { id: 4,
    email: "margaret@example.com",
    name: "Margaret Hamilton",
    creation_date: new Date('August 17, 1936')
  }
]

// [
//   {
//     "id": "1",
//     "email": "doug@example.com",
//     "name": "Doug",
//     "creation_date": "2016-12-25T01:20:23.701Z"
//   },
//   {
//     "id": "2",
//     "email": "grace@example.com",
//     "name": "Doug",
//     "creation_date": "2016-12-25T01:20:23.701Z"
//   },
//   {
//     "id": "3",
//     "email": "doug@example.com",
//     "name": "Doug",
//     "creation_date": "2016-12-25T01:20:23.701Z"
//   },
//   {
//     "id": "4",
//     "email": "doug@example.com",
//     "name": "Doug",
//     "creation_date": "2016-12-25T01:20:23.701Z"
//   }
// ]
exports.findAll = function(req, res, next) {
  res.send(mockData)
}

exports.findById = function(req, res, next) {
  const id = req.params.id
  // let valid_ids = mockData.map((user) => { return user.id })
  let match = mockData.filter((user) => { return user.id == id })[0]

  if (id && match) {
    res.send(match)
  } else {
    res.status(404).send({
      "message" : "The requested resource does not exist",
      "errorCode" : "NOT_FOUND"
    })
  }
}

exports.addUser = function(req, res, next) {

}

exports.updateUser = function(req, res, next) {

}

exports.deleteUser = function(req, res, next) {

}
