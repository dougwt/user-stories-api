const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../../app');
const Project = mongoose.model('project');

chai.use(chaiHttp)

describe('Roles API', () => {

  //////////////////////////////////////////////////////////
  //  /projects/:id/roles
  //////////////////////////////////////////////////////////

  describe('GET /projects/:id/roles', () => {
    it('lists ALL roles', (done) => {
      const project = new Project({
        name: 'Test Project',
        slug: 'test-project',
        roles: [{ name: 'Test' }]
      });
      project.save().then(() => {
        chai.request(app)
          .get(`/projects/${project._id}/roles`)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.status.should.equal('success')
            res.body.data.should.be.a('array');
            res.body.data.length.should.be.gte(1);
            res.body.data[0].should.have.property('name');
            res.body.data[0].name.should.equal('Test')
            res.body.data[0].should.have.property('_createdAt');
            done();
          })
      });
    });
    it('returns an empty list when the collection is empty', (done) => {
      const project = new Project({
        name: 'Test Project',
        slug: 'test-project',
        roles: []
      });
      project.save().then(() => {
        chai.request(app)
          .get(`/projects/${project._id}/roles`)
          .end((err, res) => {
            project.roles.length.should.be.equal(0)
            res.should.have.status(200);
            res.should.be.json;
            res.body.status.should.equal('success')
            res.body.data.should.be.a('array');
            res.body.data.length.should.equal(0);
            done();
          });
      });
    });
  })

  describe('POST /projects/:id/roles', () => {
    xit('creates a new role', (done) => {

    });
    xit('returns an error when a name is not provided', (done) => {

    });
    xit('automatically assigns a creation_date', (done) => {

    });
  })

  //////////////////////////////////////////////////////////
  //  /projects/:id/roles/:id
  //////////////////////////////////////////////////////////

  describe('PUT /projects/:id/roles/:id', () => {
    xit('updates a SINGLE role', (done) => {

    });
    xit('only updates provided fields', (done) => {

    });
    xit('does not modify the original id', (done) => {

    });
    xit('returns an error for invalid ids', (done) => {

    });
    xit('returns an error for non-existent ids', (done) => {

    });
  })

  describe('DELETE /projects/:id/roles/:id', () => {
    xit('deletes a SINGLE role', (done) => {

    });
    xit('returns an error for invalid ids', (done) => {

    });
    xit('returns an error for non-existent ids', (done) => {

    });
  })

});
