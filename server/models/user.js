const mongoose = require('mongoose');
// const validator = require('validator');
// const jwt = require('jsonwebtoken');
// const _ = require('lodash');
// const bcrypt = require('bcryptjs');

// const UserSchema = new mongoose.Schema({
//   screenName: {
//     required: true,
//     trim: true,
//     type: String,
//     minlength: 1,
//     unique: true,
//   },
//   password: {
//     type: String,
//     require: true,
//     minlength: 6
//   },
//   tokens: [{
//     access: {
//       type: String,
//       required: true
//     },
//     token: {
//       type: String,
//       required: true
//     }
//   }]
// });

const User = mongoose.model('User', {
  screenname: {
    required: true,
    trim: true,
    type: String,
    minlength: 1,
    unique: true
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  }
});

module.exports = {User};
