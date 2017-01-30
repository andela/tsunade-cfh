const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const chai = require('chai');
const chai_http = require('chai-http');

const server = require('./../../server');
const signup = require('./../../app/controllers/signup');

const expect = chai.expect;

chai.use(chai_http);

const User = mongoose.model('User');

describe('Signup authentication', () => {
  beforeEach((done) => {
    const user = new User();
    user.name = 'uloaku';
    user.username = 'ulo';
    user.password = 'password';
    user.email = 'ulo@gmail.com';
    user.save(() => {
      done();
    });
  });
  afterEach((done) => {
    User.remove({}, (err) => {
      if (err) {
        throw new Error('Failed to wipe database');
      }
      done();
    });
  });

  it('should check if any input field is empty', (done) => {
    const user = {
      name: 'uloaku',
      username: 'ulo',
      email: '',
      password: ''
    };

    chai.request(server)
    .post('/api/auth/signup')
    .send(user)
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('msg');
      expect(res.body.msg).to.equal('Please no input field can be empty!');
      done();
    });
  });


  it('should return error when a username or email already exists', (done) => {
    const user = {
      name: 'chioma',
      username: 'uloooo',
      email: 'ulo@gmail.com',
      password: 'chioma001'
    };

    chai.request(server)
      .post('/api/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('email already exist');
        done();
      });
  });

  it('should give a user JWT token on successful signup', (done) => {
    user = {
      name: 'uloaku',
      username: 'ulojbkbk',
      email: 'ulojjbjmbb@gmail.com',
      password: 'password'
    };
    chai.request(server)
    .post('/api/auth/signup')
    .send(user)
    .end((err, res) => {
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('msg');
      expect(res.body).to.have.property('token');
      expect(res.body.msg).to.equal('You have successfully signed up!');
      done();
    });
  });
});

