const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../../app');
const Project = mongoose.model('project');

chai.use(chaiHttp)

describe('Stories API', () => {

  //////////////////////////////////////////////////////////
  //  /projects/:id/stories
  //////////////////////////////////////////////////////////

  describe('GET /projects/:id/roles/:id/stories', () => {
    it('lists ALL stories', (done) => {
      const p1 = new Project({
        name: 'Test Project',
        slug: 'test-project',
        roles: [{
          name: 'Tester',
          stories: [{
            desire: 'find errors',
            benefit: 'they can be fixed'
          }]
        }]
      });
      p1.save().then(() => {
        chai.request(app)
          .get(`/projects/${p1._id}/roles/${p1.roles[0]._id}/stories`)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.status.should.equal('success')
            res.body.data.should.be.a('array');
            res.body.data.length.should.be.gte(1);
            res.body.data[0].should.have.property('benefit');
            res.body.data[0].desire.should.equal('find errors')
            res.body.data[0].should.have.property('desire');
            res.body.data[0].benefit.should.equal('they can be fixed')
            res.body.data[0].should.have.property('_createdAt');
            done();
          })
      });
    });
    it('returns an empty list when the collection is empty', (done) => {
      const p1 = new Project({
        name: 'Test Project',
        slug: 'test-project',
        roles: [{
          name: 'Tester',
          stories: []
        }]
      });
      p1.save().then(() => {
        chai.request(app)
          .get(`/projects/${p1._id}/roles/${p1.roles[0]._id}/stories`)
          .end((err, res) => {
            p1.roles[0].stories.length.should.be.equal(0)
            res.should.have.status(200);
            res.should.be.json;
            res.body.status.should.equal('success')
            res.body.data.should.be.a('array');
            res.body.data.length.should.equal(0);
            done();
          })
      });
    });
  })

  describe('POST /projects/:id/roles/:id/stories', () => {
    let p1;

    beforeEach((done) => {
      p1 = new Project({
        name: 'Test Project',
        slug: 'test-project',
        roles: [{
          name: 'Tester',
          stories: []
        }]
      });
      p1.save().then(() => {
        done()
      })
    })

    it('creates a new story', (done) => {
      const count = p1.roles[0].stories.length;
      chai.request(app)
        .post(`/projects/${p1._id}/roles/${p1.roles[0]._id}/stories`)
        .send({ desire: 'find errors', benefit: 'they can be fixed' })
        .end((err, res) => {
          Project.findById(p1.id).then(project => {
            const newCount = project.roles[0].stories.length
            res.should.have.status(201);
            res.should.be.json;
            res.headers.should.have.property('location');
            res.headers.location.startsWith(`https://api.mycodebytes.com/v1/projects/${project._id}/roles`);
            res.body.status.should.equal('success');
            newCount.should.equal(count + 1);
            done();
          });
        });
    });
    it('returns an error when a desire is not provided', (done) => {
      chai.request(app)
        .post(`/projects/${p1._id}/roles/${p1.roles[0]._id}/stories`)
        .send({ benefit: 'they can be fixed' })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.status.should.equal('error');
          res.body.message.should.be.equal('Desire is required.');
          done();
        });
    });
    it('returns an error when a benefit is not provided', (done) => {
      chai.request(app)
        .post(`/projects/${p1._id}/roles/${p1.roles[0]._id}/stories`)
        .send({ desire: 'find errors' })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.status.should.equal('error');
          res.body.message.should.be.equal('Benefit is required.');
          done();
        });
    });
    it('automatically assigns a creation_date', (done) => {
      chai.request(app)
        .post(`/projects/${p1._id}/roles/${p1.roles[0]._id}/stories`)
        .send({ desire: 'find errors', benefit: 'they can be fixed' })
        .end((err, res) => {
          res.should.be.json;
          res.body.status.should.equal('success')
          res.body.data[0]._createdAt.should.not.be.null;
          done();
        });
    });
  })

  //////////////////////////////////////////////////////////
  //  /projects/:id/stories/:id
  //////////////////////////////////////////////////////////

  describe('GET /projects/:id/roles/:id/stories/:id', () => {
    xit('lists a SINGLE story', (done) => {

    })
    xit('returns a 404 status for invalid ids', (done) => {

    });
    xit('returns a 404 status for non-existent ids', (done) => {

    });
  })

  describe('PUT /projects/:id/roles/:id/stories/:id', () => {
    xit('updates a SINGLE story', (done) => {

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

  describe('DELETE /projects/:id/roles/:id/stories/:id', () => {
    xit('deletes a SINGLE story', (done) => {

    });
    xit('returns an error for invalid ids', (done) => {

    });
    xit('returns an error for non-existent ids', (done) => {

    });
  })

});
