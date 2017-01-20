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
    xit('returns an empty list when the collection is empty', () => {

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
