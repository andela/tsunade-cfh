var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var User = mongoose.model('User');

exports.signup = function (req, res) {
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.json({ success: false, msg: 'Please enter name, email and password.' });
  } else {
    var newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    // save the user
    newUser.save(function (err, user) {
      if (err) {
        res.send(err);
      } else {
        var token = jwt.sign({
          id: user._id,
          exp: moment().add(7, 'd').valueOf()
        }, 'secret');
        res.json({ success: true, msg: 'Created new user successfully.', token: token });
      }
    });
  }
};

