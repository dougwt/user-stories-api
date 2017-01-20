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
    xit('returns an empty list when the collection is empty', () => {

    });
  })

  describe('POST /projects/:id/roles', () => {
    xit('creates a new role', () => {

    });
    xit('returns an error when a name is not provided', () => {

    });
    xit('automatically assigns a creation_date', () => {

    });
  })

  //////////////////////////////////////////////////////////
  //  /projects/:id/roles/:id
  //////////////////////////////////////////////////////////

  describe('PUT /projects/:id/roles/:id', () => {
    xit('updates a SINGLE role', () => {

    });
    xit('only updates provided fields', () => {

    });
    xit('does not modify the original id', () => {

    });
    xit('returns an error for invalid ids', () => {

    });
    xit('returns an error for non-existent ids', () => {

    });
  })

  describe('DELETE /projects/:id/roles/:id', () => {
    xit('deletes a SINGLE role', () => {

    });
    xit('returns an error for invalid ids', () => {

    });
    xit('returns an error for non-existent ids', () => {

    });
  })

});
