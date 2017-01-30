const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const User = mongoose.model('User');

exports.signup = (req, res) => {
  if (!req.body.name || !req.body.username || !req.body.email ||
    !req.body.password) {
    return res.status(400).json({
      success: false,
      msg: 'Please no input field can be empty!'
    });
  }
  const newUser = User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  newUser.save((err, user) => {
    if (err) {
      if (err.errmsg.includes('email')) {
        res.status(400).json({
          success: false,
          msg: 'email already exist'
        });
      } else if (err.errmsg.includes('username')) {
        res.status(400).json({
          success: false,
          msg: 'user already exist'
        });
      } else {
        res.status(400).json(err);
      }
    } else {
      const token = jwt.sign({
        id: user.id,
        exp: moment().add(7, 'd').valueOf()
      }, 'secret');
      res.status(201).json({
        success: true,
        msg: 'You have successfully signed up!',
        token
      });
    }
  });
};
