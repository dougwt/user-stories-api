const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const Project = mongoose.model('project');
let expect = chai.expect;

chai.use(chaiHttp)

describe('Project model', () => {
  it('fails validation if name is empty', (done) => {
    var p = new Project({ slug: 'test' });

    p.validate((err) => {
      err.errors.name.should.exist;
      done();
    });
  });
  it('fails validation if slug is empty', (done) => {
    var p = new Project({ name: 'Test' });

    p.validate((err) => {
      err.errors.slug.should.exist;
      done();
    });
  });
  it('passes validation if name and unique slug', (done) => {
    var p = new Project({ name: 'Test', slug:'test' });

    p.validate((err) => {
      expect(err).to.not.exist;
      done();
    });
  });
  it('fails validation if slug is duplicate', (done) => {
    var p1 = new Project({ name: 'Test 1', slug:'test' });
    p1.save().then(() => {
      var p2 = new Project({ name: 'Test 2', slug:'test' });
      p2.validate((err) => {
        err.errors.slug.should.exist;
        done();
      });
    });
  });
  xit('fails validation if slug is formatted incorrectly', (done) => {

  });
});
