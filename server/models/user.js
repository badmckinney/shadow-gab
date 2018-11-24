const mongoose = require('mongoose');
// const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  screenname: {
    required: true,
    trim: true,
    type: String,
    minlength: 1,
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  }
});

// userSchema.methods.hashPassword = function (password) {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
// };
//
// userSchema.methods.comparePassword = function (password, hash) {
//   return bcrypt.compareSync(password, hash);
// };

const User = mongoose.model('User',userSchema);

module.exports = {User};
