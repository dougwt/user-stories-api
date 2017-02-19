const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../../app');
const User = mongoose.model('user');
const Project = mongoose.model('project');
import { tokenForUser } from '../../app/controllers/authentication'

chai.use(chaiHttp)

describe('Roles API', () => {

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
  //  /projects/:id/roles
  //////////////////////////////////////////////////////////

  describe('GET /projects/:id/roles', () => {
    it('lists ALL roles', (done) => {
      const project = new Project({
        name: 'Test Project',
        slug: 'test-project',
        roles: [{ name: 'Test' }],
        owner: user
      });
      project.save().then(() => {
        chai.request(app)
          .get(`/projects/${project._id}/roles`)
          .set('authorization', tokenForUser(user))
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
    it('lists ALL roles sorted by descending creation dates', (done) => {
      const project = new Project({
        name: 'Test Project',
        slug: 'test-project',
        roles: [{ name: 'Test 1' }],
        owner: user
      });
      const r2 = { name: 'Test 2' };
      const r3 = { name: 'Test 3' };
      project.save().then(() => {
        project.roles.push(r2);
        project.save().then(() => {
          project.roles.push(r3);
          project.save().then(() => {
            chai.request(app)
              .get(`/projects/${project._id}/roles`)
              .set('authorization', tokenForUser(user))
              .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.status.should.equal('success')
                res.body.data.should.be.a('array');
                res.body.data.length.should.equal(3);
                res.body.data[0].should.have.property('name');
                res.body.data[0].should.have.property('_createdAt');
                res.body.data[0].name.should.equal('Test 3');
                res.body.data[1].name.should.equal('Test 2');
                res.body.data[2].name.should.equal('Test 1');
                done();
              })
          })
        })
      })
    });
    it('returns an empty list when the collection is empty', (done) => {
      const project = new Project({
        name: 'Test Project',
        slug: 'test-project',
        roles: [],
        owner: user
      });
      project.save().then(() => {
        chai.request(app)
          .get(`/projects/${project._id}/roles`)
          .set('authorization', tokenForUser(user))
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
    it('supports use of only the skip param', (done) => {
      const p1 = new Project({
        name: 'Test Project',
        slug: 'test-project',
        roles: [{ name: 'Test 1' }],
        owner: user
      });
      const r2 = { name: 'Test 2' };
      const r3 = { name: 'Test 3' };
      const r4 = { name: 'Test 4' };
      const { users } = mongoose.connection.collections;
      p1.save(() => {
        p1.roles.push(r2);
        p1.save(() => {
          p1.roles.push(r3);
          p1.save(() => {
            p1.roles.push(r4);
            p1.save(() => {
              chai.request(app)
                .get(`/projects/${p1._id}/roles?skip=2`)
                .set('authorization', tokenForUser(user))
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
    });
    it('supports use of only the limit param', (done) => {
      const p1 = new Project({
        name: 'Test Project',
        slug: 'test-project',
        roles: [{ name: 'Test 1' }],
        owner: user
      });
      const r2 = { name: 'Test 2' };
      const r3 = { name: 'Test 3' };
      const r4 = { name: 'Test 4' };
      const { users } = mongoose.connection.collections;
      p1.save(() => {
        p1.roles.push(r2);
        p1.save(() => {
          p1.roles.push(r3);
          p1.save(() => {
            p1.roles.push(r4);
            p1.save(() => {
              chai.request(app)
                .get(`/projects/${p1._id}/roles?limit=3`)
                .set('authorization', tokenForUser(user))
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
    });
    it('supports use of both the skip and limit params', (done) => {
      const p1 = new Project({
        name: 'Test Project',
        slug: 'test-project',
        roles: [{ name: 'Test 1' }],
        owner: user
      });
      const r2 = { name: 'Test 2' };
      const r3 = { name: 'Test 3' };
      const r4 = { name: 'Test 4' };
      const { users } = mongoose.connection.collections;
      p1.save(() => {
        p1.roles.push(r2);
        p1.save(() => {
          p1.roles.push(r3);
          p1.save(() => {
            p1.roles.push(r4);
            p1.save(() => {
              chai.request(app)
                .get(`/projects/${p1._id}/roles?skip=1&limit=2`)
                .set('authorization', tokenForUser(user))
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
    });
    it('returns a 401 status for unauthorized requests', (done) => {
      const project = new Project({
        name: 'Test Project',
        slug: 'test-project',
        roles: [{ name: 'Test' }],
        owner: user
      });
      project.save().then(() => {
        chai.request(app)
          .get(`/projects/${project._id}/roles`)
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
      const project = new Project({
        name: 'Test Project',
        slug: 'test-project',
        roles: [{ name: 'Test' }],
        owner: user
      });
      u2.save(() => {
        project.save(() => {
          chai.request(app)
            .get(`/projects/${project._id}/roles`)
            .set('authorization', tokenForUser(u2))
            .end((err, res) => {
              res.should.have.status(403)
              res.should.be.json
              res.body.status.should.equal('error')
              res.body.message.should.be.equal('You do not have sufficient permissions to execute this operation.')
              done()
            });
        })
      });
    });
  })

  describe('POST /projects/:id/roles', () => {
    let p1;

    beforeEach((done) => {
      p1 = new Project({
        name: 'Test Project',
        slug: 'test-project',
        roles: [],
        owner: user
      });
      p1.save().then(() => {
        done()
      })
    })

    it('creates a new role', (done) => {
      const count = p1.roles.length;
      chai.request(app)
        .post(`/projects/${p1._id}/roles`)
        .send({ name: 'Test', slug: 'test' })
        .set('authorization', tokenForUser(user))
        .end((err, res) => {
          Project.findById(p1.id).then(project => {
            const newCount = project.roles.length
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
    it('returns a 400 status when a name is not provided', (done) => {
      chai.request(app)
        .post(`/projects/${p1._id}/roles`)
        .send({ slug: 'test' })
        .set('authorization', tokenForUser(user))
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.status.should.equal('error');
          res.body.message.should.be.equal('Name is required.');
          done();
        });
    });
    it('returns a 401 status for unauthorized requests', (done) => {
      chai.request(app)
        .post(`/projects/${p1._id}/roles`)
        .send({ slug: 'test' })
        .end((err, res) => {
          res.should.have.status(401);
          res.should.be.json;
          res.body.status.should.equal('error');
          res.body.message.should.be.equal('You are unauthorized to make this request.')
          done();
        });
    });
    it('returns a 403 status for restricted ids', (done) => {
      const u2 = new User({
        email: 'test2@test.com',
        password: 'password',
        name: 'Test 2'
      });
      u2.save(() => {
        chai.request(app)
          .post(`/projects/${p1._id}/roles`)
          .send({ slug: 'test' })
          .set('authorization', tokenForUser(u2))
          .end((err, res) => {
            res.should.have.status(403)
            res.should.be.json
            res.body.status.should.equal('error')
            res.body.message.should.be.equal('You do not have sufficient permissions to execute this operation.')
            done()
          });
      });
    });
    it('automatically assigns a creation_date', (done) => {
      chai.request(app)
        .post(`/projects/${p1._id}/roles`)
        .send({ name: 'Test', slug: 'test' })
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
  //  /projects/:id/roles/:id
  //////////////////////////////////////////////////////////

  describe('PUT /projects/:id/roles/:id', () => {
    let p1, p2, p3;

    beforeEach((done) => {
      p1 = new Project({
        name: 'Test Project',
        slug: 'test-project',
        roles: [{ name: 'Test 1' }],
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
            done()
          })
        })
      })
    })

    it('updates a SINGLE role', (done) => {
      chai.request(app)
        .put(`/projects/${p1._id}/roles/${p1.roles[0]._id}`)
        .send({ name: 'Test 2' })
        .set('authorization', tokenForUser(user))
        .end((err, res) => {
          res.should.have.status(204)
          res.headers.should.have.property('location')
          res.headers.location.startsWith('https://api.mycodebytes.com/v1/projects/');
          Object.keys(res.body).length.should.equal(0)
          res.body.constructor.should.equal(Object)
          Project.findById(p1._id)
            .then((project) => {
              project.roles[0].name.should.equal('Test 2')
              done()
            })
        })
    });
    // xit('only updates provided fields', (done) => {
    //
    // });
    it('does not modify the original id', (done) => {
      chai.request(app)
        .put(`/projects/${p1._id}/roles/${p1.roles[0]._id}`)
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
        .put(`/projects/${p1._id}/roles/${p1.roles[0]._id}`)
        .send({ name: 'Test 2' })
        .end((err, res) => {
          res.should.have.status(401)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('You are unauthorized to make this request.')
          done()
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
          .put(`/projects/${p1._id}/roles/${p1.roles[0]._id}`)
          .send({ name: 'Test 2' })
          .set('authorization', tokenForUser(u2))
          .end((err, res) => {
            res.should.have.status(403)
            res.should.be.json
            res.body.status.should.equal('error')
            res.body.message.should.be.equal('You do not have sufficient permissions to execute this operation.')
            done()
          });
      });
    });
    it('returns a 404 status for invalid ids', (done) => {
      chai.request(app)
        .put(`/projects/${p1._id}/roles/invalid`)
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
        .put(`/projects/${p1._id}/roles/${mongoose.Types.ObjectId()}`)
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

  describe('DELETE /projects/:id/roles/:id', () => {
    let p1, p2, p3;
    let projectId;
    let roleId;

    beforeEach((done) => {
      p1 = new Project({
        name: 'Test Project',
        slug: 'test-project',
        roles: [{ name: 'Test 1' }],
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
            roleId = p1.roles[0]._id;
            done()
          })
        })
      })
    })

    it('deletes a SINGLE role', (done) => {
      chai.request(app)
        .delete(`/projects/${projectId}/roles/${roleId}`)
        .set('authorization', tokenForUser(user))
        .end((err, res) => {
          res.should.have.status(204)
          Object.keys(res.body).length.should.equal(0)
          res.body.constructor.should.equal(Object)
          Project.findById(projectId)
            .then((project2) => {
              project2.roles.length.should.equal(0)
              done()
            })
        })
    });
    it('returns a 401 status for unauthorized requests', (done) => {
      chai.request(app)
        .delete(`/projects/${projectId}/roles/${roleId}`)
        .end((err, res) => {
          res.should.have.status(401)
          res.should.be.json
          res.body.status.should.equal('error')
          res.body.message.should.be.equal('You are unauthorized to make this request.')
          done()
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
          .delete(`/projects/${projectId}/roles/${roleId}`)
          .set('authorization', tokenForUser(u2))
          .end((err, res) => {
            res.should.have.status(403)
            res.should.be.json
            res.body.status.should.equal('error')
            res.body.message.should.be.equal('You do not have sufficient permissions to execute this operation.')
            done()
          });
      });
    });
    it('returns a 404 status for invalid ids', (done) => {
      chai.request(app)
        .delete(`/projects/${projectId}/roles/invalid`)
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
        .delete(`/projects/${projectId}/roles/${mongoose.Types.ObjectId()}`)
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
