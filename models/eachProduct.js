const mongoose = require('mongoose');
const Joi = require('joi');
var Schema = mongoose.Schema;
const removeAccents = require('../middleware/removeAccents');
const { musicalSchema } = require('./musicalInstrument');

var eachProduct = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  linkRef: {
    type: String,
    trim: true,
    default: function () {
      return removeAccents(this.name.toLowerCase()).split(" ").join('-');
    }
  },
  createAt: {
    type: Date,
    default: new Date()
  },
  editAt: {
    type: Date
  },
  groupInstrument: {
    type: musicalSchema,
    require
  },
  numberInStock : {
    type : Number,
    require
  },
  price : {
    type : Number,
    require
  }
})

function validateEachProduct(eachPro) {
  const schema = {
    name: Joi.string().required(),
    numberInStock : Joi.number().required(),
    price : Joi.number().required(),
    groupId: Joi.objectId().required()
  }
  return Joi.validate(eachPro, schema)
}

const EachProduct = mongoose.model('EachProduct', eachProduct, 'allProducts');
module.exports.EachProduct = EachProduct;
module.exports.validateEachProduct = validateEachProduct;