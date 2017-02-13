const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../../app');

chai.use(chaiHttp)

describe('Authentication API', () => {

  //////////////////////////////////////////////////////////
  //  /signin
  //////////////////////////////////////////////////////////

  describe('POST /signin', () => {
    xit('returns an auth token when provided valid credentials', (done) => {

    });
    xit('returns a 401 status when provided invalid credentials', (done) => {

    });
  });

  //////////////////////////////////////////////////////////
  //  /signup
  //////////////////////////////////////////////////////////

  describe('POST /signup', () => {
    xit('returns an auth token when provided valid data', (done) => {

    });
    xit('creates a new user', (done) => {

    });
    xit('returns an error when an email is not provided ', (done) => {

    });
    xit('returns an error when a password is not provided ', (done) => {

    });
    xit('returns an error when a name is not provided ', (done) => {

    });
    xit('returns an error when a duplicate email is provided', (done) => {

    });
  });

});
