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
    xit('creates a new project', () => {

    });
    xit('returns an error when a name is not provided', () => {

    });
    xit('returns an error when a slug is not provided', () => {

    });
    xit('returns an error when an invalid slug is provided (punctuation)', () => {

    });
    xit('returns an error when an invalid slug is provided (trailing-slash)', () => {

    });
    xit('returns an error when a duplicate slug is provided', () => {

    });
    xit('converts a slug to lowercase', () => {

    });
    xit('automatically assigns a creation date', () => {

    });
  })

  //////////////////////////////////////////////////////////
  //  /projects/:id
  //////////////////////////////////////////////////////////

  describe('GET /projects/:id', () => {
    xit('lists a SINGLE project', () => {

    })
    xit('returns a 404 status for invalid ids', () => {

    })
    xit('returns a 404 status for non-existent ids', () => {

    })
  })

  describe('PUT /projects/:id', () => {
    xit('updates a SINGLE project', () => {

    });
    xit('only updates provided fields', () => {

    })
    xit('does not modify the original id', () => {

    })
    xit('returns error status for invalid ids', () => {

    })
    xit('returns error status for non-existent ids', () => {

    })
    xit('returns an error when an invalid slug is provided', () => {

    })
  })

  describe('DELETE /projects/:id', () => {
    xit('deletes a SINGLE project', () => {

    });
    xit('returns a 404 status for invalid ids', () => {

    });
    xit('returns a 404 status for non-existent ids', () => {

    });
  })

});
