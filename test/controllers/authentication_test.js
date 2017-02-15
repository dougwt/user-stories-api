const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../../app');
const User = mongoose.model('user');

chai.use(chaiHttp)

describe('Authentication API', () => {

  //////////////////////////////////////////////////////////
  //  /signin
  //////////////////////////////////////////////////////////

  describe('POST /signin', () => {
    let user;

    beforeEach((done) => {
      user = new User({
        email: 'test@example.com',
        password: 'pa55w0rd',
        name: 'Test User',
      });
      user.save(() => done())
    })

    it('returns an auth token when provided valid credentials', (done) => {
      chai.request(app)
        .post('/signin')
        .send({ email: 'test@example.com', password: 'pa55w0rd' })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.status.should.equal('success');
          res.body.should.have.property('token');
          const token = res.body.token;
          chai.request(app)
            .get('/auth_test')
            .set('authorization', token)
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.success.should.equal(true);
              done();
            });
        });
    });
    it('returns a 401 status when provided invalid credentials', (done) => {
      chai.request(app)
        .post('/signin')
        .send({ email: 'test@example.com', password: 'WrongPassword' })
        .end((err, res) => {
          res.should.have.status(401);
          res.should.be.json;
          res.body.status.should.equal('error');
          res.body.message.should.be.equal('You are unauthorized to make this request.');
          done();
        });
    });
    it('returns an error when an email is not provided', (done) => {
      chai.request(app)
        .post('/signin')
        .send({ password: 'WrongPassword' })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.status.should.equal('error');
          res.body.message.should.be.equal('Email is required.');
          done();
        });
    });
    it('returns an error when a password is not provided', (done) => {
      chai.request(app)
        .post('/signin')
        .send({ email: 'test@example.com' })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.status.should.equal('error');
          res.body.message.should.be.equal('Password is required.');
          done();
        });
    });
  });

  //////////////////////////////////////////////////////////
  //  /signup
  //////////////////////////////////////////////////////////

  describe('POST /signup', () => {
    xit('returns an auth token when provided valid data', (done) => {

    });
    xit('creates a new user', (done) => {

    });
    xit('returns an error when an email is not provided ', (done) => {

    });
    xit('returns an error when a password is not provided ', (done) => {

    });
    xit('returns an error when a name is not provided ', (done) => {

    });
    xit('returns an error when a duplicate email is provided', (done) => {

    });
  });

});
