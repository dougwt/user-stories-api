const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../../app');
const Project = mongoose.model('project');

chai.use(chaiHttp)

describe.only('Projects API', () => {

  //////////////////////////////////////////////////////////
  //  /projects
  //////////////////////////////////////////////////////////

  describe('GET /projects', () => {
    it('lists ALL projects', (done) => {
      const project = new Project({
        name: 'Test',
        slug: 'test'
      });
      project.save().then(() => {
        chai.request(app)
          .get('/projects')
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.status.should.equal('success')
            res.body.data.should.be.a('array');
            res.body.data.length.should.be.gte(1);
            res.body.data[0].should.have.property('name');
            res.body.data[0].should.have.property('slug');
            res.body.data[0].should.have.property('_createdAt');
            done();
          })
      });
    });
    it('returns an empty list when the collection is empty', (done) => {
      Project.find({}).then((projects) => {
        chai.request(app)
          .get('/projects')
          .end((err, res) => {
            projects.length.should.be.equal(0)
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

  describe('POST /projects', () => {
    it('creates a new project', (done) => {
      Project.count().then(count => {
        chai.request(app)
          .post('/projects')
          .send({ name: 'Test', slug: 'test' })
          .end((err, res) => {
            Project.count().then(newCount => {
              res.should.have.status(201);
              res.should.be.json;
              res.headers.should.have.property('location');
              res.headers.location.startsWith('https://api.mycodebytes.com/v1/projects/');
              res.body.status.should.equal('success');
              newCount.should.equal(count + 1);
              done();
            });
          });
      });
    });
    it('returns an error when a name is not provided', (done) => {
      chai.request(app)
        .post('/projects')
        .send({ slug: 'test' })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.status.should.equal('error');
          res.body.message.should.be.equal('Name is required.');
          done();
        });
    });
    it('returns an error when a slug is not provided', (done) => {
      chai.request(app)
        .post('/projects')
        .send({ name: 'Test' })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.status.should.equal('error');
          res.body.message.should.be.equal('Slug is required.');
          done();
        });
    });
    it('returns an error when an invalid slug is provided (punctuation)', (done) => {
      chai.request(app)
        .post('/projects')
        .send({ name: 'Test', slug: 'test!' })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.status.should.equal('error');
          res.body.message.should.be.equal('Slug is invalid.');
          done();
        });
    });
    it('returns an error when an invalid slug is provided (trailing-slash)', (done) => {
      chai.request(app)
        .post('/projects')
        .send({ name: 'Test', slug: 'test-' })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.status.should.equal('error');
          res.body.message.should.be.equal('Slug is invalid.');
          done();
        });
    });
    it('returns an error when a duplicate slug is provided', (done) => {
      const project = new Project({
        name: 'Test 1',
        slug: 'test'
      });
      project.save().then(() => {
        chai.request(app)
          .post('/projects')
          .send({ name: 'Test 2', slug: 'test' })
          .end((err, res) => {
            res.should.have.status(409);
            res.should.be.json;
            res.body.status.should.equal('error')
            res.body.message.should.be.equal('Slug is in use.');
            done();
          });
      });
    });
    it('converts a slug to lowercase', (done) => {
      chai.request(app)
        .post('/projects')
        .send({ name: 'TEST', slug: 'TEST' })
        .end((err, res) => {
          res.should.be.json;
          res.body.status.should.equal('success')
          res.body.data.slug.should.be.equal('test');
          done();
        });
    });
    it('automatically assigns a creation date', (done) => {
      chai.request(app)
        .post('/projects')
        .send({ name: 'Test', slug: 'test' })
        .end((err, res) => {
          res.should.be.json;
          res.body.status.should.equal('success')
          res.body.data._createdAt.should.not.be.null;
          done();
        });
    });
  })

  //////////////////////////////////////////////////////////
  //  /projects/:id
  //////////////////////////////////////////////////////////

  describe('GET /projects/:id', (done) => {
    xit('lists a SINGLE project', (done) => {

    })
    xit('returns a 404 status for invalid ids', (done) => {

    })
    xit('returns a 404 status for non-existent ids', (done) => {

    })
  })

  describe('PUT /projects/:id', (done) => {
    xit('updates a SINGLE project', (done) => {

    });
    xit('only updates provided fields', (done) => {

    })
    xit('does not modify the original id', (done) => {

    })
    xit('returns error status for invalid ids', (done) => {

    })
    xit('returns error status for non-existent ids', (done) => {

    })
    xit('returns an error when an invalid slug is provided', (done) => {

    })
  })

  describe('DELETE /projects/:id', (done) => {
    xit('deletes a SINGLE project', (done) => {

    });
    xit('returns a 404 status for invalid ids', (done) => {

    });
    xit('returns a 404 status for non-existent ids', (done) => {

    });
  })

});
