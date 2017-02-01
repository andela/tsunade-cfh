const mongoose = require('mongoose');


const jwt = require('jsonwebtoken');
const moment = require('moment');
const User = require('../../app/models/user');


const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should;


const server = require('../../server');
chai.use(chaiHttp);


describe('Login Authentication', () => {
  describe('Login', () => {
    before((done) => {
    const user = new User({
      email: 'abc@gmail.com',
      password: 'abc',
      username: 'abc',
      avatar: ''
    });
    user.save((err) => {
      if (err) {
        throw err;
      }
      done();
    });
    });
  });








  it('should return error on wrong email and password login details',
  () => {
    const user = {
      email: 'abcd@gmail.com',
      password: 'abcdefddddd'
    };
    chai.request(server)
    .post('/api/auth/login')
    .send(user)
    .end((err, res) => {
      console.log(res)
      res.body.should.have.property('message').eql('Authentication failed');
    });
  });


  it('should return success on correct email and password login details',
  () => {
    const user = {
      email: 'abc@gmail.com',
      password: 'abc'
    };
    chai.request(server)
    .post('/api/auth/login')
    .send(user)
    .end((err, res) => {
      res.body.should.have.property('message').eql('Authentication successful');
      res.body.should.have.property('token');
    });
  });
});