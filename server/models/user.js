// load in dependencies
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// schema for users
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

// creates a new model based on the above schema
const User = mongoose.model('User',userSchema);

module.exports = {User};
