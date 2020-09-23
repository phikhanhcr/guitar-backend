const mongoose = require('mongoose');
const Joi = require('joi');
var Schema = mongoose.Schema;
const removeAccents = require('../middleware/removeAccents')
var catalogSchema = new Schema({
  name : {
    type : String, 
    required: true, 
    trim : true,
    unique : true
  },
  linkRef: {
    type : String, 
    unique : true,
    trim : true,
    default : function() {
      return removeAccents(this.name.toLowerCase()).split(" ").join('-');
    }
  },
  createAt : {
    type : Date, 
    default : new Date()
  }, editAt : {
    type : Date
  }
})

function validateCatalog(catalog) {
  const schema = {
    name: Joi.string().required()
  }
  return Joi.validate(catalog, schema)
}

const Catalog = mongoose.model('Catalog', catalogSchema, 'catalogs');
module.exports.Catalog = Catalog;
module.exports.validateCatalog = validateCatalog;