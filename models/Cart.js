const mongoose = require('mongoose');
const Joi = require('joi');
const { eachProductSchema } = require('./eachProduct');
const { userSchema } = require('./User');
Joi.objectId = require('joi-objectid')(Joi);
var Schema = mongoose.Schema;

const cartSchema = new Schema({
  userId: {
    type: userSchema,
    require
  },
  cart: [{
    idProduct: {
      type: eachProductSchema,
      require
    },
    amount: {
      type: Number,
      require
    }
  }]
})

function validateCart(req) {
  const schema = {
    userId: Joi.objectId().required(),
    idProduct : Joi.objectId().required(),
    amount : Joi.number().required()
  }
  return Joi.validate(req, schema)
}

const Cart = mongoose.model('Cart', cartSchema, 'cart');
module.exports.Cart = Cart;
module.exports.validateCart = validateCart;