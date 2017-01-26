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

  describe('GET /projects/:id/stories', () => {
    it('lists ALL stories', (done) => {
      const p1 = new Project({
        name: 'Test Project',
        slug: 'test-project',
        roles: [{ name: 'Tester' }],
        stories: [{
          desire: 'find errors',
          benefit: 'they can be fixed'
        }]
      });
      p1.save().then(() => {
        chai.request(app)
          .get(`/projects/${p1._id}/stories`)
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
        stories: []
      });
      p1.save().then(() => {
        chai.request(app)
          .get(`/projects/${p1._id}/stories`)
          .end((err, res) => {
            p1.stories.length.should.be.equal(0)
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

  describe('POST /projects/:id/stories', () => {
    let p1;

    beforeEach((done) => {
      p1 = new Project({
        name: 'Test Project',
        slug: 'test-project',
        stories: []
      });
      p1.save().then(() => {
        done()
      })
    })

    it('creates a new story', (done) => {
      const count = p1.stories.length;
      chai.request(app)
        .post(`/projects/${p1._id}/stories`)
        .send({ desire: 'find errors', benefit: 'they can be fixed' })
        .end((err, res) => {
          Project.findById(p1.id).then((project) => {
            const newCount = project.stories.length
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
        .post(`/projects/${p1._id}/stories`)
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
        .post(`/projects/${p1._id}/stories`)
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
        .post(`/projects/${p1._id}/stories`)
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

  describe('PUT /projects/:id/stories/:id', () => {
    let p1;
    let projectId;
    let storyId;

    beforeEach((done) => {
      p1 = new Project({
        name: 'Test Project',
        slug: 'test-project',
        stories: [{
          desire: 'find errors',
          benefit: 'they can be fixed'
        }]
      });
      p1.save().then(() => {
        projectId = p1._id;
        storyId = p1.stories[0]._id;
        done()
      })
    })

    it('updates a SINGLE story', (done) => {
      chai.request(app)
        .put(`/projects/${projectId}/stories/${storyId}`)
        .send({ desire: 'find all the errors' })
        .end((err, res) => {
          // console.log(err)
          res.should.have.status(204)
          res.headers.should.have.property('location')
          res.headers.location.startsWith('https://api.mycodebytes.com/v1/projects/');
          Object.keys(res.body).length.should.equal(0)
          res.body.constructor.should.equal(Object)
          Project.findById(projectId)
            .then((project) => {
              project.stories[0].desire.should.equal('find all the errors')
              done()
            })
        })
    });
    it('only updates provided fields', (done) => {
      chai.request(app)
        .put(`/projects/${projectId}/stories/${storyId}`)
        .send({ desire: 'find all the errors' })
        .end((err, res) => {
          res.should.have.status(204)
          res.headers.should.have.property('location')
          res.headers.location.startsWith('https://api.mycodebytes.com/v1/projects/');
          Object.keys(res.body).length.should.equal(0)
          res.body.constructor.should.equal(Object)
          Project.findById(projectId)
            .then((project) => {
              project.stories[0].desire.should.equal('find all the errors')
              project.stories[0].benefit.should.equal('they can be fixed')
              done()
            })
        })
    });
    it('does not modify the original id', (done) => {
      chai.request(app)
        .put(`/projects/${projectId}/stories/${storyId}`)
        .send({ _id: mongoose.Types.ObjectId() })
        .end((err, res) => {
          res.should.have.status(403)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('This action is forbidden.')
          done()
        })
    });
    it('returns an error for invalid ids', (done) => {
      chai.request(app)
        .put(`/projects/${projectId}/stories/invalid`)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('The requested resource does not exist.')
          done()
        })
    });
    it('returns an error for non-existent ids', (done) => {
      chai.request(app)
        .put(`/projects/${projectId}/stories/${mongoose.Types.ObjectId()}`)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('The requested resource does not exist.')
          done()
        })
    });
  })

  describe('DELETE /projects/:id/stories/:id', () => {
    let p1;
    let projectId;
    let storyId;

    beforeEach((done) => {
      p1 = new Project({
        name: 'Test Project',
        slug: 'test-project',
        stories: [{
          desire: 'find errors',
          benefit: 'they can be fixed'
        }]
      });
      p1.save().then(() => {
        projectId = p1._id;
        storyId = p1.stories[0]._id;
        done()
      })
    })

    it('deletes a SINGLE story', (done) => {
      chai.request(app)
        .delete(`/projects/${projectId}/stories/${storyId}`)
        .end((err, res) => {
          res.should.have.status(204)
          Object.keys(res.body).length.should.equal(0)
          res.body.constructor.should.equal(Object)
          Project.findById(projectId)
            .then((p2) => {
              p2.stories.length.should.equal(0)
              done()
            })
        })
    });
    it('returns an error for invalid ids', (done) => {
      chai.request(app)
        .delete(`/projects/${projectId}/stories/invalid`)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('The requested resource does not exist.')
          done()
        })
    });
    it('returns an error for non-existent ids', (done) => {
      chai.request(app)
        .delete(`/projects/${projectId}/stories/${mongoose.Types.ObjectId()}`)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('The requested resource does not exist.')
          done()
        })
    });
  })

});
