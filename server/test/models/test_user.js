let chai = require('chai')
let should = chai.should()

var User = require('../../models/user');

describe('Model: User', function() {
  beforeEach((done) => {
      User.remove({}, (err) => {
         done()
      })
  })

  it('should be invalid if email is empty', function(done) {
    var u = new User();

    u.validate(function(err) {
        err.errors.email.should.exist;
        done();
    });
  });
  // it('should be valid if email not empty', function(done) {
  //   var u = new User({ email: 'test@example.com' });
  //
  //   u.validate(function(err) {
  //       err.errors.email.should.not.exist;
  //       done();
  //   });
  // });
});
