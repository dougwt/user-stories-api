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
    xit('lists ALL roles', () => {

    });
  })

  describe('POST /projects/:id/roles', () => {
    xit('creates a new role', () => {

    });
  })

  //////////////////////////////////////////////////////////
  //  /projects/:id/roles/:id
  //////////////////////////////////////////////////////////

  describe('PUT /projects/:id/roles/:id', () => {
    xit('updates a SINGLE role', () => {

    });
  })

  describe('DELETE /projects/:id/roles/:id', () => {
    xit('deletes a SINGLE role', () => {

    });
  })

});
