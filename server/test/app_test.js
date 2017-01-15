const assert = require('assert');
const request = require('supertest');
const app = require('../app');

describe('Express app', () => {
  it('handles a GET request to /', (done) => {
    request(app)
      .get('/')
      .end((err, response) => {
        assert(response.body.message === 'Connected!');
        done();
      });
  });
});
