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
    xit('returns an empty list when the collection is empty', () => {

    });
  })

  describe('POST /projects/:id/stories', () => {
    xit('creates a new story', () => {

    });
    xit('returns an error when a desire is not provided', () => {

    });
    xit('returns an error when a benefit is not provided', () => {

    });
    xit('automatically assigns a creation_date', () => {

    });
  })

  //////////////////////////////////////////////////////////
  //  /projects/:id/stories/:id
  //////////////////////////////////////////////////////////

  describe('GET /projects/:id/stories/:id', () => {
    xit('lists a SINGLE story', () => {

    })
    xit('returns a 404 status for invalid ids', () => {

    });
    xit('returns a 404 status for non-existent ids', () => {

    });
  })

  describe('PUT /projects/:id/stories/:id', () => {
    xit('updates a SINGLE story', () => {

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

  describe('DELETE /projects/:id/stories/:id', () => {
    xit('deletes a SINGLE story', () => {

    });
    xit('returns an error for invalid ids', () => {

    });
    xit('returns an error for non-existent ids', () => {

    });
  })

});
