const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { catalogSchema } = require('./catalogs')
var Schema = mongoose.Schema;
const removeAccents = require('../middleware/removeAccents')

var musicalSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique :true,
    trim: true
  },
  linkRef: {
    type: String,
    trim: true,
    unique :true,
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
  catalog: {
    type: catalogSchema,
    require
  }
})

function validateProduct(product) {
  const schema = {
    name: Joi.string().required(),
    catalogId: Joi.objectId().required()
  }
  return Joi.validate(product, schema)
}

const Product = mongoose.model('Musical', musicalSchema, 'musicalInst');
module.exports.Product = Product;
module.exports.validateProduct = validateProduct;
module.exports.musicalSchema = musicalSchema;