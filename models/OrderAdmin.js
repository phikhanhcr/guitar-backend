const mongoose = require('mongoose');
const Joi = require('joi');
const { ObjectId } = mongoose.Schema.Types
Joi.objectId = require('joi-objectid')(Joi);
var Schema = mongoose.Schema;

const OrderSchema = new Schema({
  userId: {
    type: ObjectId,
    ref: 'User',
  },
  cart: {
    idProduct: {
      type: ObjectId,
      ref: "EachProduct"
    },
    amount: {
      type: Number,
      require
    }
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
  payByCash: {
    type: Boolean,
    default: true
  },
  condition: {
    type: String,
    enum: ['dang-giao', 'da-giao', 'da-huy', 'dang-cho-xac-nhan'],
  }
})

function validateMyOrder(req) {
  const schema = {
    note: Joi.string(),
    payByCash: Joi.boolean(),
    userId: Joi.objectId().required(),
    name: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().required().email(),
    cart: Joi.object(),
  }
  return Joi.validate(req, schema)
}

const MyOrder = mongoose.model('MyOrder', OrderSchema, 'order');
module.exports.MyOrder = MyOrder;
module.exports.validateMyOrder = validateMyOrder;