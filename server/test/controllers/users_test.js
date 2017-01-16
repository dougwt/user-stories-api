const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../../app');
const User = mongoose.model('user');

chai.use(chaiHttp)

describe('Users API', () => {

  //////////////////////////////////////////////////////////
  //  /users
  //////////////////////////////////////////////////////////

  describe('GET /users', (done) => {
    it('lists ALL users', (done) => {
      const user = new User({
        email: 'test@test.com',
        name: 'Test'
      });
      user.save().then(() => {
        chai.request(app)
          .get('/users')
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.status.should.equal('success')
            res.body.data.should.be.a('array');
            res.body.data.length.should.be.gte(1);
            res.body.data[0].should.have.property('email');
            res.body.data[0].should.have.property('name');
            res.body.data[0].should.have.property('creation_date');
            done();
          })
      });
    });
    it('returns an empty list when the collection is empty', (done) => {
      User.find({}).then((users) => {
        chai.request(app)
          .get('/users')
          .end((err, res) => {
            users.length.should.be.equal(0)
            res.should.have.status(200);
            res.should.be.json;
            res.body.status.should.equal('success')
            res.body.data.should.be.a('array');
            res.body.data.length.should.equal(0);
            done();
          });
      });
    });
  })

  describe('POST /users', (done) => {
    it('creates a new user', (done) => {
      User.count().then(count => {
        chai.request(app)
          .post('/users')
          .send({ email: 'test@test.com', name: 'Test' })
          .end((err, res) => {
            User.count().then(newCount => {
              res.should.have.status(201);
              res.headers.should.have.property('location');
              res.headers.location.startsWith('https://api.mycodebytes.com/v1/users/');
              res.body.status.should.equal('success');
              newCount.should.equal(count + 1);
              done();
            });
          });
      });
    });
    it('returns an error when an email is not provided', (done) => {
      chai.request(app)
        .post('/users')
        .send({ name: 'Test' })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.status.should.equal('error');
          res.body.message.should.be.equal('Email is required.');
          done();
        });
    });
    it('returns an error when an invalid email is provided', (done) => {
      chai.request(app)
        .post('/users')
        .send({ email: 'test', name: 'Test' })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.status.should.equal('error');
          res.body.message.should.be.equal('Email is invalid.');
          done();
        });
    });
    it('returns an error when a duplicate email is provided', (done) => {
      const user = new User({
        email: 'test@test.com',
        name: 'Test 1'
      });
      user.save().then(() => {
        chai.request(app)
          .post('/users')
          .send({ email: 'test@test.com', name: 'Test 2' })
          .end((err, res) => {
            res.should.have.status(409);
            res.should.be.json;
            res.body.status.should.equal('error')
            res.body.message.should.be.equal('Email is in use.');
            done();
          });
      });
    });
    it('returns an error when a name is not provided', (done) => {
      chai.request(app)
        .post('/users')
        .send({ email: 'test@test.com' })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('Name is required.');
          done();
        });
    });
    it('converts email addresses to lowercase', (done) => {
      chai.request(app)
        .post('/users')
        .send({ email: 'TEST@TEST.COM', name: 'Test' })
        .end((err, res) => {
          res.body.status.should.equal('success')
          res.body.data.email.should.be.equal('test@test.com');
          done();
        });
    });
    it('automatically assigns a creation_date', (done) => {
      chai.request(app)
        .post('/users')
        .send({ email: 'test@test.com', name: 'Test' })
        .end((err, res) => {
          res.body.status.should.equal('success')
          res.body.data.creation_date.should.not.be.null;
          done();
        });
    });
  })

  //////////////////////////////////////////////////////////
  //  /users/:id
  //////////////////////////////////////////////////////////

  describe('GET /users/:id', (done) => {
    xit('lists a SINGLE user', (done) => {
      chai.request(app)
        .get('/users/2')
        .end(function(err, res){
          res.should.have.status(200)
          res.should.be.json
          res.body.data.should.be.a('object')
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('email')
          res.body.data.should.have.property('name')
          res.body.data.should.have.property('creation_date')
          res.body.data.id.should.equal(2)
          res.body.data.email.should.equal('ada@example.com')
          res.body.data.name.should.equal('Ada Lovelace')
          res.body.data.creation_date.should.equal('1815-12-10T08:00:00.000Z')
          done()
        })

    });
    xit('returns a 404 status for invalid ids', (done) => {
      chai.request(server)
        .get('/users/100')
        .end(function(err, res){
          res.should.have.status(404)
          res.should.be.json
          done()
        })
    });
  })

  describe('PUT /users/:id', (done) => {
    // xit('should update a SINGLE user on /users/:id PUT', function(done) {
    //   chai.request(server)
    //     .post('/users')
    //     .end(function(err, res){
    //       res.should.have.status(204)
    //       res.should.be.json
    //       res.body.should.have.property('location')
    //       done()
    //     })
    // })
    // xit('should return error status on invalid /users/:id PUT', function(done) {
    //   chai.request(server)
    //     .post('/users')
    //     .end(function(err, res){
    //       res.should.have.status(404)
    //       res.should.be.json
    //       done()
    //     })
    // })
    xit('returns an error when an email is not provided', (done) => {

    });
    xit('returns an error when an invalid email is provided', (done) => {

    });
    xit('returns an error when a name is not provided', (done) => {

    });
    xit('does not modify the original creation_date', (done) => {

    });
  })

  describe('DELETE /users/:id', (done) => {
    //   xit('should delete a SINGLE user on /users/:id DELETE', function(done) {
    //     chai.request(server)
    //       .post('/users')
    //       .end(function(err, res){
    //         res.should.have.status(204)
    //         res.should.be.json
    //         done()
    //       })
    //   })
    //   xit('should return error status on invalid /users/:id DELETE', function(done) {
    //     chai.request(server)
    //       .post('/users')
    //       .end(function(err, res){
    //         res.should.have.status(404)
    //         res.should.be.json
    //         done()
    //       })
    //   })
    xit('deletes a SINGLE user', (done) => {

    });
    xit('returns a 404 status for invalid ids', (done) => {

    });
  })


});
