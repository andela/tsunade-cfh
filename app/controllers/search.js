const mongoose = require('mongoose');

const User = mongoose.model('User');

/**
 * Gets all users from the database
 */
exports.users = (req, res) => {
  const query = req.params.inviteeEmail || '';
  User.find({ email: { $regex: query } }).limit(10)
    .exec((err, result) => {
      if (err) {
        return res.json(err);
      }
      res.json(result);
    });
};
