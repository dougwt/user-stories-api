const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');

describe('Express app', () => {
  it('handles a GET request to /', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200)
        res.should.be.json
        res.body.status.should.equal('success')
        res.body.data.should.equal('Connected!');
        done();
      });
  });
  it('returns an error for invalid routes', (done) => {
    chai.request(app)
      .get('/something/completely/random')
      .end((err, res) => {
        res.should.have.status(404)
        res.should.be.json
        res.body.status.should.equal('error')
        res.body.message.should.be.equal('The requested resource does not exist.')
        done();
      });
  });
});
