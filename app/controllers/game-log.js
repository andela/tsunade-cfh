/* eslint no-else-return: "error" */
/* eslint object-shorthand: "error" */
/* eslint-env es6 */

/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

const GameRecords = mongoose.model('Records');


exports.getUserHistory = (req, res) => {
  const username = req.body.username;
  GameRecords.find({
    $or: [{
      gameCreator: username
    }, {
      players: {
        $elemMatch: {
          username
        }
      }
    }]
  }, (err, history) => {
    if (err) {
      return res.send(err);
    }
    if (!history || Object.keys(history).length < 1) {
      return res.status(400).json({
        success: false,
        message: 'You have no Game Records yet!!'
      });
    }
    return res.status(200).json(history);
  });
};
