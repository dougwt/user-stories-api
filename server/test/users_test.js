let chai = require('chai')
let chaiHttp = require('chai-http')
let { server } = require('../index')
let should = chai.should()
let User = require('../models/user');

chai.use(chaiHttp)

describe('Users API', function() {
  beforeEach((done) => {
    User.remove({}, (err) => {
       done();
    });
  })

  //////////////////////////////////////////////////////////
  //  /users
  //////////////////////////////////////////////////////////

  describe('GET /users', function() {
    it('should list ALL users on /users GET', function(done) {
      chai.request(server)
        .get('/users')
        .end(function(err, res){
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('array')
          res.body.length.should.equal(4)
          res.body[0].should.have.property('id');
          res.body[0].should.have.property('email')
          res.body[0].should.have.property('name')
          res.body[0].should.have.property('creation_date')
          res.body[0].id.should.equal(1)
          res.body[0].email.should.equal('doug@example.com')
          res.body[0].name.should.equal('Doug')
          res.body[0].creation_date.should.equal('1982-07-07T07:00:00.000Z')
          res.body[1].name.should.equal('Ada Lovelace')
          res.body[2].name.should.equal('Grace Hopper')
          res.body[3].name.should.equal('Margaret Hamilton')
          done()
        })
    })
  })

  describe('POST /users', function() {

  })

  //////////////////////////////////////////////////////////
  //  /users/<id>
  //////////////////////////////////////////////////////////

  describe('GET /users/<id>', function() {
    it('should list a SINGLE user on /users/<id> GET', function(done) {
      chai.request(server)
        .get('/users/2')
        .end(function(err, res){
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.should.have.property('id');
          res.body.should.have.property('email')
          res.body.should.have.property('name')
          res.body.should.have.property('creation_date')
          res.body.id.should.equal(2)
          res.body.email.should.equal('ada@example.com')
          res.body.name.should.equal('Ada Lovelace')
          res.body.creation_date.should.equal('1815-12-10T08:00:00.000Z')
          done()
        })
    })
    it('should return 404 status on invalid /users/<id> GET', function(done) {
      chai.request(server)
        .get('/users/100')
        .end(function(err, res){
          res.should.have.status(404)
          res.should.be.json
          done()
        })
    })
  })

  describe('PUT /users/<id>', function() {

  })

  describe('DELETE /users/<id>', function() {

  })

  //////////////////////////////////////////////////////////
  //  /projects
  //////////////////////////////////////////////////////////

  describe('GET /projects', function() {

  })

  describe('POST /projects', function() {

  })

  //////////////////////////////////////////////////////////
  //  /projects/<id>
  //////////////////////////////////////////////////////////

  describe('GET /projects/<id>', function() {

  })

  describe('PUT /projects/<id>', function() {
    // it('should update a SINGLE user on /users/<id> PUT', function(done) {
    //   chai.request(server)
    //     .post('/users')
    //     .end(function(err, res){
    //       res.should.have.status(204)
    //       res.should.be.json
    //       res.body.should.have.property('location')
    //       done()
    //     })
    // })
    // it('should return error status on invalid /users/<id> PUT', function(done) {
    //   chai.request(server)
    //     .post('/users')
    //     .end(function(err, res){
    //       res.should.have.status(404)
    //       res.should.be.json
    //       done()
    //     })
    // })
  })

  describe('DELETE /projects/<id>', function() {
    //   it('should delete a SINGLE user on /users/<id> DELETE', function(done) {
    //     chai.request(server)
    //       .post('/users')
    //       .end(function(err, res){
    //         res.should.have.status(204)
    //         res.should.be.json
    //         done()
    //       })
    //   })
    //   it('should return error status on invalid /users/<id> DELETE', function(done) {
    //     chai.request(server)
    //       .post('/users')
    //       .end(function(err, res){
    //         res.should.have.status(404)
    //         res.should.be.json
    //         done()
    //       })
    //   })
  })

  //////////////////////////////////////////////////////////
  //  /projects/<id>/roles
  //////////////////////////////////////////////////////////

  describe('GET /projects/<id>/roles', function() {

  })

  describe('POST /projects/<id>/roles', function() {

  })

  //////////////////////////////////////////////////////////
  //  /projects/<id>/roles/<id>
  //////////////////////////////////////////////////////////

  describe('PUT /projects/<id>/roles/<id>', function() {

  })

  describe('DELETE /projects/<id>/roles/<id>', function() {

  })

  //////////////////////////////////////////////////////////
  //  /projets/<id>/stories
  //////////////////////////////////////////////////////////

  describe('GET /projects/<id>/stories', function() {

  })

  describe('POST /projects/<id>/stories', function() {

  })

  //////////////////////////////////////////////////////////
  //  /projects/<id>/stories/<id>
  //////////////////////////////////////////////////////////

  describe('PUT /projects/<id>/stories/<id>', function() {

  })

  describe('DELETE /projects/<id>/stories/<id>', function() {

  })

})
