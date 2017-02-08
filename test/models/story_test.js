const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const Project = mongoose.model('project');
let expect = chai.expect;

chai.use(chaiHttp)

describe('Story schema', () => {
  it('fails validation if desire is empty', (done) => {
    var p = new Project({
      name: 'Test',
      slug:'test',
      stories: [{ benefit: 'test' }]
    });

    p.validate((err) => {
      err.errors['stories.0.desire'].should.exist;
      done();
    });
  });
  it('fails validation if benefit is empty', (done) => {
    var p = new Project({
      name: 'Test',
      slug:'test',
      stories: [{ desire: 'test' }]
    });

    p.validate((err) => {
      err.errors['stories.0.benefit'].should.exist;
      done();
    });
  });
  it('passes validation if desire and benefit', (done) => {
    var p = new Project({
      name: 'Test',
      slug:'test',
      stories: [{ desire: 'test', benefit: 'test' }]
    });

    p.validate((err) => {
      expect(err).to.not.exist;
      done();
    });
  });
});
