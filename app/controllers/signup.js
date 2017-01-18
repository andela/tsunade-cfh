const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const User = mongoose.model('User');

exports.signup = (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.json({ success: false, msg: 'Please enter name, email and password.' });
  } else {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    // save the user
    newUser.save((err, user) => {
      if (err) {
        res.send(err);
      } else {
        const token = jwt.sign({
          id: user.id,
          exp: moment().add(7, 'd').valueOf()
        }, 'secret');
        res.json({
          success: true, msg: 'Created new user successfully.', token
        });
      }
    });
  }
};
