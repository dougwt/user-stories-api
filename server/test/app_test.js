const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const app = require('../app');

describe('Express app', () => {
  it('handles a GET request to /', (done) => {
    chai.request(app)
      .get('/')
      .end((err, response) => {
        response.body.message.should.equal('Connected!');
        done();
      });
  });
});
