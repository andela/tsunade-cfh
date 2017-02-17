const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const User = mongoose.model('User');

exports.signup = (req, res) => {
  const newUser = User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  if (!req.body.name || !req.body.username || !req.body.email ||
    !req.body.password) {
    res.status(400).json({
      msg: 'Please no input field can be empty!'
    });
  } else {
    newUser.save((err, user) => {
      if (err) {
        if (err.errmsg.includes('email')) {
          res.status(400).json({
            msg: 'email already exist, please use another email'
          });
        } else if (err.errmsg.includes('username')) {
          res.status(400).json({
            msg: 'user already exist, please use another username'
          });
        } else {
          res.status(400).json(err);
        }
      } else {
        const token = jwt.sign({
          _doc:{
            _id: user.id
          },
          exp: moment().add(7, 'd').valueOf(),
        }, 'secret');
        res.status(201).json({
          msg: 'You have successfully signed up!',
          token
        });
      }
    });
  }
};

