const mongoose = require('mongoose');
const Joi = require('joi');
var Schema = mongoose.Schema;
const userSchema = new Schema({
  email : {
    type : String,
    require,
    unique : true
  },
  password : {
    type : String,
    require
  },
  isAdmin : {
    type : String , 
    default : false
  }
})
function validateLogin(req) {
  const schema = {
    email: Joi.string().required().email(),
    password : Joi.string().required()
  }
  return Joi.validate(req, schema)
}
const User = mongoose.model('User', userSchema, 'users');
module.exports.User = User;
module.exports.userSchema = userSchema;
module.exports.validateLogin = validateLogin;