const mongoose = require('mongoose');
const Joi = require('joi');
var Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
  email: {
    type: String,
    require,
    unique: true
  },
  password: {
    type: String,
    require
  },
  isAdmin: {
    type: String,
    default: false
  }
})
function validateLogin(req) {
  const schema = {
    email: Joi.string().required().email(),
    password: Joi.string().required()
  }
  return Joi.validate(req, schema)
}

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({_id : this._id }, process.env.JWTKey);
  return token;
}
const User = mongoose.model('User', userSchema, 'users');
module.exports.User = User;
module.exports.userSchema = userSchema;
module.exports.validateLogin = validateLogin;