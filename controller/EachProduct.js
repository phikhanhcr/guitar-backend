const logger = require('../config/Looger');
const { Catalog } = require('../models/catalogs');
const { EachProduct, validateEachProduct } = require('../models/eachProduct');
const { Product } = require('../models/musicalInstrument');
const multer = require('multer')
const cloudinary = require('cloudinary').v2;
const upload = multer({ dest: '../uploads' })



module.exports.getAllProduct = async (req, res) => {
  try {
    const allProducts = await EachProduct.find();
    res.json(allProducts)
  } catch (error) {
    console.log(error)
  }
}

module.exports.postProduct = async (req, res) => {
  const { error } = validateEachProduct(req.body);
  console.log(error)
  if (error) {
    logger.error('Bad request, check req.body');
    return res.status(400).send("Bad request, check req.body")
  }
  const groupInstrument = await Product.findById(req.body.groupId);
  if (!groupInstrument) {
    logger.error('Plz check group id');
    return res.status(400).send("Bad request, check group id ")
  }

  try {
    const newPro = await EachProduct.create({
      name: req.body.name,
      numberInStock: req.body.numberInStock,
      price: req.body.price,
      img: req.body.img,
      groupInstrument: groupInstrument,
      description: req.body.description
    })
    res.json(newPro)
  } catch (error) {
    console.log('Something wrong', error);
  }
}


module.exports.getGroup = async (req, res) => {
  const group = await Product.findOne({
    linkRef: req.params.group
  })
  if (!group) {
    return res.status(400).send("Invalid group Id")
  }
  try {
    const allProductsFollowGroup = await EachProduct.find({
      groupInstrument: group
    })
    res.json(allProductsFollowGroup)
  } catch (error) {
    console.log(error)
  }
}

module.exports.getSpecificItem = async (req, res) => {
  const group = await Product.findOne({
    linkRef: req.params.group
  })
  if (!group) {
    return res.status(400).send("Invalid group Id")
  }
  console.log(group)
  try {
    const allProductsFollowGroup = (await EachProduct.find({
      groupInstrument: group
    })).filter(ele => {
      return ele.linkRef === req.params.item
    })
    res.json(allProductsFollowGroup)
  } catch (error) {
    console.log(error)
  }
}

module.exports.deleteItem = async (req, res) => {
  console.log(req.params.item)
  try {
    await EachProduct.findByIdAndRemove(req.params.item)
    return res.json({
      message : "successful"
    })
  } catch (error) {
    console.log("hi")
    console.log(error)
  }
}