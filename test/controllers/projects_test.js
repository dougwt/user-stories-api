const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../../app');
const Project = mongoose.model('project');

chai.use(chaiHttp)

describe('Projects API', () => {

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
    it('lists ALL projects sorted by descending creation dates', (done) => {
      const u1 = new Project({
        name: 'Test 1',
        slug: 'test-1'
      });
      const u2 = new Project({
        name: 'Test 2',
        slug: 'test-2'
      });
      const u3 = new Project({
        name: 'Test 3',
        slug: 'test-3'
      });
      const { projects } = mongoose.connection.collections;
      projects.drop(() => {
        u1.save(() => {
          u2.save(() => {
            u3.save(() => {
              chai.request(app)
                .get('/projects')
                .end((err, res) => {
                  res.should.have.status(200);
                  res.should.be.json;
                  res.body.status.should.equal('success')
                  res.body.data.should.be.a('array');
                  res.body.data.length.should.equal(3);
                  res.body.data[0].should.have.property('name');
                  res.body.data[0].should.have.property('slug');
                  res.body.data[0].should.have.property('_createdAt');
                  res.body.data[0].name.should.equal('Test 3');
                  res.body.data[1].name.should.equal('Test 2');
                  res.body.data[2].name.should.equal('Test 1');
                  done();
                })
            });
          });
        });
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
    it('supports use of only the skip param', (done) => {
      const p1 = new Project({
        name: 'Test 1',
        slug: 'test-1'
      });
      const p2 = new Project({
        name: 'Test 2',
        slug: 'test-2'
      });
      const p3 = new Project({
        name: 'Test 3',
        slug: 'test-3'
      });
      const p4 = new Project({
        name: 'Test 4',
        slug: 'test-4'
      });
      const { users } = mongoose.connection.collections;
      users.drop(() => {
        p1.save(() => {
          p2.save(() => {
            p3.save(() => {
              p3.save(() => {
                p4.save(() => {
                  chai.request(app)
                    .get('/projects?skip=2')
                    .end((err, res) => {
                      res.should.have.status(200);
                      res.should.be.json;
                      res.body.status.should.equal('success')
                      res.body.data.should.be.a('array');
                      res.body.data.length.should.be.equal(2);
                      res.body.data[0].name.should.equal('Test 2');
                      res.body.data[1].name.should.equal('Test 1');
                      done();
                    })
                })
              })
            })
          })
        })
      })
    });
    it('supports use of only the limit param', (done) => {
      const p1 = new Project({
        name: 'Test 1',
        slug: 'test-1'
      });
      const p2 = new Project({
        name: 'Test 2',
        slug: 'test-2'
      });
      const p3 = new Project({
        name: 'Test 3',
        slug: 'test-3'
      });
      const p4 = new Project({
        name: 'Test 4',
        slug: 'test-4'
      });
      const { users } = mongoose.connection.collections;
      users.drop(() => {
        p1.save(() => {
          p2.save(() => {
            p3.save(() => {
              p3.save(() => {
                p4.save(() => {
                  chai.request(app)
                    .get('/projects?limit=3')
                    .end((err, res) => {
                      res.should.have.status(200);
                      res.should.be.json;
                      res.body.status.should.equal('success')
                      res.body.data.should.be.a('array');
                      res.body.data.length.should.be.equal(3);
                      res.body.data[0].name.should.equal('Test 4');
                      res.body.data[1].name.should.equal('Test 3');
                      res.body.data[2].name.should.equal('Test 2');
                      done();
                    })
                })
              })
            })
          })
        })
      })
    });
    it('supports use of both the skip and limit params', (done) => {
      const p1 = new Project({
        name: 'Test 1',
        slug: 'test-1'
      });
      const p2 = new Project({
        name: 'Test 2',
        slug: 'test-2'
      });
      const p3 = new Project({
        name: 'Test 3',
        slug: 'test-3'
      });
      const p4 = new Project({
        name: 'Test 4',
        slug: 'test-4'
      });
      const { users } = mongoose.connection.collections;
      users.drop(() => {
        p1.save(() => {
          p2.save(() => {
            p3.save(() => {
              p3.save(() => {
                p4.save(() => {
                  chai.request(app)
                    .get('/projects?skip=1&limit=2')
                    .end((err, res) => {
                      res.should.have.status(200);
                      res.should.be.json;
                      res.body.status.should.equal('success')
                      res.body.data.should.be.a('array');
                      res.body.data.length.should.be.equal(2);
                      res.body.data[0].name.should.equal('Test 3');
                      res.body.data[1].name.should.equal('Test 2');
                      done();
                    })
                })
              })
            })
          })
        })
      })
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

  describe('GET /projects/:id', () => {
    it('lists a SINGLE project', (done) => {
      const project = new Project({
        name: 'Test',
        slug: 'test'
      });
      project.save().then(() => {
        chai.request(app)
          .get(`/projects/${project._id}`)
          .end((err, res) => {
            res.should.have.status(200)
            res.should.be.json
            res.body.should.have.property('data')
            res.body.data.should.be.a('object')
            res.body.data.should.have.property('_id');
            res.body.data.should.have.property('name')
            res.body.data.should.have.property('slug')
            res.body.data.should.have.property('roles')
            res.body.data.should.have.property('owner')
            res.body.data.should.have.property('_createdAt')
            res.body.data._id.should.equal(project.id)
            res.body.data.name.should.equal('Test')
            res.body.data.slug.should.equal('test')
            res.body.status.should.equal('success')
            done()
          });
      });
    })
    it('returns a 404 status for invalid ids', (done) => {
      chai.request(app)
        .get('/projects/invalid')
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('The requested resource does not exist.')
          done()
        })
    })
    it('returns a 404 status for non-existent ids', (done) => {
      chai.request(app)
        .get(`/projects/${mongoose.Types.ObjectId()}`)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('The requested resource does not exist.')
          done()
        })
    })
  })

  describe('PUT /projects/:id', () => {
    let p1, p2;

    beforeEach((done) => {
      p1 = new Project({
        name: 'Test Project A',
        slug: 'test-project-a',
      });
      p2 = new Project({
        name: 'Test Project B',
        slug: 'test-project-b',
      });
      p1.save(() => {
        p2.save(() => {
          done()
        })
      })
    })

    it('updates a SINGLE project', (done) => {
      const project = new Project({
        name: 'Test 1',
        slug: 'test-1'
      });
      project.save().then(() => {
        chai.request(app)
          .put(`/projects/${project._id}`)
          .send({ name: 'Test 2', slug: 'test-2' })
          .end((err, res) => {
            res.should.have.status(204)
            res.headers.should.have.property('location')
            res.headers.location.startsWith('https://api.mycodebytes.com/v1/projects/');
            Object.keys(res.body).length.should.equal(0)
            res.body.constructor.should.equal(Object)
            Project.findById(project._id)
              .then((project) => {
                project.name.should.equal('Test 2')
                project.slug.should.equal('test-2')
                done()
              })
          })
      })
    });
    it('only updates provided fields', (done) => {
      const project = new Project({
        name: 'Test 1',
        slug: 'test-1'
      });
      project.save().then(() => {
        chai.request(app)
          .put(`/projects/${project._id}`)
          .send({ name: 'Test 2' })
          .end((err, res) => {
            res.should.have.status(204)
            res.headers.should.have.property('location')
            res.headers.location.startsWith('https://api.mycodebytes.com/v1/projects/');
            Object.keys(res.body).length.should.equal(0)
            res.body.constructor.should.equal(Object)
            Project.findById(project._id)
              .then((project) => {
                project.name.should.equal('Test 2')
                project.slug.should.equal('test-1')
                done()
              })
          })
      })
    })
    it('does not modify the original id', (done) => {
      const project = new Project({
        name: 'Test 1',
        slug: 'test-1'
      });
      project.save().then(() => {
        chai.request(app)
          .put(`/projects/${project._id}`)
          .send({ _id: mongoose.Types.ObjectId() })
          .end((err, res) => {
            res.should.have.status(403)
            res.should.be.json
            res.body.status.should.equal('error')
            res.body.message.should.be.equal('This action is forbidden.')
            done()
          })
      })
    })
    it('returns error status for invalid ids', (done) => {
      chai.request(app)
        .put('/projects/invalid')
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('The requested resource does not exist.')
          done()
        })
    })
    it('returns error status for non-existent ids', (done) => {
      chai.request(app)
        .put(`/projects/${mongoose.Types.ObjectId()}`)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('The requested resource does not exist.')
          done()
        })
    })
    it('returns an error when an invalid slug is provided', (done) => {
      const project = new Project({
        name: 'Test 1',
        slug: 'test-1'
      });
      project.save().then(() => {
        chai.request(app)
          .put(`/projects/${project._id}`)
          .send({ slug: 'test-' })
          .end((err, res) => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.status.should.equal('error');
            res.body.message.should.be.equal('Slug is invalid.');
            Project.findById(project._id)
              .then((project) => {
                project.slug.should.equal('test-1')
                done()
              })
          })
      })
    })
    it('returns an error when a duplicate slug is provided', (done) => {
      const project = new Project({
        name: 'Test 1',
        slug: 'test-1'
      });
      project.save().then(() => {
        chai.request(app)
          .put(`/projects/${project._id}`)
          .send({ slug: 'test-project-a' })
          .end((err, res) => {
            res.should.have.status(409);
            res.should.be.json;
            res.body.status.should.equal('error');
            res.body.message.should.be.equal('Slug is in use.');
            Project.findById(project._id)
              .then((project) => {
                project.slug.should.equal('test-1')
                done()
              })
          })
      })
    })
  })

  describe('DELETE /projects/:id', () => {
    let p1, p2;

    beforeEach((done) => {
      p1 = new Project({
        name: 'Test Project A',
        slug: 'test-project-a',
      });
      p2 = new Project({
        name: 'Test Project B',
        slug: 'test-project-b',
      });
      p1.save(() => {
        p2.save(() => {
          done()
        })
      })
    })

    it('deletes a SINGLE project', (done) => {
      const project1 = new Project({
        name: 'Test',
        slug: 'test'
      });
      project1.save().then(() => {
        chai.request(app)
          .delete(`/projects/${project1._id}`)
          .end((err, res) => {
            Object.keys(res.body).length.should.equal(0)
            res.body.constructor.should.equal(Object)
            Project.findById(project1._id)
              .then((project2) => {
                chai.expect(project2 === null)
                done()
              })
          })
      })
    });
    it('returns a 404 status for invalid ids', (done) => {
      chai.request(app)
        .delete('/projects/invalid')
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
        .delete(`/projects/${mongoose.Types.ObjectId()}`)
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
