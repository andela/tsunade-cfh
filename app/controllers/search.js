const mongoose = require('mongoose');

const User = mongoose.model('User');

/**
 * Gets all users from the database
 * @param {String} req description
 * @param {String[]} res description
 * @returns {String[]} description
 */
exports.users = (req, res) => {
  const query = req.params.inviteeUsername || '';
  if (query === '*') {
    User.find({ username: { $regex: /\w/ } }).limit(10)
      .exec((err, result) => {
        if (err) {
          return res.json(err);
        }
        res.json(result);
      });
  } else {
    User.find({ username: { $regex: query } }).limit(10)
      .exec((err, result) => {
        if (err) {
          return res.json(err);
        }
        res.json(result);
      });
  }
};
