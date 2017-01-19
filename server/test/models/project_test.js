const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const User = mongoose.model('user');
let expect = chai.expect;

chai.use(chaiHttp)

describe('Project model', () => {

  xit('fails validation if something is empty', () => {

  });

});
