const mongoose = require('mongoose');
const Joi = require('joi');
const { ObjectId } = mongoose.Schema.Types
Joi.objectId = require('joi-objectid')(Joi);
var Schema = mongoose.Schema;

const noticeCustomer = new Schema({
  userId: {
    type: ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    default: ""
  }, 
  payByCash : {
    type : Boolean,
    default : true
  },
  condition : {
    type : String,
    enum : ['da-giao', 'da-huy', '']
  }
})

function validateDonHang(req) {
  const schema = {
    note : Joi.string(),
    payByCash : Joi.boolean(),
    name: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().required().email()
  }
  return Joi.validate(req, schema)
}

const DonHang = mongoose.model('DonHang', noticeCustomer, 'donhang');
module.exports.DonHang = DonHang;
module.exports.validateDonHang = validateDonHang;