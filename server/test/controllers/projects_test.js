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
    xit('lists ALL projects', () => {

    });
  })

  describe('POST /projects', () => {
    xit('creates a new project', () => {

    });
  })

  //////////////////////////////////////////////////////////
  //  /projects/:id
  //////////////////////////////////////////////////////////

  describe('GET /projects/:id', () => {
    xit('lists a SINGLE project', () => {

    })
  })

  describe('PUT /projects/:id', () => {
    xit('updates a SINGLE project', () => {

    });
  })

  describe('DELETE /projects/:id', () => {
    xit('deletes a SINGLE project', () => {

    });
  })

});
