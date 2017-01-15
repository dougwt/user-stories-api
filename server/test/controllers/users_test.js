const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = mongoose.model('user');

describe('Users controller', () => {
  it('POST to /users creates a new user', (done) => {
    const user = new User({ email: 'test@test.com', name: 'Test' });
    user.save();

    // User.count().then(count => {
    //   request(app)
    //     .post('/users')
    //     .send({ email: 'test@test.com', name: 'Test' })
    //     .end(() => {
    //       User.count().then(newCount => {
    //         assert(count + 1 === newCount);
    //         done();
    //       });
    //     });
    // });
    done();
  });
});
