const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const User = mongoose.model('User');

exports.login = (request, response) => {
   User.findOne({ email: request.body.email},(error, user) => {
     if (error) {
       response.status(500).send(error);
     }
     if(!user) {
       response.status(401).json({
         success: false,
         message: 'Authentication failed'
       });
     } else if (user) {
       if(!user.authenticate(request.body.password)) {
         response.status(401).json({
           success: false,
           message: 'Authentication failed. Invalid Password'
         });
      }
      else {
        const token = jwt.sign(user, 'kjzdfhkjhfghzkjvhkashd,hdjgvmbxmvzbvbc', {
             expiresIn: moment().add(1,'week'),
           });
           response.status(200).json({
             success: true,
             message: 'Authentication successful. User logged in',
             token: token
           });
       }
     }
   });
};