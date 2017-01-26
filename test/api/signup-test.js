const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const chai = require('chai');
const chai_http = require('chai-http');

const server = require('./../../server');
const signup = require('./../../app/controllers/signup');

const expect = chai.expect();

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

  describe('Signup', () => {
    it('should check if any input field is empty', (done) => {
      const user = {
        name: 'uloaku',
        username: 'ulo',
        email: '',
        password: ''
      };

      chai.request(server)
        .post('/controllers/signup')
        .send(user)
        .end((err, res) => {
          expect(res.body).to.have.statusOf(400);
          expect(res.body).to.have.property('msg');
          expect(res.body.msg).to.equal('Please no input field can be empty!');
          done();
        });
    });
  });


  it('should return error when a username or email already exists', () => {
    const user = {
      name: 'chioma',
      username: 'ulo',
      email: 'ulo@gmail.com',
      password: 'chioma001'
    };

    chai.request(server)
      .post('/controllers/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body).to.have.statusOf(409);
        expect(res.body).to.have.property('msg');
        expect(res.body.msg).to.equal('User already exists!');
        done();
      });
  });
});

