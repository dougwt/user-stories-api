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
    xit('lists ALL stories', () => {

    });
  })

  describe('POST /projects/:id/stories', () => {
    xit('creates a new story', () => {

    });
  })

  //////////////////////////////////////////////////////////
  //  /projects/:id/stories/:id
  //////////////////////////////////////////////////////////

  describe('GET /projects/:id/stories/:id', () => {
    xit('lists a SINGLE story', () => {

    })
  })

  describe('PUT /projects/:id/stories/:id', () => {
    xit('updates a SINGLE story', () => {

    });
  })

  describe('DELETE /projects/:id/stories/:id', () => {
    xit('deletes a SINGLE story', () => {

    });
  })

});
