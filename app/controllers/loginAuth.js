const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


const moment = require('moment');


const User = mongoose.model('User');


exports.login = (request, response) => {
  User.findOne({
    email: request.body.email
  }, (error, user) => {
    if (error) {
      response.status(500).send(error);
    }
    if (!user) {
      response.status(401).json({
        message: 'Authentication failed'
      });
    } else if (user) {
      if (!user.authenticate(request.body.password)) {
        response.status(401).json({
          message: 'Authentication failed'
        });
      } else {
        const token = jwt.sign(user, process.env.SECRET, {
          expiresIn: moment().add(1, 'week').valueOf(),
        });
        response.status(200).json({
          message: 'Authentication successful',
          token
        });
      }
    }
  });
};
