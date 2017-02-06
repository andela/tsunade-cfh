const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const moment = require('moment');

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const User = mongoose.model('User');

const server = require('../../server');
chai.use(chaiHttp);

describe('Authentication', () => {
  describe('Login', () => {
    beforeEach((done) => {
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
    afterEach((done) => {
      User.remove({}, (err) => {
        if (err) {
          throw new Error('Failed to wipe database');
        }
        done();
      });
    });

    it('should return error on wrong email and password login details',
    (done) => {
      const user = {
        email: 'abcd@gmail.com',
        password: 'abcdef'
      };
      chai.request(server)
      .post('/api/auth/login')
      .send(user)
      .end((err, res) => {
        expect(res.body).to.have.property('success').eql(false);
        expect(res.body).to.have.property('message').eql('Authentication failed');
      });
      done();
    });

    it('should return success on correct email and password login details',
    (done) => {
      const user = {
        email: 'abc@gmail.com',
        password: 'abc'
      };
      chai.request(server)
      .post('/api/auth/login')
      .send(user)
      .end((err, res) => {
        expect(res.body).to.have.property('success').eql(true);
        expect(res.body).to.have.property('message').eql('Authentication successful');
        expect(res.body).to.have.property('token');
        done();
      });
    });
  });
});
