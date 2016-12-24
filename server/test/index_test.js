let chai = require('chai')
let chaiHttp = require('chai-http')
let { server } = require('../index')
let should = chai.should()

chai.use(chaiHttp)

// describe('Login', function() {
//   it('should list ALL blobs on /blobs GET')
//   it('should list a SINGLE blob on /blob/<id> GET')
//   it('should add a SINGLE blob on /blobs POST')
//   it('should update a SINGLE blob on /blob/<id> PUT')
//   it('should delete a SINGLE blob on /blob/<id> DELETE')
// })

describe('Users', function(done) {
  it('should list ALL users on /users GET', function(done) {
    chai.request(server)
      .get('/users')
      .end(function(err, res){
        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.a('array')
        done()
      })
  })
  it('should list a SINGLE user on /users/<id> GET', function(done) {
    chai.request(server)
      .get('/users/id')
      .end(function(err, res){
        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.a('array')
        done()
      })
  })
  it('should add a SINGLE user on /users POST')
  it('should update a SINGLE user on /users/<id> PUT')
  it('should delete a SINGLE user on /users/<id> DELETE')
})

describe('Projects', function() {
  it('should list ALL projects on /projects GET')
  it('should list a SINGLE project on /projects/<id> GET')
  it('should add a SINGLE project on /projects POST')
  it('should update a SINGLE project on /projects/<id> PUT')
  it('should delete a SINGLE project on /projects/<id> DELETE')
})

describe('ProjectRoles', function() {
  it('should list ALL roles on /projects/<id>/roles GET')
  it('should add a SINGLE role on /projects/<id>/roles POST')
  it('should update a SINGLE role on /projects/<id>/roles/<id> PUT')
  it('should delete a SINGLE role on /projects/<id>/roles/<id> DELETE')
})

describe('ProjectStories', function() {
  it('should list ALL stories on /projects/<id>/stories GET')
  it('should list a SINGLE story on /projects/<id>/stories/<id> GET')
  it('should add a SINGLE story on /projects/<id>/stories POST')
  it('should update a SINGLE story on /projects/<id>/stories/<id> PUT')
  it('should delete a SINGLE story on /projects/<id>/stories/<id> DELETE')
})
