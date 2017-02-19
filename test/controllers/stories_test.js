const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../../app');
const User = mongoose.model('user');
const Project = mongoose.model('project');
import { tokenForUser } from '../../app/controllers/authentication'

chai.use(chaiHttp)

describe('Stories API', () => {

  let user;

  beforeEach((done) => {
    user = new User({
      email: 'test@test.com',
      password: 'password',
      name: 'Test'
    });
    user.save(() => { done(); })
  })

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
        }],
        owner: user
      });
      p1.save().then(() => {
        chai.request(app)
          .get(`/projects/${p1._id}/stories`)
          .set('authorization', tokenForUser(user))
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
    it('returns a 401 status for unauthorized requests', (done) => {
      const p1 = new Project({
        name: 'Test Project',
        slug: 'test-project',
        roles: [{ name: 'Tester' }],
        stories: [{
          desire: 'find errors',
          benefit: 'they can be fixed'
        }],
        owner: user
      });
      p1.save().then(() => {
        chai.request(app)
          .get(`/projects/${p1._id}/stories`)
          .end((err, res) => {
            res.should.have.status(401)
            res.should.be.json
            res.body.status.should.equal('error')
            res.body.message.should.be.equal('You are unauthorized to make this request.')
            done();
          })
      });
    });
    it('returns a 403 status for restricted ids', (done) => {
      const u2 = new User({
        email: 'test2@test.com',
        password: 'password',
        name: 'Test 2'
      });
      const p1 = new Project({
        name: 'Test Project',
        slug: 'test-project',
        roles: [{ name: 'Test' }],
        owner: user
      });
      u2.save(() => {
        p1.save(() => {
          chai.request(app)
          .get(`/projects/${p1._id}/stories`)
          .set('authorization', tokenForUser(u2))
          .end((err, res) => {
            res.should.have.status(403)
            res.should.be.json
            res.body.status.should.equal('error')
            res.body.message.should.be.equal('You do not have sufficient permissions to execute this operation.')
            done();
          })
        });
      });
    });
    it('lists ALL stories sorted by descending creation dates', (done) => {
      const p1 = new Project({
        name: 'Test Project',
        slug: 'test-project',
        roles: [{ name: 'Tester' }],
        stories: [{
          desire: 'find errors',
          benefit: 'they can be fixed'
        }],
        owner: user
      });
      const s2 = { desire: 'story 2 desire', benefit: 'story 2 benefit' };
      const s3 = { desire: 'story 3 desire', benefit: 'story 3 benefit' };
      p1.save().then(() => {
        p1.stories.push(s2);
        p1.save().then(() => {
          p1.stories.push(s3);
          p1.save().then(() => {
            chai.request(app)
              .get(`/projects/${p1._id}/stories`)
              .set('authorization', tokenForUser(user))
              .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.status.should.equal('success')
                res.body.data.should.be.a('array');
                res.body.data.length.should.equal(3);
                res.body.data[0].should.have.property('desire');
                res.body.data[0].should.have.property('benefit');
                res.body.data[0].should.have.property('_createdAt');
                res.body.data[0].desire.should.equal('story 3 desire');
                res.body.data[1].desire.should.equal('story 2 desire');
                res.body.data[2].desire.should.equal('find errors');
                done();
              })
          })
        })
      })
    });
    it('returns an empty list when the collection is empty', (done) => {
      const p1 = new Project({
        name: 'Test Project',
        slug: 'test-project',
        stories: [],
        owner: user
      });
      p1.save().then(() => {
        chai.request(app)
          .get(`/projects/${p1._id}/stories`)
          .set('authorization', tokenForUser(user))
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
    it('supports use of only the skip param', (done) => {
      const p1 = new Project({
        name: 'Test Project',
        slug: 'test-project',
        roles: [{ name: 'Tester' }],
        stories: [{
          desire: 'find errors',
          benefit: 'they can be fixed'
        }],
        owner: user
      });
      const s2 = { desire: 'story 2 desire', benefit: 'story 2 benefit' };
      const s3 = { desire: 'story 3 desire', benefit: 'story 3 benefit' };
      const s4 = { desire: 'story 4 desire', benefit: 'story 4 benefit' };
      const { users } = mongoose.connection.collections;
      p1.save(() => {
        p1.stories.push(s2);
        p1.save(() => {
          p1.stories.push(s3);
          p1.save(() => {
            p1.stories.push(s4);
            p1.save(() => {
              chai.request(app)
                .get(`/projects/${p1._id}/stories?skip=2`)
                .set('authorization', tokenForUser(user))
                .end((err, res) => {
                  res.should.have.status(200);
                  res.should.be.json;
                  res.body.status.should.equal('success')
                  res.body.data.should.be.a('array');
                  res.body.data.length.should.be.equal(2);
                  res.body.data[0].desire.should.equal('story 2 desire');
                  res.body.data[1].desire.should.equal('find errors');
                  done();
                })
            })
          })
        })
      })
    });
    it('supports use of only the limit param', (done) => {
      const p1 = new Project({
        name: 'Test Project',
        slug: 'test-project',
        roles: [{ name: 'Tester' }],
        stories: [{
          desire: 'find errors',
          benefit: 'they can be fixed'
        }],
        owner: user
      });
      const s2 = { desire: 'story 2 desire', benefit: 'story 2 benefit' };
      const s3 = { desire: 'story 3 desire', benefit: 'story 3 benefit' };
      const s4 = { desire: 'story 4 desire', benefit: 'story 4 benefit' };
      const { users } = mongoose.connection.collections;
      p1.save(() => {
        p1.stories.push(s2);
        p1.save(() => {
          p1.stories.push(s3);
          p1.save(() => {
            p1.stories.push(s4);
            p1.save(() => {
              chai.request(app)
                .get(`/projects/${p1._id}/stories?limit=3`)
                .set('authorization', tokenForUser(user))
                .end((err, res) => {
                  res.should.have.status(200);
                  res.should.be.json;
                  res.body.status.should.equal('success')
                  res.body.data.should.be.a('array');
                  res.body.data.length.should.be.equal(3);
                  res.body.data[0].desire.should.equal('story 4 desire');
                  res.body.data[1].desire.should.equal('story 3 desire');
                  res.body.data[2].desire.should.equal('story 2 desire');
                  done();
                })
            })
          })
        })
      })
    });
    it('supports use of both the skip and limit params', (done) => {
      const p1 = new Project({
        name: 'Test Project',
        slug: 'test-project',
        roles: [{ name: 'Tester' }],
        stories: [{
          desire: 'find errors',
          benefit: 'they can be fixed'
        }],
        owner: user
      });
      const s2 = { desire: 'story 2 desire', benefit: 'story 2 benefit' };
      const s3 = { desire: 'story 3 desire', benefit: 'story 3 benefit' };
      const s4 = { desire: 'story 4 desire', benefit: 'story 4 benefit' };
      const { users } = mongoose.connection.collections;
      p1.save(() => {
        p1.stories.push(s2);
        p1.save(() => {
          p1.stories.push(s3);
          p1.save(() => {
            p1.stories.push(s4);
            p1.save(() => {
              chai.request(app)
                .get(`/projects/${p1._id}/stories?skip=1&limit=2`)
                .set('authorization', tokenForUser(user))
                .end((err, res) => {
                  res.should.have.status(200);
                  res.should.be.json;
                  res.body.status.should.equal('success')
                  res.body.data.should.be.a('array');
                  res.body.data.length.should.be.equal(2);
                  res.body.data[0].desire.should.equal('story 3 desire');
                  res.body.data[1].desire.should.equal('story 2 desire');
                  done();
                })
            })
          })
        })
      })
    });
  })

  describe('POST /projects/:id/stories', () => {
    let p1;

    beforeEach((done) => {
      p1 = new Project({
        name: 'Test Project',
        slug: 'test-project',
        stories: [],
        owner: user
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
        .set('authorization', tokenForUser(user))
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
    it('returns a 400 status when a desire is not provided', (done) => {
      chai.request(app)
        .post(`/projects/${p1._id}/stories`)
        .send({ benefit: 'they can be fixed' })
        .set('authorization', tokenForUser(user))
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.status.should.equal('error');
          res.body.message.should.be.equal('Desire is required.');
          done();
        });
    });
    it('returns a 400 status when a benefit is not provided', (done) => {
      chai.request(app)
        .post(`/projects/${p1._id}/stories`)
        .send({ desire: 'find errors' })
        .set('authorization', tokenForUser(user))
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.status.should.equal('error');
          res.body.message.should.be.equal('Benefit is required.');
          done();
        });
    });
    it('returns a 401 status for unauthorized requests', (done) => {
      chai.request(app)
        .post(`/projects/${p1._id}/stories`)
        .send({ desire: 'find errors', benefit: 'they can be fixed' })
        .end((err, res) => {
          res.should.have.status(401)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('You are unauthorized to make this request.')
          done();
        })
    });
    it('returns a 403 status for restricted ids', (done) => {
      const u2 = new User({
        email: 'test2@test.com',
        password: 'password',
        name: 'Test 2'
      });
      u2.save(() => {
        chai.request(app)
        .post(`/projects/${p1._id}/stories`)
        .send({ desire: 'find errors', benefit: 'they can be fixed' })
        .set('authorization', tokenForUser(u2))
        .end((err, res) => {
          res.should.have.status(403)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('You do not have sufficient permissions to execute this operation.')
          done();
        })
      });
    });
    it('automatically assigns a creation_date', (done) => {
      chai.request(app)
        .post(`/projects/${p1._id}/stories`)
        .send({ desire: 'find errors', benefit: 'they can be fixed' })
        .set('authorization', tokenForUser(user))
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
    let p1, p2, p3;
    let projectId;
    let storyId;

    beforeEach((done) => {
      p1 = new Project({
        name: 'Test Project',
        slug: 'test-project',
        stories: [{
          desire: 'find errors',
          benefit: 'they can be fixed'
        }],
        owner: user
      });
      p2 = new Project({
        name: 'Test Project B',
        slug: 'test-project-b',
        roles: [{ name: 'Test  A' }, {name: 'Test B'}],
        owner: user
      });
      p3 = new Project({
        name: 'Test Project C',
        slug: 'test-project-c',
        roles: [{ name: 'Test  7' }, {name: 'Test X'}],
        owner: user
      });
      p1.save(() => {
        p2.save(() => {
          p3.save(() => {
            projectId = p1._id;
            storyId = p1.stories[0]._id;
            done()
          })
        })
      })
    })

    it('updates a SINGLE story', (done) => {
      chai.request(app)
        .put(`/projects/${projectId}/stories/${storyId}`)
        .send({ desire: 'find all the errors' })
        .set('authorization', tokenForUser(user))
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
        .set('authorization', tokenForUser(user))
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
        .set('authorization', tokenForUser(user))
        .end((err, res) => {
          res.should.have.status(403)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('This action is forbidden.')
          done()
        })
    });
    it('returns a 401 status for unauthorized requests', (done) => {
      chai.request(app)
        .put(`/projects/${projectId}/stories/${storyId}`)
        .send({ desire: 'find all the errors' })
        .end((err, res) => {
          res.should.have.status(401)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('You are unauthorized to make this request.')
          done();
        })
    });
    it('returns a 403 status for restricted ids', (done) => {
      const u2 = new User({
        email: 'test2@test.com',
        password: 'password',
        name: 'Test 2'
      });
      u2.save(() => {
        chai.request(app)
        .put(`/projects/${projectId}/stories/${storyId}`)
        .send({ desire: 'find all the errors' })
        .set('authorization', tokenForUser(u2))
        .end((err, res) => {
          res.should.have.status(403)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('You do not have sufficient permissions to execute this operation.')
          done();
        })
      });
    });
    it('returns a 404 status for invalid ids', (done) => {
      chai.request(app)
        .put(`/projects/${projectId}/stories/invalid`)
        .set('authorization', tokenForUser(user))
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('The requested resource does not exist.')
          done()
        })
    });
    it('returns a 404 status for non-existent ids', (done) => {
      chai.request(app)
        .put(`/projects/${projectId}/stories/${mongoose.Types.ObjectId()}`)
        .set('authorization', tokenForUser(user))
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
    let p1, p2, p3;
    let projectId;
    let storyId;

    beforeEach((done) => {
      p1 = new Project({
        name: 'Test Project',
        slug: 'test-project',
        stories: [{
          desire: 'find errors',
          benefit: 'they can be fixed'
        }],
        owner: user
      });
      p2 = new Project({
        name: 'Test Project B',
        slug: 'test-project-b',
        roles: [{ name: 'Test  A' }, {name: 'Test B'}],
        owner: user
      });
      p3 = new Project({
        name: 'Test Project C',
        slug: 'test-project-c',
        roles: [{ name: 'Test  7' }, {name: 'Test X'}],
        owner: user
      });
      p1.save(() => {
        p2.save(() => {
          p3.save(() => {
            projectId = p1._id;
            storyId = p1.stories[0]._id;
            done()
          })
        })
      })
    })

    it('deletes a SINGLE story', (done) => {
      chai.request(app)
        .delete(`/projects/${projectId}/stories/${storyId}`)
        .set('authorization', tokenForUser(user))
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
    it('returns a 401 status for unauthorized requests', (done) => {
      chai.request(app)
        .delete(`/projects/${projectId}/stories/${storyId}`)
        .end((err, res) => {
          res.should.have.status(401)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('You are unauthorized to make this request.')
          done();
        })
    });
    it('returns a 403 status for restricted ids', (done) => {
      const u2 = new User({
        email: 'test2@test.com',
        password: 'password',
        name: 'Test 2'
      });
      u2.save(() => {
        chai.request(app)
        .delete(`/projects/${projectId}/stories/${storyId}`)
        .set('authorization', tokenForUser(u2))
        .end((err, res) => {
          res.should.have.status(403)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('You do not have sufficient permissions to execute this operation.')
          done();
        })
      });
    });
    it('returns a 404 status for invalid ids', (done) => {
      chai.request(app)
        .delete(`/projects/${projectId}/stories/invalid`)
        .set('authorization', tokenForUser(user))
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('The requested resource does not exist.')
          done()
        })
    });
    it('returns a 404 status for non-existent ids', (done) => {
      chai.request(app)
        .delete(`/projects/${projectId}/stories/${mongoose.Types.ObjectId()}`)
        .set('authorization', tokenForUser(user))
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
