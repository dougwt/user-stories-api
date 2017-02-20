const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../../app');
const User = mongoose.model('user');
import { tokenForUser } from '../../app/controllers/authentication'

chai.use(chaiHttp)

describe('Users API', () => {

  //////////////////////////////////////////////////////////
  //  /users
  //////////////////////////////////////////////////////////

  describe('GET /users', (done) => {
    it('lists ALL users', (done) => {
      const user = new User({
        email: 'test@test.com',
        password: 'password',
        name: 'Test',
        admin: true
      });
      user.save().then(() => {
        chai.request(app)
          .get('/users')
          .set('authorization', tokenForUser(user))
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
    it('lists ALL users sorted by descending creation dates', (done) => {
      const u1 = new User({
        email: 'test1@test.com',
        password: 'password',
        name: 'Test 1',
        admin: true
      });
      const u2 = new User({
        email: 'test2@test.com',
        password: 'password',
        name: 'Test 2'
      });
      const u3 = new User({
        email: 'test3@test.com',
        password: 'password',
        name: 'Test 3'
      });
      const { users } = mongoose.connection.collections;
      users.drop(() => {
        u1.save(() => {
          u2.save(() => {
            u3.save(() => {
              chai.request(app)
                .get('/users')
                .set('authorization', tokenForUser(u1))
                .end((err, res) => {
                  res.should.have.status(200);
                  res.should.be.json;
                  res.body.status.should.equal('success')
                  res.body.data.should.be.a('array');
                  res.body.data.length.should.equal(3);
                  res.body.data[0].should.have.property('email');
                  res.body.data[0].should.have.property('name');
                  res.body.data[0].should.have.property('_createdAt');
                  res.body.data[0].email.should.equal('test3@test.com');
                  res.body.data[1].email.should.equal('test2@test.com');
                  res.body.data[2].email.should.equal('test1@test.com');
                  done();
                })
            });
          });
        });
      });
    });
    it('supports use of only the skip param', (done) => {
      const u1 = new User({
        email: 'test1@test.com',
        password: 'password',
        name: 'Test 1',
        admin: true
      });
      const u2 = new User({
        email: 'test2@test.com',
        password: 'password',
        name: 'Test 2'
      });
      const u3 = new User({
        email: 'test3@test.com',
        password: 'password',
        name: 'Test 3'
      });
      const u4 = new User({
        email: 'test4@test.com',
        password: 'password',
        name: 'Test 4'
      });
      const { users } = mongoose.connection.collections;
      users.drop(() => {
        u1.save(() => {
          u2.save(() => {
            u3.save(() => {
              u3.save(() => {
                u4.save(() => {
                  chai.request(app)
                    .get('/users?skip=2')
                    .set('authorization', tokenForUser(u1))
                    .end((err, res) => {
                      res.should.have.status(200);
                      res.should.be.json;
                      res.body.status.should.equal('success')
                      res.body.data.should.be.a('array');
                      res.body.data.length.should.be.equal(2);
                      res.body.data[0].email.should.equal('test2@test.com');
                      res.body.data[1].email.should.equal('test1@test.com');
                      done();
                    })
                })
              })
            })
          })
        })
      })
    });
    it('supports use of only the limit param', (done) => {
      const u1 = new User({
        email: 'test1@test.com',
        password: 'password',
        name: 'Test 1',
        admin: true
      });
      const u2 = new User({
        email: 'test2@test.com',
        password: 'password',
        name: 'Test 2'
      });
      const u3 = new User({
        email: 'test3@test.com',
        password: 'password',
        name: 'Test 3'
      });
      const u4 = new User({
        email: 'test4@test.com',
        password: 'password',
        name: 'Test 4'
      });
      const { users } = mongoose.connection.collections;
      users.drop(() => {
        u1.save(() => {
          u2.save(() => {
            u3.save(() => {
              u3.save(() => {
                u4.save(() => {
                  chai.request(app)
                    .get('/users?limit=3')
                    .set('authorization', tokenForUser(u1))
                    .end((err, res) => {
                      res.should.have.status(200);
                      res.should.be.json;
                      res.body.status.should.equal('success')
                      res.body.data.should.be.a('array');
                      res.body.data.length.should.be.equal(3);
                      res.body.data[0].email.should.equal('test4@test.com');
                      res.body.data[1].email.should.equal('test3@test.com');
                      res.body.data[2].email.should.equal('test2@test.com');
                      done();
                    })
                })
              })
            })
          })
        })
      });
    });
    it('supports use of both the skip and limit params', (done) => {
      const u1 = new User({
        email: 'test1@test.com',
        password: 'password',
        name: 'Test 1',
        admin: true
      });
      const u2 = new User({
        email: 'test2@test.com',
        password: 'password',
        name: 'Test 2'
      });
      const u3 = new User({
        email: 'test3@test.com',
        password: 'password',
        name: 'Test 3'
      });
      const u4 = new User({
        email: 'test4@test.com',
        password: 'password',
        name: 'Test 4'
      });
      const { users } = mongoose.connection.collections;
      users.drop(() => {
        u1.save(() => {
          u2.save(() => {
            u3.save(() => {
              u3.save(() => {
                u4.save(() => {
                  chai.request(app)
                    .get('/users?skip=1&limit=2')
                    .set('authorization', tokenForUser(u1))
                    .end((err, res) => {
                      res.should.have.status(200);
                      res.should.be.json;
                      res.body.status.should.equal('success')
                      res.body.data.should.be.a('array');
                      res.body.data.length.should.be.equal(2);
                      res.body.data[0].email.should.equal('test3@test.com');
                      res.body.data[1].email.should.equal('test2@test.com');
                      done();
                    })
                })
              })
            })
          })
        })
      });
    });
    it('returns a 401 status for unauthorized requests', (done) => {
      chai.request(app)
        .get('/users')
        .end((err, res) => {
          res.should.have.status(401)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('You are unauthorized to make this request.')
          done();
        })
    });
    it('only shows an authed user their own account', (done) => {
      const userAdmin = new User({
        email: 'test1@test.com',
        password: 'password',
        name: 'Test 1',
        admin: true
      });
      const userNonAdmin = new User({
        email: 'test2@test.com',
        password: 'password',
        name: 'Test 2'
      });
      userAdmin.save(() => {
        userNonAdmin.save(() => {
          chai.request(app)
            .get('/users')
            .set('authorization', tokenForUser(userNonAdmin))
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.status.should.equal('success')
              res.body.data.should.be.a('array');
              res.body.data.length.should.be.equal(1);
              res.body.data[0].email.should.equal('test2@test.com');
              done();
            })
        });
      });
    });
    it('shows an authed admin everyone\'s accounts', (done) => {
      const userAdmin = new User({
        email: 'test1@test.com',
        password: 'password',
        name: 'Test',
        admin: true
      });
      const userNonAdmin = new User({
        email: 'test2@test.com',
        password: 'password',
        name: 'Test'
      });
      userAdmin.save(() => {
        userNonAdmin.save(() => {
          chai.request(app)
            .get('/users')
            .set('authorization', tokenForUser(userAdmin))
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.status.should.equal('success')
              res.body.data.should.be.a('array');
              res.body.data.length.should.be.equal(2);
              res.body.data[0].email.should.equal('test2@test.com');
              res.body.data[1].email.should.equal('test1@test.com');
              done();
            })
        });
      });
    });
  })

  describe('POST /users', () => {
    let u1, u2;

    beforeEach((done) => {
      u1 = new User({
        email: 'testA@test.com',
        password: 'password',
        name: 'Test A',
        admin: true
      });
      u2 = new User({
        email: 'testB@test.com',
        password: 'password',
        name: 'Test B'
      });
      u1.save(() => {
        u2.save(() => {
          done()
        })
      })
    })

    it('creates a new user', (done) => {
      User.count().then(count => {
        chai.request(app)
          .post('/users')
          .send({ email: 'test@test.com', password: 'password', name: 'Test' })
          .set('authorization', tokenForUser(u1))
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
    it('creates a non-admin user by default', (done) => {
      chai.request(app)
        .post('/users')
        .send({ email: 'test@test.com', password: 'password', name: 'Test' })
        .set('authorization', tokenForUser(u1))
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.status.should.equal('success');
          res.body.data.admin.should.equal(false);
          done();
        });
    });
    it('creates a non-admin user even when passed admin prop', (done) => {
      chai.request(app)
        .post('/users')
        .send({ email: 'test@test.com', password: 'password', name: 'Test', admin: true })
        .set('authorization', tokenForUser(u1))
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.status.should.equal('success');
          res.body.data.admin.should.equal(false);
          done();
        });
    });
    it('returns a 400 status when an email is not provided', (done) => {
      chai.request(app)
        .post('/users')
        .send({ password: 'password', name: 'Test' })
        .set('authorization', tokenForUser(u1))
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.status.should.equal('error');
          res.body.message.should.be.equal('Email is required.');
          done();
        });
    });
    it('returns a 400 status when an invalid email is provided', (done) => {
      chai.request(app)
        .post('/users')
        .send({ email: 'test', password: 'password', name: 'Test' })
        .set('authorization', tokenForUser(u1))
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.status.should.equal('error');
          res.body.message.should.be.equal('Email is invalid.');
          done();
        });
    });
    it('returns a 409 status when a duplicate email is provided', (done) => {
      const user = new User({ email: 'test@test.com', password: 'password', name: 'Test 1' });
      user.save().then(() => {
        chai.request(app)
          .post('/users')
          .send({ email: 'test@test.com', password: 'password', name: 'Test 2' })
          .set('authorization', tokenForUser(u1))
          .end((err, res) => {
            res.should.have.status(409);
            res.should.be.json;
            res.body.status.should.equal('error')
            res.body.message.should.be.equal('Email is in use.');
            done();
          });
      });
    });
    it('returns a 400 status when a password is not provided', (done) => {
      chai.request(app)
        .post('/users')
        .send({ email: 'test@test.com', name: 'Test' })
        .set('authorization', tokenForUser(u1))
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('Password is required.');
          done();
        });
    });
    it('returns a 400 status when a name is not provided', (done) => {
      chai.request(app)
        .post('/users')
        .send({ email: 'test@test.com', password: 'password' })
        .set('authorization', tokenForUser(u1))
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
        .send({ email: 'TEST@TEST.COM', password: 'password', name: 'Test' })
        .set('authorization', tokenForUser(u1))
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
        .send({ email: 'test@test.com', password: 'password', name: 'Test' })
        .set('authorization', tokenForUser(u1))
        .end((err, res) => {
          res.should.be.json;
          res.body.status.should.equal('success')
          res.body.data._createdAt.should.not.be.null;
          done();
        });
    });
    it('returns a 401 status for unauthorized requests', (done) => {
      chai.request(app)
        .post('/users')
        .end((err, res) => {
          res.should.have.status(401)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('You are unauthorized to make this request.')
          done();
        })
    });
    it('returns a 403 status for non-admin authenticated ids', (done) => {
      chai.request(app)
        .post('/users')
        .set('authorization', tokenForUser(u2))
        .end((err, res) => {
          res.should.have.status(403)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('You do not have sufficient permissions to execute this operation.')
          done();
        })
    });
  })

  //////////////////////////////////////////////////////////
  //  /users/:id
  //////////////////////////////////////////////////////////

  describe('GET /users/:id', () => {
    it('lists a SINGLE user', (done) => {
      const user = new User({
        email: 'test@test.com',
        password: 'password',
        name: 'Test'
      });
      user.save().then(() => {
        chai.request(app)
          .get(`/users/${user._id}`)
          .set('authorization', tokenForUser(user))
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
    it('returns a 401 status for unauthorized requests', (done) => {
      const user = new User({
        email: 'test@test.com',
        password: 'password',
        name: 'Test'
      });
      user.save().then(() => {
        chai.request(app)
          .get(`/users/${user._id}`)
          .end((err, res) => {
            res.should.have.status(401)
            res.should.be.json
            res.body.status.should.equal('error')
            res.body.message.should.be.equal('You are unauthorized to make this request.')
            done()
          });
      });
    });
    it('returns a 403 status for restricted ids', (done) => {
      const u1 = new User({
        email: 'testA@test.com',
        password: 'password1',
        name: 'Test A'
      });
      const u2 = new User({
        email: 'testB@test.com',
        password: 'password2',
        name: 'Test B'
      });
      u1.save(() => {
        u2.save(() => {
          chai.request(app)
            .get(`/users/${u1._id}`)
            .set('authorization', tokenForUser(u2))
            .end((err, res) => {
              res.should.have.status(403)
              res.should.be.json
              res.body.status.should.equal('error')
              res.body.message.should.be.equal('You do not have sufficient permissions to execute this operation.')
              done()
            });
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
      const user = new User({
        email: 'test@test.com',
        password: 'password',
        name: 'Test'
      });
      user.save().then(() => {
        chai.request(app)
          .get(`/users/${mongoose.Types.ObjectId()}`)
          .set('authorization', tokenForUser(user))
          .end((err, res) => {
            res.should.have.status(404)
            res.should.be.json
            res.body.status.should.equal('error')
            res.body.message.should.be.equal('The requested resource does not exist.')
            done()
          })
      })
    })
  })

  describe('PUT /users/:id', () => {
    let u1, u2;

    beforeEach((done) => {
      u1 = new User({
        email: 'testA@test.com',
        password: 'password',
        name: 'Test A'
      });
      u2 = new User({
        email: 'testB@test.com',
        password: 'password',
        name: 'Test B'
      });
      u1.save(() => {
        u2.save(() => {
          done()
        })
      })
    })

    it('updates a SINGLE user on /users/:id PUT', (done) => {
      const user = new User({
        email: 'test1@test.com',
        password: 'password',
        name: 'Test 1'
      });
      user.save().then(() => {
        chai.request(app)
          .put(`/users/${user._id}`)
          .send({ email: 'test2@test.com', name: 'Test 2' })
          .set('authorization', tokenForUser(user))
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
        password: 'password',
        name: 'Test 1'
      });
      user.save().then(() => {
        chai.request(app)
          .put(`/users/${user._id}`)
          .send({ name: 'Test 2' })
          .set('authorization', tokenForUser(user))
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
        password: 'password',
        name: 'Test 1'
      });
      user.save().then(() => {
        chai.request(app)
          .put(`/users/${user._id}`)
          .send({ _id: mongoose.Types.ObjectId() })
          .set('authorization', tokenForUser(user))
          .end((err, res) => {
            res.should.have.status(403)
            res.should.be.json
            res.body.status.should.equal('error')
            res.body.message.should.be.equal('This action is forbidden.')
            done()
          })
      })
    });
    it('does not modify the original admin value when false', (done) => {
      const user = new User({
        email: 'test1@test.com',
        password: 'password',
        name: 'Test 1',
        admin: false
      });
      user.save().then(() => {
        chai.request(app)
          .put(`/users/${user._id}`)
          .send({ admin: true })
          .set('authorization', tokenForUser(user))
          .end((err, res) => {
            res.should.have.status(403)
            res.should.be.json
            res.body.status.should.equal('error')
            res.body.message.should.be.equal('This action is forbidden.')
            done()
          })
      })
    });
    it('does not modify the original admin value when true', (done) => {
      const user = new User({
        email: 'test1@test.com',
        password: 'password',
        name: 'Test 1',
        admin: true
      });
      user.save().then(() => {
        chai.request(app)
          .put(`/users/${user._id}`)
          .send({ admin: false })
          .set('authorization', tokenForUser(user))
          .end((err, res) => {
            res.should.have.status(403)
            res.should.be.json
            res.body.status.should.equal('error')
            res.body.message.should.be.equal('This action is forbidden.')
            done()
          })
      })
    });
    it('returns a 404 status on invalid /users/:id PUT', (done) => {
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
    it('returns a 404 status on non-existent /users/:id PUT', (done) => {
      chai.request(app)
        .put(`/users/${mongoose.Types.ObjectId()}`)
        .set('authorization', tokenForUser(u1))
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('The requested resource does not exist.')
          done()
        })
    })
    it('returns a 400 status when an invalid email is provided', (done) => {
      const user = new User({
        email: 'test1@test.com',
        password: 'password',
        name: 'Test 1'
      });
      user.save().then(() => {
        chai.request(app)
          .put(`/users/${user._id}`)
          .send({ email: 'test2' })
          .set('authorization', tokenForUser(user))
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
    it('returns a 401 status for unauthorized requests', (done) => {
      const user = new User({
        email: 'test1@test.com',
        password: 'password',
        name: 'Test 1'
      });
      user.save().then(() => {
        chai.request(app)
          .put(`/users/${user._id}`)
          .send({ email: 'test2@test.com' })
          .end((err, res) => {
            res.should.have.status(401)
            res.should.be.json
            res.body.status.should.equal('error')
            res.body.message.should.be.equal('You are unauthorized to make this request.')
            done()
          });
      });
    });
  })

  describe('DELETE /users/:id', () => {
    let u1, u2;

    beforeEach((done) => {
      u1 = new User({
        email: 'testA@test.com',
        password: 'password',
        name: 'Test A'
      });
      u2 = new User({
        email: 'testB@test.com',
        password: 'password',
        name: 'Test B'
      });
      u1.save(() => {
        u2.save(() => {
          done()
        })
      })
    })

    it('deletes a SINGLE user', (done) => {
      const user1 = new User({
        email: 'test@test.com',
        password: 'password',
        name: 'Test'
      });
      user1.save().then(() => {
        chai.request(app)
          .delete(`/users/${user1._id}`)
          .set('authorization', tokenForUser(user1))
          .end((err, res) => {
            res.should.have.status(204)
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
    it('returns a 401 status for unauthorized requests', (done) => {
      const user1 = new User({
        email: 'test@test.com',
        password: 'password',
        name: 'Test'
      });
      user1.save().then(() => {
        chai.request(app)
          .delete(`/users/${user1._id}`)
          .end((err, res) => {
            res.should.have.status(401)
            res.should.be.json
            res.body.status.should.equal('error')
            res.body.message.should.be.equal('You are unauthorized to make this request.')
            done()
          })
      })
    });
    it('returns a 404 status for invalid ids', (done) => {
      chai.request(app)
        .delete('/users/invalid')
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
        .delete(`/users/${mongoose.Types.ObjectId()}`)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('The requested resource does not exist.')
          done()
        })
    });
  })

  //////////////////////////////////////////////////////////
  //  /users/:id/admin
  //////////////////////////////////////////////////////////

  describe('POST /users/:id/admin', () => {
    let userAdmin, userNonAdmin;

    beforeEach((done) => {
      userAdmin = new User({
        email: 'testA@test.com',
        password: 'password',
        name: 'Test A',
        admin: true
      });
      userNonAdmin = new User({
        email: 'testB@test.com',
        password: 'password',
        name: 'Test B',
        admin: false
      });
      userAdmin.save(() => {
        userNonAdmin.save(() => {
          done();
        })
      })
    })

    it('successful with admin authentication', (done) => {
      userNonAdmin.admin.should.be.false
      chai.request(app)
        .post(`/users/${userNonAdmin._id}/admin`)
        .set('authorization', tokenForUser(userAdmin))
        .end((err, res) => {
          res.should.have.status(204)
          Object.keys(res.body).length.should.equal(0)
          res.body.constructor.should.equal(Object)
          User.findById(userNonAdmin._id)
            .then((user) => {
              user.admin.should.be.true
              done()
            })
            .catch((err) => console.log(err))
        })
    })
    it('returns a 401 status for unauthorized requests', (done) => {
      chai.request(app)
        .post(`/users/${userNonAdmin._id}/admin`)
        .end((err, res) => {
          res.should.have.status(401)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('You are unauthorized to make this request.')
          done();
        })
    }),
    it('returns a 403 status for non-admin authenticated ids', (done) => {
      chai.request(app)
        .post(`/users/${userNonAdmin._id}/admin`)
        .set('authorization', tokenForUser(userNonAdmin))
        .end((err, res) => {
          res.should.have.status(403)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('You do not have sufficient permissions to execute this operation.')
          done();
        })
    }),
    it('returns a 404 status for invalid ids', (done) => {
      chai.request(app)
        .post(`/users/invalid/admin`)
        .set('authorization', tokenForUser(userNonAdmin))
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('The requested resource does not exist.')
          done();
        })
    })
    it('returns a 404 status for non-existent ids', (done) => {
      chai.request(app)
        .post(`/users/${mongoose.Types.ObjectId()}/admin`)
        .set('authorization', tokenForUser(userNonAdmin))
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('The requested resource does not exist.')
          done();
        })
    })
  })

  describe('DELETE /users/:id/admin', () => {

    let userAdmin, userNonAdmin;

    beforeEach((done) => {
      userAdmin = new User({
        email: 'testA@test.com',
        password: 'password',
        name: 'Test A',
        admin: true
      });
      userNonAdmin = new User({
        email: 'testB@test.com',
        password: 'password',
        name: 'Test B',
        admin: false
      });
      userAdmin.save(() => {
        userNonAdmin.save(() => {
          done();
        })
      })
    })

    it('successful with admin authentication', (done) => {
      userNonAdmin.admin.should.be.false
      chai.request(app)
        .delete(`/users/${userAdmin._id}/admin`)
        .set('authorization', tokenForUser(userAdmin))
        .end((err, res) => {
          res.should.have.status(204)
          Object.keys(res.body).length.should.equal(0)
          res.body.constructor.should.equal(Object)
          User.findById(userNonAdmin._id)
            .then((user) => {
              user.admin.should.be.false
              done()
            })
            .catch((err) => console.log(err))
        })
    })
    it('returns a 401 status for unauthorized requests', (done) => {
      chai.request(app)
        .delete(`/users/${userAdmin._id}/admin`)
        .end((err, res) => {
          res.should.have.status(401)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('You are unauthorized to make this request.')
          done();
        })
    }),
    it('returns a 403 status for non-admin authenticated ids', (done) => {
      chai.request(app)
        .delete(`/users/${userAdmin._id}/admin`)
        .set('authorization', tokenForUser(userNonAdmin))
        .end((err, res) => {
          res.should.have.status(403)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('You do not have sufficient permissions to execute this operation.')
          done();
        })
    }),
    it('returns a 404 status for invalid ids', (done) => {
      chai.request(app)
        .delete(`/users/invalid/admin`)
        .set('authorization', tokenForUser(userNonAdmin))
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('The requested resource does not exist.')
          done();
        })
    })
    it('returns a 404 status for non-existent ids', (done) => {
      chai.request(app)
        .post(`/users/${mongoose.Types.ObjectId()}/admin`)
        .set('authorization', tokenForUser(userNonAdmin))
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('The requested resource does not exist.')
          done();
        })
    })
  })

});
