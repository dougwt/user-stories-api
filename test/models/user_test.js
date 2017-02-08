const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const User = mongoose.model('user');
let expect = chai.expect;

chai.use(chaiHttp)

describe('User model', () => {
  it('fails validation if email is empty', (done) => {
    var u = new User({ name: 'Test' });

    u.validate((err) => {
      err.errors.email.should.exist;
      done();
    });
  });
  it('fails validation if name is empty', (done) => {
    var u = new User({ email: 'test@test.com' });

    u.validate((err) => {
      err.errors.name.should.exist;
      done();
    });
  });
  it('passes validation if name and unique email', (done) => {
    var u = new User({ email: 'test@example.com', name: 'Test' });

    u.validate((err) => {
      expect(err).to.not.exist;
      done();
    });
  });
  it('fails validation if email is duplicate', (done) => {
    var u1 = new User({ email: 'test@test.com', name: 'Test 1' });
    u1.save().then(() => {
      var u2 = new User({ email: 'test@test.com', name: 'Test 2' });
      u2.validate((err) => {
        err.errors.email.should.exist;
        done();
      });
    });
  });
  it('fails validation if email is formatted incorrectly', (done) => {
    var u = new User({ email: 'test', name: 'Test' });

    u.validate((err) => {
      err.errors.email.should.exist;
      done();
    });
  });
});
