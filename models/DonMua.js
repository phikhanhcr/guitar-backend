const mongoose = require('mongoose');
const Joi = require('joi');
const { ObjectId } = mongoose.Schema.Types
Joi.objectId = require('joi-objectid')(Joi);
var Schema = mongoose.Schema;

const donMuaSchema = new Schema({
  userId: {
    type: ObjectId,
    ref: 'User',
  },
  cart: [{
    idProduct: {
      type: ObjectId,
      ref: "EachProduct"
    },
    amount: {
      type: Number,
      require
    }
  }]
})

function validateDonMua(req) {
  const schema = {

  }
  return Joi.validate(req, schema)
}

const DonMua = mongoose.model('DonMua', donMuaSchema, 'donMua');
module.exports.DonMua = DonMua;
module.exports.validateDonMua = validateDonMua;