const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const Project = mongoose.model('project');
let expect = chai.expect;

chai.use(chaiHttp)

describe('Role schema', () => {
  it('fails validation if name is empty', (done) => {
    var p = new Project({
      name: 'Test',
      slug:'test',
      roles: [{ stories: [] }]
    });

    p.validate((err) => {
      err.errors['roles.0.name'].name.should.exist;
      done();
    });
  });
  it('passes validation if unique name', (done) => {
    var p = new Project({
      name: 'Test',
      slug:'test',
      roles: [{ name: 'test', stories: [] }]
    });

    p.validate((err) => {
      expect(err).to.not.exist;
      done();
    });
  });
});
