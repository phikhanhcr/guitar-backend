const mongoose = require('mongoose');
const Joi = require('joi');
var Schema = mongoose.Schema;
const removeAccents = require('../middleware/removeAccents');
const { musicalSchema } = require('./musicalInstrument');

var eachProductSchema = new Schema({
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
  numberInStock: {
    type: Number,
    require
  },
  price: {
    type: Number,
    require
  },
  img: {
    type: String,
    default : "https://i.pinimg.com/originals/97/50/8f/97508f15f1061b9c94772adcfb8481d4.png",
    require
  },
  description: {
    type: String,
  }
})

function validateEachProduct(eachPro) {
  const schema = {
    name: Joi.string().required(),
    numberInStock: Joi.number().required(),
    price: Joi.number().required(),
    img: Joi.string().required(),
    description: Joi.string(),
    groupId: Joi.objectId().required()
  }
  return Joi.validate(eachPro, schema)
}

const EachProduct = mongoose.model('EachProduct', eachProductSchema, 'allProducts');
module.exports.EachProduct = EachProduct;
module.exports.eachProductSchema = eachProductSchema;
module.exports.validateEachProduct = validateEachProduct;