const express = require('express');
const logger = require('../config/Looger');
const router = express.Router();

const { Catalog } = require('../models/catalogs');
const { EachProduct, validateEachProduct } = require('../models/eachProduct');
const { Product } = require('../models/musicalInstrument');

router.get('/', async (req, res) => {
  try {
    const allProducts = await EachProduct.find();
    res.json(allProducts)
  } catch (error) {
    console.log(error)
  }
})


router.post('/', async (req, res) => {
  const { error } = validateEachProduct(req.body);
  console.log(req.body)
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
      name : req.body.name,
      numberInStock : req.body.numberInStock,
      price : req.body.price,
      groupInstrument : groupInstrument
    })
    res.json(newPro)
  } catch (error) {
    console.log('Something wrong' , error);
  }
})

router.get('/:linkRef', async (req, res ) => {
  const chooseOne = await EachProduct.findOne({
    linkRef : req.params.linkRef
  })
  if(!chooseOne) {
    return res.status(400).send("Invalid link reference")
  }
  res.json(chooseOne);
})


module.exports = router;