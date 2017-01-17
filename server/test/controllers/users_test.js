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
            res.body.data[0].should.have.property('_createdAt');
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
              res.should.be.json;
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
          res.should.be.json;
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
          res.should.be.json;
          res.body.status.should.equal('success')
          res.body.data._createdAt.should.not.be.null;
          done();
        });
    });
  })

  //////////////////////////////////////////////////////////
  //  /users/:id
  //////////////////////////////////////////////////////////

  describe('GET /users/:id', (done) => {
    it('lists a SINGLE user', (done) => {
      const user = new User({
        email: 'test@test.com',
        name: 'Test'
      });
      user.save().then(() => {
        chai.request(app)
          .get(`/users/${user._id}`)
          .end((err, res) => {
            res.should.have.status(200)
            res.should.be.json
            res.body.should.have.property('data')
            res.body.data.should.be.a('object')
            res.body.data.should.have.property('_id');
            res.body.data.should.have.property('email')
            res.body.data.should.have.property('name')
            res.body.data.should.have.property('_createdAt')
            res.body.data._id.should.equal(user.id)
            res.body.data.email.should.equal('test@test.com')
            res.body.data.name.should.equal('Test')
            res.body.status.should.equal('success')
            done()
          });
      });
    });
    it('returns a 404 status for invalid ids', (done) => {
      chai.request(app)
        .get('/users/invalid')
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('The requested resource does not exist.')
          done()
        })
    });
    it('returns a 404 status for non-existent ids', (done) => {
      chai.request(app)
        .get(`/users/${mongoose.Types.ObjectId()}`)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('The requested resource does not exist.')
          done()
        })
    })
  })

  describe('PUT /users/:id', (done) => {
    it('updates a SINGLE user on /users/:id PUT', (done) => {
      const user = new User({
        email: 'test1@test.com',
        name: 'Test 1'
      });
      user.save().then(() => {
        chai.request(app)
          .put(`/users/${user._id}`)
          .send({ email: 'test2@test.com', name: 'Test 2' })
          .end((err, res) => {
            res.should.have.status(204)
            res.headers.should.have.property('location')
            res.headers.location.startsWith('https://api.mycodebytes.com/v1/users/');
            Object.keys(res.body).length.should.equal(0)
            res.body.constructor.should.equal(Object)
            User.findById(user._id)
              .then((user) => {
                user.email.should.equal('test2@test.com')
                user.name.should.equal('Test 2')
                done()
              })
          })
      })
    })
    it('only updates provided fields', (done) => {
      const user = new User({
        email: 'test1@test.com',
        name: 'Test 1'
      });
      user.save().then(() => {
        chai.request(app)
          .put(`/users/${user._id}`)
          .send({ name: 'Test 2' })
          .end((err, res) => {
            res.should.have.status(204)
            res.headers.should.have.property('location')
            res.headers.location.startsWith('https://api.mycodebytes.com/v1/users/');
            Object.keys(res.body).length.should.equal(0)
            res.body.constructor.should.equal(Object)
            User.findById(user._id)
              .then((user) => {
                user.email.should.equal('test1@test.com')
                user.name.should.equal('Test 2')
                done()
              })
          })
      })
    });
    it('does not modify the original id', (done) => {
      const user = new User({
        email: 'test1@test.com',
        name: 'Test 1'
      });
      user.save().then(() => {
        chai.request(app)
          .put(`/users/${user._id}`)
          .send({ _id: mongoose.Types.ObjectId() })
          .end((err, res) => {
            // console.log(err)
            res.should.have.status(403)
            res.should.be.json
            res.body.status.should.equal('error')
            res.body.message.should.be.equal('This action is forbidden.')
            done()
          })
      })
    });
    it('returns error status on invalid /users/:id PUT', (done) => {
      chai.request(app)
        .put('/users/invalid')
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('The requested resource does not exist.')
          done()
        })
    })
    it('returns error status on non-existent /users/:id PUT', (done) => {
      chai.request(app)
        .put(`/users/${mongoose.Types.ObjectId()}`)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('The requested resource does not exist.')
          done()
        })
    })
    it('returns an error when an invalid email is provided', (done) => {
      const user = new User({
        email: 'test1@test.com',
        name: 'Test 1'
      });
      user.save().then(() => {
        chai.request(app)
          .put(`/users/${user._id}`)
          .send({ email: 'test2' })
          .end((err, res) => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.status.should.equal('error');
            res.body.message.should.be.equal('Email is invalid.');
            User.findById(user._id)
              .then((user) => {
                user.email.should.equal('test1@test.com')
                done()
              })
          })
      })
    });
  })

  describe('DELETE /users/:id', (done) => {
      it('should delete a SINGLE user on /users/:id DELETE', (done) => {
        const user1 = new User({
          email: 'test@test.com',
          name: 'Test'
        });
        user1.save().then(() => {
          chai.request(app)
            .delete(`/users/${user1._id}`)
            .end((err, res) => {
              Object.keys(res.body).length.should.equal(0)
              res.body.constructor.should.equal(Object)
              User.findById(user1._id)
                .then((user2) => {
                  chai.expect(user2 === null)
                  done()
                })
            })
        })
      })
      xit('should return error status on invalid /users/:id DELETE', (done) => {
        chai.request(app)
          .delete('/users')
          .end((err, res) => {
            res.should.have.status(404)
            res.should.be.json
            done()
          })
      })
    xit('deletes a SINGLE user', (done) => {

    });
    xit('returns a 404 status for invalid ids', (done) => {

    });
    xit('returns a 404 status for non-existent ids', (done) => {

    });
  })


});
