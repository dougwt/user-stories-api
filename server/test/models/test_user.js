let chai = require('chai')
let should = chai.should()
let expect = chai.expect

var User = require('../../models/user');

// Configure Mongoose
var Mongoose = require('mongoose').Mongoose
var mongoose = new Mongoose();
mongoose.connect('mongodb://localhost:auth/auth')

// Load fixtures
var fixtures = require('node-mongoose-fixtures');
let data = {
  user: [
    {
      email: "doug@example.com",
      name: "Doug",
      creation_date: "1982-07-07T07:00:00.000Z"
    },
    {
      email: "ada@example.com",
      name: "Ada Lovelace",
      creation_date: "1815-12-10T08:00:00.000Z"
    },
    {
      email: "grace@example.com",
      name: "Grace Hopper",
      creation_date: "1906-12-09T08:00:00.000Z"
    },
    {
      email: "margaret@example.com",
      name: "Margaret Hamilton",
      creation_date: "1936-08-17T07:00:00.000Z"
    }
  ]
}
// fixtures(__dirname + '/../../fixtures.js');
fixtures(data, mongoose)

describe('Model: User', function() {
  // beforeEach((done) => {
  //     User.remove({}, (err) => {
  //        done()
  //     })
  // })
  it('should be invalid if email is empty', function(done) {
    var u = new User();

    u.validate(function(err) {
        err.errors.email.should.exist;
        done();
    });
  });
  it('should be invalid if email is duplicate', function(done) {
    var u = new User({ email: 'doug@example.com' });

    u.validate(function(err) {
        err.errors.email.should.exist;
        done();
    });
  });
  it('should be valid if unique email', function(done) {
    var u = new User({ email: 'test@example.com' });

    u.validate(function(err) {
        expect(err).to.not.exist;
        done();
    });
  });
});
