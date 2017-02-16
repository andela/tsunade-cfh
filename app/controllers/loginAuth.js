const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const User = mongoose.model('User');
const jwtSimple = require('jwt-simple');


const auth = {

  login: (request, response) => {
    User.findOne({
      email: request.body.email
    }, (error, user) => {
      if (error) {
        response.status(500).send(error);
      }
      if (!user) {
        response.status(401).json({
          success: false,
          message: 'Authentication failed'
        });
      } else if (user) {
        if (!user.authenticate(request.body.password)) {
          response.status(401).json({
            success: false,
            message: 'Authentication failed'
          });
        } else {
          const token = jwt.sign(user, process.env.SECRET, {
            expiresIn: '24h',
          });
          response.status(200).json({
            success: true,
            message: 'Authentication successful',
            token: token
          });
        }
      }
    });
  },

  social: (req, res) => {
    User.findOne({
      email: req.body.email
    }, function (err, registeredUser) {
      if (err) {
        res.status(500).json({
          authenticated: false,
          error: err,
          message: 'Sorry, there was a server error.'
        });
      }

      if (!registeredUser) {
        var body = req.body;
        if (body.name && body.email && body.provider) {
          var user = new User();
          user.name = body.name;
          user.username = body.name;
          user.email = body.email;
          user.provider = body.provider;
          user.save( function (err, savedUser) {
            if (err) {
              res.status(500).json({
                authenticated: false,
                error: err,
                message: 'Sorry, there was a server error.'
              });
            }
            var token = jwt.sign({id: user.id}, process.env.SECRET, {
              expiresIn: '24h'
            });
            res.status(200).json({
              authenticated: true,
              message: 'You have successfully signed up.',
              token: token,
              user: savedUser
            });
          });
        } else {
          res.status(400).json({
            authenticated: false,
            message: 'Signup details are incomplete.'
          });
        }
      } else {
        var token = jwt.sign(registeredUser, process.env.SECRET, {
          expiresIn: '24h'
        });
        console.log('token: ', token);
        res.status(200).json({
          authenticated: true,
          message: 'You have been authenticated.',
          token: token,
          user: registeredUser
        });
      }
    });
  }
}

module.exports = auth;
